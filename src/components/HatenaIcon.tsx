import React from 'react';
import HatenaImage from '/hatenabookmark_symbolmark.png'
// SVGアイコンのプロパティの型を定義
interface IconProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  size?: string | number;
}


const HatenaIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
    <img src={HatenaImage} alt="はてなブックマーク" width={size} height={size} {...props} />

);

export default HatenaIcon;
