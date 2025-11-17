import React, { useState, useRef, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import { BsEmojiSmile } from "react-icons/bs";
import { GrAttachment } from "react-icons/gr";
import logo from "../../assets/images/telejam.png";
import Menu from "./Menu";
import useMessageStore from "../../store/MessagesStore";
import useApplicationStore from "../../store/ApplicationStore";
import KeyboardSound from "../../lib/KeyboardSounds";
import { handleImage } from "../../lib/ProfileFunctions";
import MenuBtn from "./MenuBtn";
import { FaMicrophoneAlt } from "react-icons/fa";
import { IoMdImages } from "react-icons/io";
import { IoClose } from "react-icons/io5";

const ChatInput = () => {
  const {
    send_message_by_id,
    selected_user,
    draft_messages,
    draft_images,
    set_draft_message,
    set_draft_image,
    clear_draft,
    all_messages_by_id,
  } = useMessageStore();
  const { enable_sound } = useApplicationStore();
  const message = draft_messages[selected_user?._id] || "";
  const imagePreview = draft_images[selected_user?._id] || null;
  const [showPicker, setShowPicker] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const fileInputRef = useRef(null);

  const textareaRef = useRef(null);
  const pickerRef = useRef(null);
  const buttonRef = useRef(null);

  const { playRandomKeyStrokeSound } = KeyboardSound();

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim() && !imagePreview) return;
    if (enable_sound) playRandomKeyStrokeSound();

    const new_message = {
      text: message.trim(),
      image: imagePreview,
    };

    send_message_by_id(new_message, all_messages_by_id.length ? true : false);

    // Clear draft for this user
    clear_draft(selected_user._id);

    if (fileInputRef.current) fileInputRef.current.value = null;
    textareaRef.current.style.height = "auto";
  };

  const setMessage = (value) => {
    const newValue = typeof value === "function" ? value(message) : value;
    set_draft_message(selected_user._id, newValue);
  };

  const setImagePreview = (value) => {
    set_draft_image(selected_user._id, value);
  };

  const removeImage = () => {
    set_draft_image(selected_user._id, null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
    if (enable_sound) playRandomKeyStrokeSound();
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";

      // Only set scrollHeight if there's actual content
      if (message.trim()) {
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
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
          <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" />
        </div>
      )}

      {/* Expanding Textarea */}
      <div className="space-y-3">
        {imagePreview && (
          <div className="px-10">
            <div className="w-32 hover:w-60 duration-300 bg-dark_purple/80 rounded-xl overflow-hidden relative ring ring-purple-500/30 shadow-2xl shadow-gray-800">
              <img
                className="object-center object-contain duration-300 w-full"
                src={imagePreview || ""}
                alt="Image to upload."
              />
              <button
                className="absolute top-1 right-1 duration-300 bg-black/70 text-red-400/70 hover:bg-black hover:text-red-400 text-sm p-0.5 rounded-full cursor-pointer"
                type="button"
                onClick={removeImage}
              >
                <IoClose />
              </button>
            </div>
          </div>
        )}

        <form className="flex items-end gap-3 " onSubmit={handleSend}>
          <div className="w-full relative">
            <textarea
              ref={textareaRef}
              placeholder="Message"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (enable_sound) playRandomKeyStrokeSound();
              }}
              rows={1}
              className="max-h-40 w-full px-[52px] py-4 hover:ring-white/30 outline-none ring-white/10 focus:ring-purple-500/30 focus:ring-2 ring rounded-3xl duration-300 text-white bg-black/65 resize-none hide-chat-input-scrollbar text-sm"
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
                positioningAndSize={"w-[300px] h-[250px] -bottom-7 -right-5"}
              >
                <MenuBtn func={() => {}}>
                  <FaMicrophoneAlt className="text-xl" />
                  <p className="text-sm">Voice Note</p>
                </MenuBtn>

                <MenuBtn func={() => fileInputRef.current.click()}>
                  <IoMdImages className="text-xl" />
                  <p className="text-sm">Upload Image</p>
                </MenuBtn>
              </Menu>
            </div>
            <input
              type="file"
              accept="image/png, image/jpeg"
              id=""
              name=""
              ref={fileInputRef}
              onChange={(e) => handleImage(e, setImagePreview, "image_upload")}
              hidden={true}
            />
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
    </div>
  );
};
export default ChatInput;
