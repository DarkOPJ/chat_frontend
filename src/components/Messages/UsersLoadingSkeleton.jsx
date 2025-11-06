import React from "react";
import useApplicationStore from "../../store/ApplicationStore";

const UsersLoadingSkeleton = () => {
  const { is_compact } = useApplicationStore();
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
        <div
          key={item}
          className="bg-slate-800/30 p-4 rounded-lg animate-pulse"
        >
          <div className="flex items-center justify-center space-x-3">
            <div className="w-11 h-11 bg-slate-700 rounded-full"></div>
            {!is_compact && (
              <div className="flex-1">
                <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-slate-700/70 rounded w-1/2"></div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
export default UsersLoadingSkeleton;
