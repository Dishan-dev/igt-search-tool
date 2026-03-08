import React from "react";
import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 backdrop-blur-xl shadow-xl shadow-black/5">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-bold tracking-tight text-transparent">
            AIESEC CS IGT
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-black/90 transition-colors hover:text-black"
          >
            Home
          </Link>
          <Link
            href="/opportunities"
            className="text-sm font-medium text-black/90 transition-colors hover:text-black"
          >
            Opportunities
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-black/90 transition-colors hover:text-black"
          >
            About
          </Link>
        </nav>

        {/* Mobile Navigation (Simple visible-on-small-screens bar) */}
        <nav className="flex items-center gap-4 md:hidden">
          <Link
            href="/"
            className="text-xs font-medium text-black/90 transition-colors hover:text-black"
          >
            Home
          </Link>
          <Link
            href="/opportunities"
            className="text-xs font-medium text-black/90 transition-colors hover:text-black"
          >
            Opportunities
          </Link>
        </nav>
      </div>
    </header>
  );
}
