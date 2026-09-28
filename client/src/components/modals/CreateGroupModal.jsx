import { useState } from "react";
import Avatar from "../chat/Avatar";
import Icon from "../chat/Icon";

function CreateGroupModal({ users, currentUserId, onClose, onCreate }) {
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isCreating, setIsCreating] = useState(false);

  const availableUsers = users.filter(
    (item) => String(item._id || item.id) !== String(currentUserId),
  );

  const toggleMember = (userId) => {
    setSelectedMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleCreate = async () => {
    const name = groupName.trim();
    if (!name) return alert("Please enter a group name.");
    if (!selectedMembers.length)
      return alert("Please select at least one member.");

    try {
      setIsCreating(true);
      await onCreate(name, selectedMembers);
      onClose();
    } catch (error) {
      console.error("Group creation failed:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) =>
        event.target === event.currentTarget && !isCreating && onClose()
      }
    >
      <div className="modal-card">
        <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Create a group
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Give your group a name and choose members.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isCreating}
            className="icon-button border-0 bg-slate-50 text-slate-400 hover:bg-slate-100"
          >
            <Icon name="x" size={17} />
          </button>
        </div>

        <div className="space-y-5 p-5">
          <div>
            <label htmlFor="group-name" className="field-label">
              Group name
            </label>
            <input
              id="group-name"
              value={groupName}
              onChange={(event) => setGroupName(event.target.value)}
              maxLength={100}
              placeholder="e.g. Development Team"
              disabled={isCreating}
              className="field-input"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="field-label mb-0">Members</label>
              <span className="text-xs text-slate-400">
                {selectedMembers.length} selected
              </span>
            </div>
            <div className="max-h-64 overflow-y-auto rounded-xl border border-slate-200 p-1">
              {availableUsers.map((item) => {
                const id = String(item._id || item.id);
                const selected = selectedMembers.includes(id);
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => toggleMember(id)}
                    disabled={isCreating}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition ${selected ? "bg-blue-50" : "hover:bg-slate-50"}`}
                  >
                    <Avatar name={item.name} size="sm" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-slate-700">
                        {item.name || "Unknown User"}
                      </span>
                      <span className="block truncate text-xs text-slate-400">
                        {item.email}
                      </span>
                    </span>
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full border text-xs ${selected ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 text-transparent"}`}
                    >
                      ✓
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isCreating}
            className="secondary-button"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreate}
            disabled={isCreating}
            className="primary-button"
          >
            {isCreating ? "Creating..." : "Create group"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateGroupModal;
