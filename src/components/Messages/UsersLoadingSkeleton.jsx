import React from "react";
import useApplicationStore from "../../store/ApplicationStore";

const UsersLoadingSkeleton = () => {
  const { is_compact } = useApplicationStore();
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
        <div
          key={item}
          // bg-sub-background/50
          className="backdrop-blur-md p-4 rounded-lg animate-pulse"
        >
          <div className="flex items-center justify-center space-x-3">
            <div className="w-11 h-11 bg-full-color/30 rounded-full"></div>
            {!is_compact && (
              <div className="flex-1">
                <div className="h-4 bg-full-color/30 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-full-color/20 rounded w-1/2"></div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
export default UsersLoadingSkeleton;
