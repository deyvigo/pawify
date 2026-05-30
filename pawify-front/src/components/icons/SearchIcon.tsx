import React from "react";
import Svg, { Circle, Path } from "react-native-svg";

interface IconProps {
  color?: string;
  size?: number;
}

export const SearchIcon: React.FC<IconProps> = ({
  color = "#8E8E93",
  size = 20,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="m21 21-4.34-4.34" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </Svg>
);
