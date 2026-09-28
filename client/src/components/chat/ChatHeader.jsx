import { useState } from "react";
import Avatar from "./Avatar";
import Icon from "./Icon";
import NotificationPanel from "./NotificationPanel";

function ChatHeader({
  activeConversation,
  currentUserId,
  connectionStatus,
  notifications,
  pushStatus,
  onEnablePushNotifications,
  onSelectNotification,
  onOpenMembers,
  onLogout,
}) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const otherUser = activeConversation?.participants?.find(
    (user) => String(user._id || user.id) !== String(currentUserId),
  );

  const title = activeConversation
    ? activeConversation.isGroup
      ? activeConversation.name || "Unnamed group"
      : otherUser?.name || "Unknown user"
    : "Select a conversation";

  const subtitle = activeConversation
    ? activeConversation.isGroup
      ? `${activeConversation.participants?.length || 0} members`
      : "Direct message"
    : "Choose a conversation to start chatting";

  const isConnected = connectionStatus === "connected";

  return (
    <header className="chat-header">
      <div className="flex min-w-0 items-center gap-3">
        {activeConversation ? (
          <Avatar
            name={title}
            isGroup={activeConversation.isGroup}
            size="lg"
            online={isConnected && !activeConversation.isGroup}
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            ?
          </div>
        )}
        <div className="min-w-0">
          <h2 className="truncate text-sm font-bold text-slate-900">{title}</h2>
          <div className="mt-0.5 flex items-center gap-2">
            {activeConversation && !activeConversation.isGroup && (
              <span
                className={`h-1.5 w-1.5 rounded-full ${isConnected ? "bg-emerald-500" : "bg-slate-300"}`}
              />
            )}
            <p className="truncate text-xs text-slate-400">{subtitle}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {activeConversation?.isGroup && (
          <button
            type="button"
            onClick={onOpenMembers}
            className="header-action hidden sm:flex"
            title="Group members"
          >
            <Icon name="users" size={18} />
            <span>{activeConversation.participants?.length || 0}</span>
          </button>
        )}

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsNotificationOpen((open) => !open)}
            className="header-action relative"
            aria-label="Notifications"
            title="Notifications"
          >
            <Icon name="bell" size={18} />
            {notifications.length > 0 && (
              <span className="notification-dot">
                {notifications.length > 99 ? "99+" : notifications.length}
              </span>
            )}
          </button>
          {isNotificationOpen && (
            <NotificationPanel
              notifications={notifications}
              pushStatus={pushStatus}
              onEnablePushNotifications={onEnablePushNotifications}
              onSelectNotification={(notification) => {
                onSelectNotification(notification);
                setIsNotificationOpen(false);
              }}
            />
          )}
        </div>

        <div className="connection-pill">
          <span
            className={`h-2 w-2 rounded-full ${isConnected ? "bg-emerald-500" : connectionStatus === "connecting" ? "bg-amber-400" : "bg-red-400"}`}
          />
          <span className="hidden md:inline">
            {isConnected
              ? "Connected"
              : connectionStatus === "connecting"
                ? "Connecting"
                : "Disconnected"}
          </span>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="header-action px-3 text-xs font-semibold"
          title="Logout"
        >
          <Icon name="logout" size={17} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}

export default ChatHeader;
