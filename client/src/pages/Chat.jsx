import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { api } from "../services/api";
import ChatLayout from "../components/ChatLayout";
import useChatPush from "../hooks/chat/useChatPush";
import useChatRealtime, {
  normalizeNotification,
} from "../hooks/chat/useChatRealtime";

function Chat() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [conversations, setConversations] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const { pushStatus, handleEnablePushNotifications } = useChatPush();
  const { connectionStatus, sendMessage } = useChatRealtime({
    user,
    activeConversation,
    setMessages,
    setNotifications,
  });

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [conversationData, userData, notificationData] =
          await Promise.all([
            api.getConversations(),
            api.getUsers(),
            api.getNotifications(),
          ]);

        setConversations(conversationData);
        setUsers(userData);
        setNotifications(notificationData.map(normalizeNotification));

        const conversationId = searchParams.get("conversationId");
        const conversation = conversationData.find(
          (item) => String(item._id) === String(conversationId),
        );

        if (conversation) {
          await openConversation(conversation, { fromNotification: true });
          navigate("/chat", { replace: true });
        }
      } catch (error) {
        console.error("Failed to load chat data:", error);
      }
    }

    async function openConversation(conversation, options = {}) {
      setActiveConversation(conversation);
      await loadMessages(conversation._id);
      await clearConversationNotifications(conversation._id);

      if (options.fromNotification) {
        setNotifications((prev) =>
          prev.filter(
            (item) => String(item.conversationId) !== String(conversation._id),
          ),
        );
      }
    }

    async function loadMessages(conversationId) {
      const data = await api.getMessages(conversationId);
      setMessages(data);
    }

    async function clearConversationNotifications(conversationId) {
      try {
        await api.deleteConversationNotifications(String(conversationId));
      } catch (error) {
        console.error("Failed to remove conversation notifications:", error);
      }
    }

    loadInitialData();
  }, [navigate, searchParams]);

  const loadMessages = useCallback(async (conversationId) => {
    setLoadingMessages(true);
    try {
      setMessages(await api.getMessages(conversationId));
    } catch (error) {
      console.error("Failed to load messages:", error);
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  const clearConversationNotifications = useCallback(async (conversationId) => {
    try {
      await api.deleteConversationNotifications(String(conversationId));
    } catch (error) {
      console.error("Failed to remove conversation notifications:", error);
    }

    setNotifications((prev) =>
      prev.filter(
        (notification) =>
          String(notification.conversationId) !== String(conversationId),
      ),
    );
  }, []);

  const handleSelectConversation = useCallback(
    async (conversation) => {
      setActiveConversation(conversation);
      await loadMessages(conversation._id);
      await clearConversationNotifications(conversation._id);
    },
    [clearConversationNotifications, loadMessages],
  );

  const handleSelectNotification = useCallback(
    async (notification) => {
      const conversation = conversations.find(
        (item) => String(item._id) === String(notification.conversationId),
      );
      if (!conversation) return;
      await handleSelectConversation(conversation);
    },
    [conversations, handleSelectConversation],
  );

  const handleSelectUser = async (selectedUser) => {
    try {
      const conversation = await api.createConversation(selectedUser._id);
      setConversations((prev) =>
        prev.some((item) => String(item._id) === String(conversation._id))
          ? prev
          : [conversation, ...prev],
      );
      await handleSelectConversation(conversation);
    } catch (error) {
      console.error("Failed to start conversation:", error);
    }
  };

  const handleSendMessage = (content) => {
    if (activeConversation) sendMessage(activeConversation._id, content);
  };

  const handleSendImage = async (file) => {
    if (!activeConversation) return;
    try {
      const result = await api.uploadImage(activeConversation._id, file);
      sendMessage(activeConversation._id, "", result.imageUrl);
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };

  const handleCreateGroup = async (name, participantIds) => {
    try {
      const group = await api.createGroup(name, participantIds);
      setConversations((prev) => [group, ...prev]);
      setActiveConversation(group);
      setMessages([]);
      return group;
    } catch (error) {
      console.error("Group creation failed:", error);
      alert(error.message);
      throw error;
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <ChatLayout
      conversations={conversations}
      users={users}
      activeConversation={activeConversation}
      messages={loadingMessages ? [] : messages}
      currentUserId={user?._id || user?.id}
      currentUser={user}
      knownUsers={[...(activeConversation?.participants || []), ...users]}
      connectionStatus={connectionStatus}
      notifications={notifications}
      pushStatus={pushStatus}
      onEnablePushNotifications={handleEnablePushNotifications}
      onSelectConversation={handleSelectConversation}
      onSelectNotification={handleSelectNotification}
      onSelectUser={handleSelectUser}
      onSendMessage={handleSendMessage}
      onSendImage={handleSendImage}
      onLogout={handleLogout}
      onCreateGroup={handleCreateGroup}
    />
  );
}

export default Chat;
