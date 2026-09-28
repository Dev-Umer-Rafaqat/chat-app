import ConversationItem from "./ConversationItem";

function ConversationList({
  conversations = [],
  activeId,
  onSelect,
  currentUserId,
}) {
  if (conversations.length === 0) {
    return (
      <div className="mx-2 rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center">
        <p className="text-sm font-medium text-slate-500">
          No conversations yet
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Start a chat with someone below.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation._id}
          conversation={conversation}
          currentUserId={currentUserId}
          active={String(activeId) === String(conversation._id)}
          onClick={() => onSelect(conversation)}
        />
      ))}
    </div>
  );
}

export default ConversationList;
