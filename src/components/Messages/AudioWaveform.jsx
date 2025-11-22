import React, { useEffect, useRef, useState } from "react";

const AudioWaveform = ({
  audioSrc,
  progress = 0,
  playedColor = "#4C8EF7",
  idleColor = "#C0C0C0",
  onSeek,
}) => {
  const [bars, setBars] = useState([]);
  const svgRef = useRef(null);
  const clipRef = useRef(null);
  const pointerActiveRef = useRef(false);
  const uniqueIdRef = useRef(`clip-${Math.random().toString(36).slice(2, 9)}`);

  // Generate waveform bars from audio
  useEffect(() => {
    if (!audioSrc) {
      setBars([]);
      return;
    }

    let cancelled = false;

    const generateWaveform = async (src) => {
      try {
        const audioCtx = new (window.AudioContext ||
          window.webkitAudioContext)();
        const response = await fetch(src);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

        const rawData = audioBuffer.getChannelData(0);
        const samples = 55; // number of bars (kept similar to your version)
        const blockSize = Math.floor(rawData.length / samples);
        const peaks = [];

        for (let i = 0; i < samples; i++) {
          let sum = 0;
          for (let j = 0; j < blockSize; j++) {
            const idx = i * blockSize + j;
            if (idx < rawData.length) sum += Math.abs(rawData[idx]);
          }
          peaks.push(sum / blockSize);
        }

        const max = Math.max(...peaks) || 1;
        const normalized = peaks.map((v) => v / max);

        if (!cancelled) setBars(normalized);
        audioCtx.close();
      } catch (err) {
        console.error("waveform generation error:", err);
        if (!cancelled) setBars([]);
      }
    };

    generateWaveform(audioSrc);

    return () => {
      cancelled = true;
    };
  }, [audioSrc]);

  // Update clip width whenever progress or svg width changes.
  useEffect(() => {
    const svg = svgRef.current;
    const clip = clipRef.current;
    if (!svg || !clip) return;

    const bbox = svg.getBoundingClientRect();
    const width = bbox.width || 220; // fallback

    const target = Math.max(0, Math.min(1, progress)) * width;
    // set clip rect width directly for immediate, smooth updates from parent's RAF
    clip.setAttribute("width", `${target}`);
  }, [progress, bars]);

  // pointer-based seeking (click & drag)
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const getRatioFromEvent = (evt) => {
      const rect = svg.getBoundingClientRect();
      const clientX =
        evt.clientX ??
        (evt.touches && evt.touches[0] && evt.touches[0].clientX);
      const x = clientX - rect.left;
      const clamped = Math.max(0, Math.min(x, rect.width));
      return rect.width ? clamped / rect.width : 0;
    };

    const onPointerDown = (e) => {
      pointerActiveRef.current = true;
      try {
        svg.setPointerCapture(e.pointerId);
      } catch (err) {}
      const ratio = getRatioFromEvent(e);
      if (onSeek) onSeek(ratio);
    };

    const onPointerMove = (e) => {
      if (!pointerActiveRef.current) return;
      const ratio = getRatioFromEvent(e);
      if (onSeek) onSeek(ratio);
    };

    const onPointerUp = (e) => {
      pointerActiveRef.current = false;
      try {
        svg.releasePointerCapture(e.pointerId);
      } catch (err) {}
    };

    svg.addEventListener("pointerdown", onPointerDown);
    svg.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      svg.removeEventListener("pointerdown", onPointerDown);
      svg.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [onSeek]);

  // derive viewbox width from actual svg sizing to layout bars
  const [svgWidth, setSvgWidth] = useState(220);
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const update = () => {
      const rect = svg.getBoundingClientRect();
      setSvgWidth(rect.width || 220);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(svg);
    return () => ro.disconnect();
  }, []);

  const gap = 2; // spacing logic similar to earlier: bar width 2 + gap
  const barWidth = 2;
  const total = bars.length || 1;
  const totalNeededWidth = total * (barWidth + gap);
  // if svgWidth is too small, scale spacing to fit
  const scale = svgWidth < totalNeededWidth ? svgWidth / totalNeededWidth : 1;
  const computedGap = gap * scale;
  const computedBarWidth = barWidth * scale;

  // visualize bars centered vertically in 25px height
  const svgHeight = 25;

  return (
    <svg
      ref={svgRef}
      width="170"
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      preserveAspectRatio="xMidYMid meet"
      data-duration={
        /* parent should populate duration via dataset if desired */ undefined
      }
      style={{ display: "block" }}
    >
      <defs>
        <clipPath id={uniqueIdRef.current}>
          <rect ref={clipRef} x="0" y="0" width="0" height={svgHeight} />
        </clipPath>
      </defs>

      {/* background (idle) bars */}
      <g>
        {bars.map((value, i) => {
          const height = 3 + value * (svgHeight - 6); // min 3 px padding top/bottom
          const y = (svgHeight - height) / 2;
          const x = i * (computedBarWidth + computedGap);
          return (
            <rect
              key={`idle-${i}`}
              x={x}
              y={y}
              width={computedBarWidth}
              height={height}
              rx="1"
              fill={idleColor}
            />
          );
        })}
      </g>

      {/* foreground (played) bars clipped by clipPath */}
      <g clipPath={`url(#${uniqueIdRef.current})`}>
        {bars.map((value, i) => {
          const height = 3 + value * (svgHeight - 6);
          const y = (svgHeight - height) / 2;
          const x = i * (computedBarWidth + computedGap);
          return (
            <rect
              key={`played-${i}`}
              x={x}
              y={y}
              width={computedBarWidth}
              height={height}
              rx="1"
              fill={playedColor}
            />
          );
        })}
      </g>
    </svg>
  );
};

export default AudioWaveform;
