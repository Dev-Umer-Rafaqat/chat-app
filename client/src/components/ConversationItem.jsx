import Avatar from "./chat/Avatar";

function ConversationItem({ conversation, active, onClick, currentUserId }) {
  const otherUser = conversation.participants?.find(
    (user) => String(user._id || user.id) !== String(currentUserId),
  );

  const title = conversation.isGroup
    ? conversation.name || "Unnamed group"
    : otherUser?.name || "Conversation";

  const subtitle = conversation.isGroup
    ? `${conversation.participants?.length || 0} members`
    : otherUser?.email || "Direct message";

  const unreadCount = Number(conversation.unreadCount || 0);
  const lastMessage =
    conversation.lastMessage?.content || conversation.lastMessage;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`conversation-item ${active ? "conversation-item-active" : ""}`}
    >
      <Avatar name={title} isGroup={conversation.isGroup} />

      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="truncate text-sm font-semibold text-slate-800">
            {title}
          </span>
          {conversation.isGroup && (
            <span className="conversation-badge">Group</span>
          )}
        </span>

        <span className="mt-1 flex items-center justify-between gap-2">
          <span className="truncate text-xs text-slate-400">
            {lastMessage || subtitle}
          </span>
          {unreadCount > 0 && (
            <span className="unread-badge">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </span>
      </span>
    </button>
  );
}

export default ConversationItem;
