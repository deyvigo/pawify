import React from "react";
import Svg, { Path } from "react-native-svg";

interface IconProps {
  color?: string;
  size?: number;
}

export const SortIcon: React.FC<IconProps> = ({
  color = "#1A1A1A",
  size = 24,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="m3 16 4 4 4-4" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M7 20V4" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="m21 8-4-4-4 4" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M17 4v16" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
