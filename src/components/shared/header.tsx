"use client";

import Link from "next/link";
import { WalletButton } from "./wallet-button";
import Image from "next/image";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full p-6">
      <div className="max-w-7xl mx-auto">
        <div className="backdrop-blur-xl bg-gradient-to-r from-[#0A0C14]/90 via-[#1A1F2C]/90 to-[#0A0C14]/90 animate-gradient rounded-3xl border border-[#7c3aed]/20 p-6 shadow-2xl relative overflow-hidden">
          <div className="relative flex items-center justify-between gap-2 sm:gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="text-base sm:text-3xl font-black tracking-tight whitespace-nowrap text-white">
                PlotPredict
              </div>
            </Link>
            
            {/* Navigation Links - Desktop */}
            <nav className="hidden md:flex items-center space-x-6 flex-1">
              <Link 
                href="/markets" 
                className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
              >
                Markets
              </Link>
              <Link 
                href="/dashboard/my-bets" 
                className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
              >
                My Bets
              </Link>
            </nav>
            
            {/* Wallet Button */}
            <div className="flex-shrink-0 ml-auto">
              <WalletButton />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}