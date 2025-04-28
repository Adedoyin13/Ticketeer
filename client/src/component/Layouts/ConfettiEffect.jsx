import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";

const ConfettiEffect = () => {
  const [width, height] = useWindowSize();

  return (
    <Confetti
      width={width}
      height={height}
      numberOfPieces={200}
      recycle={false}
      gravity={0.3}
    />
  );
}

export default ConfettiEffect;