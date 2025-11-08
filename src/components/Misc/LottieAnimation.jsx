import Lottie from "lottie-react";
import { useState } from "react";

// Import your JSON animation file
// You can download free ones from lottiefiles.com

const LottieAnimation = ({
  width = 250,
  height = 250,
  loop = true,
  autoplay = true,
  speed = 1,
  animationLocation=null,
}) => {
  const [lottieRef, setLottieRef] = useState(null);

  const handlePlay = () => {
    lottieRef?.play();
  };

  const handlePause = () => {
    lottieRef?.pause();
  };

  const handleStop = () => {
    lottieRef?.stop();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Lottie Animation */}
      <Lottie
        lottieRef={setLottieRef}
        animationData={animationLocation}
        loop={loop}
        autoplay={autoplay}
        style={{ width, height }}
        // Optional: Control speed
        speed={speed}
      />
    </div>
  );
};
export default LottieAnimation;
