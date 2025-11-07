import React, { useState, useRef, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import { BsEmojiSmile } from "react-icons/bs";
import { GrAttachment } from "react-icons/gr";
import logo from "../../assets/images/telejam.png";
import Menu from "./Menu";

const ChatInput = ({ onSend }) => {
  const [message, setMessage] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const textareaRef = useRef(null);
  const pickerRef = useRef(null);
  const buttonRef = useRef(null);

  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    // onSend(message);
    console.log(message);
    setMessage("");
    textareaRef.current.style.height = "auto";
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full ">
      {/* Emoji Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setShowPicker((prev) => !prev)}
        className="absolute z-10 left-5 bottom-6 text-xl text-gray-400 hover:text-white duration-300 cursor-pointer"
      >
        <BsEmojiSmile />
      </button>

      {/* Emoji Picker */}
      {showPicker && (
        <div
          ref={pickerRef}
          className="absolute bottom-16 left-0 z-20 bg-black/90 rounded-lg shadow-lg"
        >
          <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark"/>
        </div>
      )}

      {/* Expanding Textarea */}
      <form className="flex items-end gap-3 " onSubmit={handleSend}>
        <div className="w-full relative">
          <textarea
            ref={textareaRef}
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={1}
            className="max-h-40 w-full px-[52px] py-4 hover:ring-white/30 outline-none ring-white/10 focus:ring-purple-500/20 focus:ring-2 ring rounded-3xl duration-300 text-white bg-black/65 resize-none hide-chat-input-scrollbar"
          />
          {/* Media attachment menu button */}
          <div className="absolute right-5 bottom-6 flex items-center justify-center">
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="text-xl text-gray-400 hover:text-white duration-300 cursor-pointer"
            >
              <GrAttachment />
            </button>
            <Menu
              menuOpen={menuOpen}
              setMenuOpen={setMenuOpen}
              isMainMenu={false}
            />
          </div>
        </div>

        {/* Send button */}
        <button
          type="submit"
          className="mb-3 text-xl size-10 bg-blue-400/80 p-2.5 rounded-full cursor-pointer hover:scale-110 duration-300"
        >
          <img src={logo} alt="" />
        </button>
      </form>
    </div>
  );
};
export default ChatInput;
