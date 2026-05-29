import React from "react";
import Svg, { Path } from "react-native-svg";

interface IconProps {
  color?: string;
  size?: number;
}

export const FilterIcon: React.FC<IconProps> = ({
  color = "#1A1A1A",
  size = 24,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M2 5h20" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M6 12h12" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M9 19h6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
