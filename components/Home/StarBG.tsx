import { useEffect, useState } from "react";
import styled from "styled-components";
import { useWindowSize } from "../Hooks";

type Props = { show: boolean };

const StarBG = ({ show }: Props) => {
  const { width, height } = useWindowSize();

  const [stars, setStars] = useState<JSX.Element[]>([]);

  useEffect(() => {
    if (!show) setStars([]);
    if (!width || !height || !show) return;

    let starCount = 0;

    const addStar = setInterval(() => {
      if (starCount >= width / 5) return;

      setStars((prev) => [
        ...prev,
        <Star top={Math.random() * height} left={Math.random() * width} key={starCount++} />,
      ]);
    }, 150);

    return () => clearInterval(addStar);
  }, [width, height, show]);

  return <Container show={show}>{stars}</Container>;
};

export default StarBG;

const Star = ({ top, left }: { top: number; left: number }) => {
  return (
    <StarStyle
      width="14"
      height="17"
      style={{ top, left }}
      viewBox="0 0 14 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.5875 8.29673C12.5957 8.32926 11.7692 8.35596 11.07 8.42019C8.43515 8.6571 7.69957 9.35698 7.44336 12.3333C7.35823 13.3719 7.326 14.6966 7.29376 16.3708C7.26153 14.6966 7.23012 13.3727 7.14417 12.3333C6.88795 9.35698 6.15237 8.6571 3.51751 8.42019C2.81912 8.35596 1.99179 8.32843 1 8.29673C1.99179 8.2642 2.81829 8.2375 3.51751 8.17327C6.15237 7.94137 6.88795 7.24232 7.14417 4.26011C7.2293 3.22155 7.26153 1.89686 7.29376 0.222656C7.326 1.89686 7.3574 3.22072 7.44336 4.26011C7.69957 7.24232 8.43515 7.9422 11.07 8.17327C11.7684 8.2375 12.5957 8.26503 13.5875 8.29673V8.29673Z"
        stroke="#414141"
        strokeMiterlimit="10"
      ></path>
    </StarStyle>
  );
};

const StarStyle = styled.svg`
  position: absolute;
  animation: sparkle 7s 0.5s ease infinite;
  opacity: 0;

  @keyframes sparkle {
    0% {
      scale: 0.8;
    }
    25% {
      scale: 0.5;
    }
    50% {
      opacity: 1;
      scale: 0.8;
    }
    75% {
      scale: 0.5;
    }
    100% {
      scale: 0.8;
    }
  }
`;

const Container = styled.div<{ show: boolean }>`
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  pointer-events: none;
  transition: background-position 5s ease;
  background: linear-gradient(var(--body-bg) 50%, rgb(10, 10, 10));
  background-size: 100% 200%;
  background-position: ${({ show }) => (show ? "bottom" : "top")};
`;
