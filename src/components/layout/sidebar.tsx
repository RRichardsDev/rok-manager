"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Shield,
  Calendar,
  Swords,
  Menu,
  X
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/players", label: "Player Pool", icon: Users },
  { href: "/alliance", label: "Alliance Roster", icon: Shield },
  { href: "/events", label: "Events", icon: Calendar },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const closeSidebar = () => setIsOpen(false);
  const openSidebar = () => setIsOpen(true);

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 inset-x-0 w-full h-16 bg-slate-900/95 border-b border-slate-800 backdrop-blur-xl z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10">
            <Swords className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h1 className="font-bold text-slate-100 text-sm">RoK Manager</h1>
          </div>
        </div>
        <button
          type="button"
          onClick={openSidebar}
          className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 active:bg-slate-700"
        >
          <Menu size={24} />
        </button>
      </header>

      {/* Mobile Overlay */}
      <div
        className={`lg:hidden fixed inset-0 bg-black/60 z-[45] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <aside
        className="fixed top-0 left-0 h-screen bg-slate-900/95 border-r border-slate-800 backdrop-blur-xl z-50 w-64 transition-transform duration-300 ease-in-out"
        style={{
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        {/* Override transform on desktop */}
        <style jsx>{`
          @media (min-width: 1024px) {
            aside {
              transform: translateX(0) !important;
            }
          }
        `}</style>

        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <Swords className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h1 className="font-bold text-slate-100">RoK Manager</h1>
              <p className="text-xs text-slate-500">Alliance Management</p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-800 text-slate-400 active:bg-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
