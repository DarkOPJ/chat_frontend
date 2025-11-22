import { useRef, useState, useCallback } from "react";

export const useVoiceRecording = () => {
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Setup audio context for live waveform
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);

      // Setup MediaRecorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorder.start();
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      return analyser;
    } catch (error) {
      console.error("Error starting recording:", error);
      throw error;
    }
  }, []);

  const stopRecording = useCallback(
    () =>
      new Promise((resolve) => {
        if (!mediaRecorderRef.current) return;

        mediaRecorderRef.current.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: "audio/mp4" });

          // Cleanup
          streamRef.current.getTracks().forEach((track) => track.stop());
          audioContextRef.current?.close();
          clearInterval(timerRef.current);

          resolve({
            blob,
            duration: recordingTime,
          });
        };

        mediaRecorderRef.current.stop();
      }),
    [recordingTime]
  );

  const cancelRecording = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    audioContextRef.current?.close();
    clearInterval(timerRef.current);
    setRecordingTime(0);
    chunksRef.current = [];
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return {
    startRecording,
    stopRecording,
    cancelRecording,
    recordingTime,
    formatTime,
    analyser: analyserRef.current,
  };
};
