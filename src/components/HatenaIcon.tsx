import React from "react";
// SVGアイコンのプロパティの型を定義
interface IconProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  size?: string | number;
}

const HatenaImage = "https://dq7c5b6uxkdk2.cloudfront.net/posts/images/hatenabookmark_symbolmark.png"

const HatenaIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <img
    src={HatenaImage}
    alt="はてなブックマーク"
    width={size}
    height={size}
    {...props}
  />
);

export default HatenaIcon;
