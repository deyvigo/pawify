import React from "react";
import Svg, { Path } from "react-native-svg";

interface IconProps {
  color?: string;
  size?: number;
}

export const MenuIcon: React.FC<IconProps> = ({
  color = "#1A1A1A",
  size = 24,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M4 5h16" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M4 12h16" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M4 19h16" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
