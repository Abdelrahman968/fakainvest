"use client";

import Image, { ImageProps } from "next/image";
import { useEffect, useState } from "react";

import ImagePlaceholder from "@/assets/imagePlaceHolder/placeholder.svg";

type AppImageProps = ImageProps;

export default function AppImage({ src, alt, ...props }: AppImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    const setTime = setTimeout(() => {
      setImgSrc(src);
    }, 0);
    return () => clearTimeout(setTime);
  }, [src]);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      onError={() => {
        if (imgSrc !== ImagePlaceholder) {
          setImgSrc(ImagePlaceholder);
        }
      }}
    />
  );
}
