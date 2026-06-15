import React from "react";
import Svg, { Circle, Path } from "react-native-svg";

interface IconProps {
  color?: string;
  size?: number;
}

export const AccountIcon: React.FC<IconProps> = ({
  color = "#8E8E93",
  size = 24,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </Svg>
);
