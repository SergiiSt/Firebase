// import React from "react";
import { ReactComponent as Heart } from "../src/img/heart.svg";

export default function heart({ color, size }) {
  return (
    <Heart
      width={size ?? "100%"}
      height={size ?? "100%"}
      stroke={color}
      fill={color}
    />
  );
}
