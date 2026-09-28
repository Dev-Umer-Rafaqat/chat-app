function UserList({ users, onSelect }) {
  return (
    <div className="overflow-y-auto">
      {users.length === 0 ? (
        <p className="text-sm text-gray-400 p-4">No other users found.</p>
      ) : (
        users.map((user) => (
          <button
            key={user._id}
            onClick={() => onSelect(user)}
            className="w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition"
          >
            <p className="font-medium text-gray-800">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </button>
        ))
      )}
    </div>
  );
}

export default UserList;
