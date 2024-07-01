/* eslint-disable react/no-unknown-property */
import { ImageResponse } from "next/og";

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div tw="flex w-full h-full items-center justify-center rounded-full bg-[#270B5B] text-center text-xl text-white">
        D
      </div>
    ),
    { ...size },
  );
}
