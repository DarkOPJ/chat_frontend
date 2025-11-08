const hashString = (str) => {
  if (!str) return 0;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

export const getGradientFromSeed = (seed) => {
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
    ["from-red-500", "to-orange-500"],
    ["from-emerald-500", "to-teal-600"],
    ["from-purple-500", "to-pink-600"],
    ["from-yellow-500", "to-amber-600"],
    ["from-lime-500", "to-green-600"],
    ["from-sky-500", "to-indigo-600"],
    ["from-rose-500", "to-pink-600"],
    ["from-slate-500", "to-gray-600"],
    ["from-orange-400", "to-rose-500"],
    ["from-teal-400", "to-emerald-600"],
  ];


  const index = seed
    ? // && hashString(seed.toString()) % colors.length
      hashString(seed) % colors.length
    : Math.floor(Math.random() * colors.length);

  return colors[index];
};

export const getTextColorFromSeed = (seed) => {
  const colors = [
    "text-blue-500",
    "text-pink-400",
    "text-green-500",
    "text-orange-600",
    "text-cyan-500",
    "text-violet-400",
    "text-amber-500",
    "text-teal-600",
    "text-indigo-400",
    "text-fuchsia-500",
    "text-red-400",
    "text-emerald-400",
    "text-purple-400",
    "text-yellow-500",
    "text-lime-400",
    "text-sky-400",
    "text-rose-400",
    "text-slate-500",
    "text-orange-400",
    "text-teal-400",
  ];

  const index = seed
    ? // && hashString(seed.toString()) % colors.length;

      hashString(seed) % colors.length
    : Math.floor(Math.random() * colors.length);

  return colors[index];
};

// export const getBgColorFromSeed = (seed) => {
//   const colors = [
//     "bg-blue-500",
//     "bg-pink-500",
//     "bg-green-500",
//     "bg-orange-500",
//     "bg-cyan-500",
//     "bg-violet-500",
//     "bg-amber-500",
//     "bg-teal-500",
//     "bg-indigo-500",
//     "bg-fuchsia-500",
//     "bg-red-500",
//     "bg-emerald-500",
//     "bg-purple-500",
//     "bg-yellow-500",
//     "bg-lime-500",
//     "bg-sky-500",
//     "bg-rose-500",
//     "bg-slate-500",
//     "bg-orange-400",
//     "bg-teal-400",
//   ];

//   const hashString = (str) => {
//     if (!str) return 0;
//     let hash = 0;
//     for (let i = 0; i < str.length; i++) {
//       const char = str.charCodeAt(i);
//       hash = ((hash << 5) - hash) + char;
//       hash = hash & hash;
//     }
//     return Math.abs(hash);
//   };

//   const index = seed
//     ? hashString(seed.toString()) % colors.length
//     : Math.floor(Math.random() * colors.length);

//   return colors[index];
// };
