"use client";

import NextTopLoader from "nextjs-toploader";

export default function ProgressBarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NextTopLoader
        color="oklch(0.55 0.12 210)"
        height={3}
        showSpinner={false}
        easing="ease"
        speed={300}
        shadow="0 0 10px oklch(0.55 0.12 210),0 0 5px oklch(0.55 0.12 210)"
      />
      {children}
    </>
  );
}
