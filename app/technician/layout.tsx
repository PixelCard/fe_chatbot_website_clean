import type { ReactNode } from "react";
import TechnicianShell from "./_components/TechnicianShell";

export default function TechnicianLayout({ children }: { children: ReactNode }) {
  return <TechnicianShell>{children}</TechnicianShell>;
}
