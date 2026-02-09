import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In - TrainTrack",
  description: "Sign in to TrainTrack - Special Education Resource Hub",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
