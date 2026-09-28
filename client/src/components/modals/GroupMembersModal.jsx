import Avatar from "../chat/Avatar";

function GroupMembersModal({ conversation, currentUserId, onClose }) {
  if (!conversation?.isGroup) return null;

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className="modal-card">
        <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {conversation.name || "Unnamed group"}
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              {conversation.participants?.length || 0} members
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="icon-button border-0 bg-slate-50 text-slate-400 hover:bg-slate-100"
          >
            ×
          </button>
        </div>

        <div className="max-h-[55vh] overflow-y-auto p-3">
          {conversation.participants?.map((participant) => {
            const id = String(participant._id || participant.id);
            const isCurrentUser = id === String(currentUserId);
            return (
              <div
                key={id}
                className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-slate-50"
              >
                <Avatar name={participant.name} size="md" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-slate-700">
                      {participant.name || "Unknown User"}
                    </p>
                    {isCurrentUser && (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                        You
                      </span>
                    )}
                  </div>
                  <p className="truncate text-xs text-slate-400">
                    {participant.email}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end border-t border-slate-100 px-5 py-4">
          <button type="button" onClick={onClose} className="primary-button">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default GroupMembersModal;
