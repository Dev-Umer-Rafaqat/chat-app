import Icon from "./Icon";

function Avatar({ name, isGroup = false, size = "md", online = false }) {
  const sizes = {
    sm: "h-9 w-9 text-xs",
    md: "h-11 w-11 text-sm",
    lg: "h-12 w-12 text-base",
  };

  const initial = name?.trim()?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="relative shrink-0">
      <div
        className={`flex ${sizes[size] || sizes.md} items-center justify-center rounded-full font-semibold ${
          isGroup ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"
        }`}
      >
        {isGroup ? <Icon name="users" size={18} /> : initial}
      </div>

      {online && !isGroup && (
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
      )}
    </div>
  );
}

export default Avatar;
