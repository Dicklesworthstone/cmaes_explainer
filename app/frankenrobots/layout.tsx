import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "FrankenRobots Lab",
  description:
    "Focused on-device robotics laboratories for the Unitree G1 humanoid and KUKA LBR iiwa 7 R800 arm.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "dark",
};

export default function FrankenRobotsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
