import React, { useMemo } from "react";

const Avatar = ({ children, seed }) => {
  const gradientColors = useMemo(() => {
    const colors = [
      ["from-blue-500", "to-purple-600"],
      ["from-pink-500", "to-rose-600"],
      ["from-green-500", "to-emerald-600"],
      ["from-orange-500", "to-red-600"],
      ["from-cyan-500", "to-blue-600"],
      ["from-violet-500", "to-purple-600"],
      ["from-amber-500", "to-orange-600"],
      ["from-teal-500", "to-cyan-600"],
      ["from-indigo-500", "to-blue-600"],
      ["from-fuchsia-500", "to-pink-600"],
    ];

    // Use seed to consistently select the same color for the same user
    const index = seed
      ? seed.toString().charCodeAt(0) % colors.length
      : Math.floor(Math.random() * colors.length);
    return colors[index];
  }, [seed]);

  return (
    <div
      className={`w-12 h-12 rounded-full bg-gradient-to-br ${gradientColors[0]} ${gradientColors[1]} flex items-center justify-center text-white font-semibold flex-shrink-0`}
    >
      {children}
    </div>
  );
};

export default Avatar;
