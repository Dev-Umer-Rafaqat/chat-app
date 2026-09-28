import { useRef, useState } from "react";
import Icon from "./chat/Icon";

function MessageInput({ onSend, onSendImage, disabled }) {
  const [text, setText] = useState("");
  const fileRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const value = text.trim();
    if (!value || disabled) return;
    onSend(value);
    setText("");
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file && onSendImage) onSendImage(file);
    event.target.value = "";
  };

  return (
    <div className="border-t border-slate-200 bg-white px-4 py-3 sm:px-6 sm:py-4">
      <form
        onSubmit={handleSubmit}
        className="composer mx-auto flex max-w-5xl items-center gap-2"
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleImageChange}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={disabled}
          className="composer-icon"
          title="Attach image"
          aria-label="Attach image"
        >
          <Icon name="paperclip" size={19} />
        </button>
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder={disabled ? "Connecting..." : "Type a message..."}
          disabled={disabled}
          className="min-w-0 flex-1 bg-transparent px-2 text-sm text-slate-800 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={disabled || !text.trim()}
          className="send-button"
          title="Send message"
          aria-label="Send message"
        >
          <Icon name="send" size={17} />
        </button>
      </form>
      <p className="mx-auto mt-2 hidden max-w-5xl px-1 text-[10px] text-slate-400 sm:block">
        Press Enter to send · Images are supported
      </p>
    </div>
  );
}

export default MessageInput;
