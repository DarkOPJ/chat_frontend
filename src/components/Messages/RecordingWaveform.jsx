import React, { useEffect, useState } from "react";
import useApplicationStore from "../../store/ApplicationStore";

const RecordingWaveform = ({ analyser, isRecording }) => {
  const { theme } = useApplicationStore();
  const [bars, setBars] = useState(Array(60).fill(0.1)); // 60 bars for recording

  useEffect(() => {
    if (!analyser || !isRecording) return;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    let animationId;

    const updateWaveform = () => {
      analyser.getByteFrequencyData(dataArray);

      // Take every 4th value to get 60 bars
      const peaks = [];
      for (
        let i = 0;
        i < dataArray.length;
        i += Math.floor(dataArray.length / 60)
      ) {
        peaks.push(dataArray[i] / 255); // Normalize to 0-1
      }

      setBars(peaks);
      animationId = requestAnimationFrame(updateWaveform);
    };

    updateWaveform();

    return () => cancelAnimationFrame(animationId);
  }, [analyser, isRecording]);

  return (
    <svg
      width="100%"
      height="40"
      viewBox="0 0 220 40"
      preserveAspectRatio="none"
    >
      {bars.map((value, index) => {
        const height = 5 + value * 15;
        const centerY = 20;

        return (
          <g key={index}>
            {/* Top bar */}
            <rect
              x={index * 3.67}
              y={centerY - height}
              width="1"
              height={height}
              rx="1"
              fill={
                theme === "light"
                  ? "#5da853"
                  : theme === "midnight"
                  ? "#4230a2"
                  : "#a63340"
              }
            />
            {/* Bottom bar (mirrored) */}
            <rect
              x={index * 3.67}
              y={centerY}
              width="1"
              height={height}
              rx="1"
              fill={
                theme === "light"
                  ? "#5da853"
                  : theme === "midnight"
                  ? "#4230a2"
                  : "#a63340"
              }
            />
          </g>
        );
      })}
    </svg>
  );
};

export default RecordingWaveform;
