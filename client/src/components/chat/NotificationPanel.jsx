import Icon from "./Icon";
import Avatar from "./Avatar";

function NotificationPanel({
  notifications = [],
  pushStatus,
  onEnablePushNotifications,
  onSelectNotification,
}) {
  return (
    <div className="absolute right-0 top-12 z-50 w-[360px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
          <p className="mt-0.5 text-xs text-slate-400">
            Stay up to date with new messages.
          </p>
        </div>
        {notifications.length > 0 && (
          <span className="unread-badge">{notifications.length}</span>
        )}
      </div>

      <div className="border-b border-slate-100 bg-slate-50/70 px-4 py-3">
        {pushStatus === "enabled" && (
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-600">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
              <Icon name="check" size={14} />
            </span>
            Browser notifications are enabled
          </div>
        )}

        {pushStatus === "disabled" && (
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-slate-700">
                Browser notifications
              </p>
              <p className="mt-0.5 text-[11px] text-slate-400">
                Get notified when you are away.
              </p>
            </div>
            <button
              type="button"
              onClick={onEnablePushNotifications}
              className="rounded-lg bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-slate-800"
            >
              Enable
            </button>
          </div>
        )}

        {pushStatus === "enabling" && (
          <p className="text-xs text-slate-500">Enabling notifications...</p>
        )}
        {pushStatus === "denied" && (
          <p className="text-xs font-medium text-red-600">
            Notifications are blocked in your browser settings.
          </p>
        )}
        {pushStatus === "unsupported" && (
          <p className="text-xs text-slate-400">
            Push notifications are not supported by this browser.
          </p>
        )}
        {pushStatus === "checking" && (
          <p className="text-xs text-slate-400">
            Checking notification settings...
          </p>
        )}
      </div>

      <div className="max-h-[360px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <Icon name="bell" size={20} />
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-700">
              You're all caught up
            </p>
            <p className="mt-1 text-xs text-slate-400">
              No new messages to review.
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <button
              key={`${notification.id}-${notification.messageId}`}
              type="button"
              onClick={() => onSelectNotification(notification)}
              className="flex w-full gap-3 border-b border-slate-100 px-4 py-3 text-left transition hover:bg-slate-50 last:border-b-0"
            >
              <Avatar name={notification.senderName} size="sm" />
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-semibold text-slate-800">
                    {notification.senderName || "Unknown user"}
                  </span>
                  <span className="text-[10px] font-medium text-blue-600">
                    New
                  </span>
                </span>
                <span className="mt-1 line-clamp-2 block text-xs leading-5 text-slate-500">
                  {notification.content}
                </span>
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

export default NotificationPanel;
