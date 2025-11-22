import React, { useRef, useState, useEffect } from "react";
import { FaPlay, FaPause } from "react-icons/fa6";
import useApplicationStore from "../../store/ApplicationStore";
import AudioWaveform from "./AudioWaveform";

const AudioPlayer = ({ leftOrRight, audioUrl }) => {
  const { theme } = useApplicationStore();
  const audioRef = useRef(null);
  const rafRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoaded = () => {
      setDuration(audio.duration || 0);
      setCurrent(audio.currentTime || 0);
      setProgress(audio.duration ? audio.currentTime / audio.duration : 0);
    };

    const onEnded = () => {
      setIsPlaying(false);
      // ensure final state
      setCurrent(0);
      setProgress(0);
      cancelRAF();
    };

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("ended", onEnded);
      cancelRAF();
    };
  }, [audioUrl]);

  // RAF loop to update current/progress every frame while playing
  const step = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const t = audio.currentTime || 0;
    const d = audio.duration || 0;
    setCurrent(t);
    setProgress(d ? t / d : 0);
    rafRef.current = requestAnimationFrame(step);
  };

  const startRAF = () => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(step);
  };

  const cancelRAF = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  useEffect(() => {
    // start/stop RAF when isPlaying changes
    if (isPlaying) startRAF();
    else cancelRAF();
    return cancelRAF;
  }, [isPlaying]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (err) {
      // play might fail (autoplay policies) — still update state conservatively
      console.error("Audio play failed", err);
      setIsPlaying(false);
    }
  };

  // replace existing handleSeek
  const handleSeek = (ratioOrTime) => {
    const audio = audioRef.current;
    if (!audio) return;

    // If caller passed a ratio (0..1), compute absolute time. If caller passed a time (seconds), accept it.
    let t;
    if (
      typeof ratioOrTime === "number" &&
      ratioOrTime >= 0 &&
      ratioOrTime <= 1
    ) {
      // ratio -> seconds
      t = duration ? ratioOrTime * duration : 0;
    } else {
      // assume absolute seconds (backwards compatible)
      t = Number(ratioOrTime) || 0;
    }

    // clamp and apply
    t = Math.max(0, Math.min(t, duration || t));
    audio.currentTime = t;
    setCurrent(t);
    setProgress(duration ? t / duration : 0);
  };

  const formatTime = (t) =>
    `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;

  const inactiveColor = theme === "light" ? "#00000030" : "#ffffff80";
  const activeColorRight =
    theme === "light"
      ? "#5da853"
      : theme === "midnight"
      ? "#4230a2"
      : "#a63340";
  const activeColorLeft =
    theme === "light"
      ? "#fffadc"
      : theme === "midnight"
      ? "#15283a"
      : "#3b2643";

  return (
    <div className="pt-1.5 px-2 flex items-center gap-1.5">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      <button
        type="button"
        onClick={togglePlay}
        className={`size-11 text-2xl flex justify-center items-center rounded-full cursor-pointer ${
          theme === "light"
            ? "bg-sub-background text-white"
            : "bg-white text-full-color"
        }`}
      >
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>

      <div className="w-fit space-y-1.5">
        <AudioWaveform
          audioSrc={audioUrl}
          progress={progress}
          playedColor={
            leftOrRight === "left" ? activeColorLeft : activeColorRight
          }
          idleColor={inactiveColor}
          onSeek={(t) => handleSeek(t)}
        />

        <div className="text-[13px] tracking-wider flex items-center gap-2">
          <span className="text-sub-background">
            {formatTime(current)} / {formatTime(duration)}
          </span>
          <div
            className={`size-2 rounded-full bg-sub-background opacity-0 ${
              isPlaying && "opacity-100 animate-pulse"
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
