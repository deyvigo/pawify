import React from "react";
import Svg, { Path } from "react-native-svg";

interface IconProps {
  color?: string;
  size?: number;
}

export const MoveDownIcon: React.FC<IconProps> = ({
  color = "#1A1A1A",
  size = 20,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M8 18 12 22 16 18" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <Path d="M12 2V22" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
