"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import { AdminRippleThemeProvider } from "../Theme/AdminRippleTheme";

export default function AdminShell({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <>
      <AdminRippleThemeProvider>
        <main className="min-h-screen overflow-x-clip text-[var(--admin-theme-text)]">
          <AdminSidebar
            collapsed={sidebarCollapsed}
            onCollapsedChange={setSidebarCollapsed}
          />

          <div
            className={[
              "relative min-h-screen transition-[padding] duration-300 ease-out",
              sidebarCollapsed ? "lg:pl-[76px]" : "lg:pl-[250px]",
            ].join(" ")}
          >
            <div className="flex min-h-screen min-w-0 flex-col">
              <div className="px-4 pt-4 sm:px-5 lg:px-6">
                <AdminTopbar />
              </div>

              <section className="min-w-0 flex-1 px-4 py-4 sm:px-5 lg:px-6">
                <div className="w-full space-y-4">{children}</div>
              </section>
            </div>
          </div>
        </main>
      </AdminRippleThemeProvider>
    </>
  );
}
