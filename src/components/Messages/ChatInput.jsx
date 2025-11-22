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
import { GoTrash } from "react-icons/go";
import { IoCloudUploadOutline } from "react-icons/io5";
import { useVoiceRecording } from "../../hooks/useVoiceRecording";
import RecordingWaveform from "./RecordingWaveform";
import { createPortal } from "react-dom";
import PortalBackground from "../Misc/PortalBackground";
import ModalWrapper from "../Misc/ModalWrapper";
import useAuthStore from "../../store/AuthStore";

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
    is_recording,
    send_voice_message,
    set_is_recording,
  } = useMessageStore();
  const { enable_sound, theme } = useApplicationStore();
  const { socket } = useAuthStore.getState();
  const [showPicker, setShowPicker] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toggleAnySpaceClickingPortal, setToggleAnySpaceClickingPortal] =
    useState(false);
  const [toggleCancelRecordingPortal, setToggleCancelRecordingPortal] =
    useState(false);

  const [analyser, setAnalyser] = useState(null);
  const fileInputRef = useRef(null);

  const message = draft_messages[selected_user?._id] || "";
  const imagePreview = draft_images[selected_user?._id] || null;

  const textareaRef = useRef(null);
  const pickerRef = useRef(null);
  const buttonRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const {
    startRecording,
    stopRecording,
    cancelRecording,
    recordingTime,
    formatTime,
  } = useVoiceRecording();

  const { playRandomKeyStrokeSound } = KeyboardSound();

  const handleSend = (e) => {
    e.preventDefault();

    emitTypingEvent(false);

    if (is_recording) {
      handleStopRecording();
      return;
    }

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

  // const handleInputChange = (e) => {
  //   const newValue = e.target.value;
  //   set_draft_message(selected_user._id, newValue);

  //   // Emit typing event
  //   if (socket && selected_user) {
  //     socket.emit("user_typing", {
  //       to: selected_user._id,
  //       is_typing: true,
  //     });

  //     // Clear previous timeout
  //     if (typingTimeoutRef.current) {
  //       clearTimeout(typingTimeoutRef.current);
  //     }

  //     // Stop typing after 3 seconds of no input
  //     typingTimeoutRef.current = setTimeout(() => {
  //       socket.emit("user_typing", {
  //         to: selected_user._id,
  //         is_typing: false,
  //       });
  //     }, 3000);
  //   }

  //   if (enable_sound) playRandomKeyStrokeSound();
  // };

  const setImagePreview = (value) => {
    set_draft_image(selected_user._id, value);
  };

  const removeImage = () => {
    set_draft_image(selected_user._id, null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleStartRecording = async () => {
    setToggleAnySpaceClickingPortal(true);
    try {
      const analyzer = await startRecording();
      setAnalyser(analyzer);
      set_is_recording(true);
    } catch (error) {
      toast.error("Failed to start recording.");
    }
  };

  const handleStopRecording = async () => {
    setToggleAnySpaceClickingPortal(false);
    try {
      const { blob } = await stopRecording();
      set_is_recording(false);
      await send_voice_message(blob);
    } catch (error) {
      toast.error("Failed to send voice note.");
    }
  };

  const handleCancelRecording = () => {
    setToggleAnySpaceClickingPortal(false);
    cancelRecording();
    set_is_recording(false);
  };

  // Emit typing event
  const emitTypingEvent = (isTyping = true) => {
    if (!socket || !selected_user) return;

    socket.emit("user_typing", {
      to: selected_user._id,
      is_typing: isTyping,
    });

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 3 seconds of no input
    if (isTyping) {
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("user_typing", {
          to: selected_user._id,
          is_typing: false,
        });
      }, 3000);
    }
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    set_draft_message(selected_user._id, newValue);
    emitTypingEvent(true);
    if (enable_sound) playRandomKeyStrokeSound();
  };

  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
    emitTypingEvent(true); // Add this
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
    <div className="relative w-full">
      {/* Emoji Button and cancel recording */}
      <button
        ref={!is_recording ? buttonRef : null}
        type="button"
        onClick={!is_recording ? () => setShowPicker((prev) => !prev) : null}
        className={`absolute z-10 left-3 bottom-2.5 text-lg hover:text-text duration-300 ${
          !is_recording && "cursor-pointer hover:bg-hover-background"
        } text-text/70 p-2 rounded-full`}
      >
        {!is_recording ? <BsEmojiSmile /> : <FaMicrophoneAlt />}
      </button>

      {/* Emoji Picker */}
      {showPicker && (
        <div
          ref={pickerRef}
          className="absolute bottom-16 left-0 z-20 bg-black/90 rounded-lg shadow-lg"
        >
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            theme={theme === "light" ? "light" : "dark"}
          />
        </div>
      )}

      {/* Expanding Textarea */}
      <div className="space-y-3">
        {/* {imagePreview && ( */}
        {imagePreview && !is_recording && (
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

        <form
          className="flex items-end gap-3 bg-orange-40 w-full"
          onSubmit={handleSend}
        >
          <div className="w-full relative">
            {!is_recording ? (
              // Message input
              <textarea
                ref={textareaRef}
                placeholder="Message"
                value={message}
                onChange={handleInputChange}
                // Press enter to send, shift+enter for new line
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (socket) {
                      socket.emit("user_typing", {
                        to: selected_user._id,
                        is_typing: false,
                      });
                    }

                    handleSend(e);
                  }
                }}
                rows={1}
                className="max-h-40 w-full px-[52px] py-4 hover:ring-text/30 outline-none ring-text/10 focus:ring-full-color/40 focus:ring-2 ring rounded-3xl duration-300 text-text placeholder:text-text/50 bg-background/50 resize-none hide-chat-input-scrollbar text-sm backdrop-blur-sm block"
              />
            ) : (
              // TODO: Voice recording and preview
              <div className="h-[52px] w-full px-[52px] py-4 ring ring-text/10 rounded-3xl duration-300 bg-background/50 backdrop-blur-sm">
                <div className="h-full flex items-center gap-2">
                  {/* TODO: When the audio is paused which means not recording, the pulsing circle will leave and the play icon will appear to play what has been recorded.. when you press the play button for the audio to play, then the pause icon appears instead to pause what you are playing (different from the pause recording button).. then the timer will change from the recording state to the audio playback state */}
                  <div className="flex items-center gap-2 ">
                    {/* <button
                    type="button"
                    onClick={() => console.log("Play and pause button for audio playback")}
                    className="text-lg hover:text-text duration-300 cursor-pointer text-text/70 hover:bg-hover-background p-2 rounded-full"
                  >
                    <FaPlay />
                  </button> */}
                    <div className="size-2.5 rounded-full bg-red-500 animate-pulse" />
                    <p className="text-sm leading-none text-text">
                      {formatTime(recordingTime)}
                    </p>
                  </div>

                  {/* TODO: Waveform will come here.. this div is the placeholder. the waveform should be mirrored.. like both the top and the bottom.. not just the top. with svgs.. similar to my normal audio waveform component */}
                  <div className="w-full">
                    {analyser && (
                      <RecordingWaveform
                        analyser={analyser}
                        isRecording={is_recording}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Media attachment menu button */}
            <div className="absolute right-3 bottom-2.5 flex items-center justify-center">
              {/* TODO: when audio is being recorded, this will change to the pause icon.. when the recording is paused, this will change to the mic icon to continue recording. <FaMicrophoneAlt /> */}
              <button
                type="button"
                onClick={
                  !is_recording
                    ? () => setMenuOpen((prev) => !prev)
                    : () => handleCancelRecording()
                }
                className={`text-lg duration-300 cursor-pointer ${
                  !is_recording
                    ? "text-text/70 hover:text-text hover:bg-hover-background"
                    : "text-red-500 hover:bg-red-400/20 z-30"
                } p-2 rounded-full`}
              >
                {!is_recording ? <GrAttachment /> : <GoTrash />}
              </button>

              <Menu
                menuOpen={menuOpen}
                setMenuOpen={setMenuOpen}
                isMainMenu={false}
                positioningAndSize={"w-[350px] h-[250px] -bottom-4 -right-16"}
              >
                <MenuBtn
                  func={() => {
                    console.log(
                      "Single file upload. any file.. except image. so music file, txt pdf docs... those kind of files. Coming soon!"
                    );
                  }}
                >
                  <IoCloudUploadOutline className="text-xl" />
                  <p className="text-sm">Upload File</p>
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

          {/* Send and record button.. Cant record audio to send to AI.. this button is used to send a message, image, audio and used to initiate the audio.. thats to set recording to true and once the recording is done, to send the message */}
          <button
            type={
              message || imagePreview || selected_user.full_name === "Orion✨"
                ? "submit"
                : is_recording
                ? "submit"
                : "button"
            }
            onClick={
              !is_recording &&
              !message &&
              !imagePreview &&
              selected_user.full_name !== "Orion✨"
                ? handleStartRecording
                : null
            }
            className={`mb-2 text-xl size-10 bg-full-color/40 hover:bg-full-color/70 backdrop-blur-xs p-2.5 rounded-full cursor-pointer hover:scale-110 duration-300 ${
              is_recording && "z-30"
            }`}
          >
            {message ||
            imagePreview ||
            selected_user.full_name === "Orion✨" ? (
              <img src={logo} alt="Telejam logo." />
            ) : is_recording ? (
              <img src={logo} alt="Telejam logo." />
            ) : (
              <FaMicrophoneAlt className="text-white text-lg" />
            )}
          </button>

          {/* Portal for when you click anywhere while recording.. you cant tap anywhere else till you cancel the recording */}
          {toggleAnySpaceClickingPortal &&
            createPortal(
              <PortalBackground
                backgroundColor="bg-transparent"
                openCloseHandler={() => setToggleCancelRecordingPortal(true)}
              />,
              document.getElementById("backdrop-root")
            )}

          {/* Portal for what will show when you click anywhere while recording.. a modal to choose between stopping or continuing recording */}
          {toggleCancelRecordingPortal &&
            createPortal(
              <PortalBackground
                backgroundColor="bg-transparent"
                overlayLevel="z-40"
                openCloseHandler={() => setToggleCancelRecordingPortal(false)}
              >
                <ModalWrapper>
                  <div className="bg-background p-4 rounded-xl space-y-2 max-w-[400px] m-auto ring ring-text/20">
                    <h1 className="text-lg font-semibold text-center text-text">
                      Discard Voice Message
                    </h1>
                    <p className="text-sm text-text">
                      Are you sure you want to stop recording and discard your
                      voice note?
                    </p>
                    <div className="flex justify-end items-center gap-2">
                      <button
                        onClick={() => setToggleCancelRecordingPortal(false)}
                        type="button"
                        className="cursor-pointer p-2 text-sm text-text hover:bg-text/12 rounded-lg"
                      >
                        Continue
                      </button>

                      <button
                        onClick={() => handleCancelRecording()}
                        type="button"
                        className="cursor-pointer p-2 text-sm text-red-400 hover:bg-red-400/20 rounded-lg"
                      >
                        Discard
                      </button>
                    </div>
                  </div>
                </ModalWrapper>
              </PortalBackground>,
              document.getElementById("backdrop-root")
            )}
        </form>
      </div>
    </div>
  );
};
export default ChatInput;
