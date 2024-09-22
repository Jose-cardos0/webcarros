import { ReactNode } from "react";

export function Container({ children }: { children: ReactNode }) {
  return <div className="w-full max-w-7-xl mx-auto px-4">{children}</div>;
}
