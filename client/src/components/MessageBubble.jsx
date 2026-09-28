import Avatar from "./chat/Avatar";

function formatTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function MessageBubble({
  message,
  isOwn,
  senderName,
  isGroup = false,
  showSender = true,
}) {
  const displayName =
    typeof senderName === "object"
      ? senderName?.name || "Unknown user"
      : senderName || "Unknown user";

  const imageSrc = message.imageUrl?.startsWith("http")
    ? message.imageUrl
    : `${import.meta.env.VITE_API_URL.replace(/\/api$/, "")}${message.imageUrl}`;

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div className={`message-row ${isOwn ? "message-row-own" : ""}`}>
        {!isOwn &&
          (isGroup && showSender ? (
            <Avatar name={displayName} size="sm" />
          ) : (
            <div className="w-9 shrink-0" />
          ))}

        <div
          className={`max-w-[min(680px,78vw)] ${isOwn ? "items-end" : "items-start"}`}
        >
          {isGroup && !isOwn && showSender && (
            <p className="mb-1 ml-1 text-[11px] font-semibold text-blue-600">
              {displayName}
            </p>
          )}

          <div
            className={`message-bubble ${isOwn ? "message-bubble-own" : "message-bubble-other"}`}
          >
            {message.imageUrl && (
              <img
                src={imageSrc}
                alt="Shared image"
                className="mb-2 max-h-80 max-w-full rounded-xl object-contain"
              />
            )}
            {message.content && (
              <p className="whitespace-pre-wrap break-words">
                {message.content}
              </p>
            )}
          </div>

          <div
            className={`mt-1 flex items-center gap-1 px-1 text-[10px] text-slate-400 ${isOwn ? "justify-end" : ""}`}
          >
            <span>{formatTime(message.createdAt)}</span>
            {isOwn && <span className="text-blue-500">✓✓</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;
