import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

function getId(value) {
  if (!value) return "";
  if (typeof value === "object") return String(value._id || value.id || "");
  return String(value);
}

function sameDay(first, second) {
  if (!first || !second) return false;
  const a = new Date(first);
  const b = new Date(second);
  return a.toDateString() === b.toDateString();
}

function dateLabel(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function MessageList({
  messages = [],
  currentUserId,
  knownUsers = [],
  isGroup = false,
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getSender = (message) => {
    if (message.sender?.name) return message.sender.name;
    const senderId = getId(message.sender);
    return (
      knownUsers.find((item) => getId(item) === senderId)?.name ||
      "Unknown user"
    );
  };

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 text-center">
        <div>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
            💬
          </div>
          <h3 className="mt-4 text-sm font-bold text-slate-700">
            No messages yet
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Send a message to start the conversation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="message-scroll flex-1 overflow-y-auto px-5 py-6 sm:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-2">
        {messages.map((message, index) => {
          const previous = messages[index - 1];
          const senderId = getId(message.sender);
          const previousSenderId = getId(previous?.sender);
          const showSender =
            !previous ||
            senderId !== previousSenderId ||
            !sameDay(message.createdAt, previous.createdAt);
          const showDate =
            !previous || !sameDay(message.createdAt, previous.createdAt);

          return (
            <div key={message._id}>
              {showDate && (
                <div className="date-divider">
                  <span>{dateLabel(message.createdAt)}</span>
                </div>
              )}
              <MessageBubble
                message={message}
                isOwn={senderId === getId(currentUserId)}
                senderName={getSender(message)}
                isGroup={isGroup}
                showSender={showSender}
              />
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

export default MessageList;
