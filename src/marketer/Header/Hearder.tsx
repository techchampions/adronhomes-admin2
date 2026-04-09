"use client";

import { useState, useRef, useEffect } from "react";
import { BiCopy, BiCheck, BiShareAlt } from "react-icons/bi";
import {
  FaFacebook,
  FaXTwitter,
  FaWhatsapp,
  FaInstagram,
} from "react-icons/fa6";

interface HeaderProps {
  searchPlaceholder?: string;
  copyCode?: string;
  Name?: string;
  role?: string;
}

export default function Header({
  searchPlaceholder = "Search",
  copyCode = "UDHFJK4748",
  Name = "Mike Wellington",
  role = "Marketer",
}: HeaderProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const referralUrl = `https://user.adronhomes.com/ref/${copyCode}`;
  const shareText = `Join Adron Homes using my referral code: ${copyCode}`;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowShareMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const shareToFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralUrl)}`,
      "_blank",
    );
    setShowShareMenu(false);
  };

  const shareToTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(referralUrl)}`,
      "_blank",
    );
    setShowShareMenu(false);
  };

  const shareToWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(shareText + " " + referralUrl)}`,
      "_blank",
    );
    setShowShareMenu(false);
  };

  const shareToInstagram = () => {
    navigator.clipboard.writeText(`${shareText}\n${referralUrl}`);
    alert("✅ Copied to clipboard! Paste it in your Instagram story or post.");
    setShowShareMenu(false);
  };

  return (
    <header className="w-full relative">
      <div className="w-full flex-col lg:flex-row justify-between items-start gap-4 p-4 sm:p-6 md:pt-16 md:pb-8 md:px-8 lg:pr-[68px] lg:pl-[38px] flex overflow-visible relative">
        <div className="flex items-center gap-4 min-w-fit">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{Name}</h1>
            <p className="text-sm text-gray-600">{role}</p>
          </div>
        </div>

        {/* Center - Search */}
        <div className="flex-1 w-full max-w-md">
          <div
            className={`relative flex items-center h-12 px-5 rounded-2xl border transition-all duration-200 bg-gray-50 ${
              isSearchFocused
                ? "border-[#79B833] shadow-md"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <input
              type="text"
              placeholder={searchPlaceholder}
              className="w-full bg-transparent text-sm focus:outline-none placeholder:text-gray-400"
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </div>
        </div>

        {/* Right - Referral & Share */}
        <div className="flex flex-col items-end lg:items-start w-full lg:w-auto lg:min-w-[340px]">
          <div className="flex items-center gap-2 mb-3">
            <p className="text-sm font-medium text-gray-700">
              Your Referral Link
            </p>
          </div>

          {/* URL Display */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 w-full mb-4 font-mono text-sm text-gray-700 break-all">
            {referralUrl}
          </div>

          <div className="flex gap-3 w-full">
            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-2 bg-[#79B833] hover:bg-[#68a32a] text-white font-medium py-3.5 px-6 rounded-2xl transition-all active:scale-95"
            >
              {isCopied ? (
                <>
                  <BiCheck className="w-5 h-5" />
                  Copied!
                </>
              ) : (
                <>
                  <BiCopy className="w-5 h-5" />
                  Copy Link
                </>
              )}
            </button>

            {/* Main Share Button */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-black text-white font-medium py-3.5 px-6 rounded-2xl transition-all active:scale-95 min-w-[110px]"
              >
                <BiShareAlt className="w-5 h-5" />
                Share
              </button>

              {/* Share Dropdown Menu - Horizontal */}
              {showShareMenu && (
                <div className="absolute top-full right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-3 min-w-[320px] z-[9999]">
                  <p className="px-2 py-1 text-xs font-semibold text-gray-500 border-b mb-2">
                    Share via
                  </p>

                  <div className="flex gap-2 justify-around">
                    <button
                      onClick={shareToWhatsApp}
                      className="flex flex-col items-center gap-1 p-2 hover:bg-gray-50 rounded-xl transition-colors group flex-1"
                      title="WhatsApp"
                    >
                      <div className="w-10 h-10 bg-[#25D366] text-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FaWhatsapp className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-medium text-gray-600">
                        WhatsApp
                      </span>
                    </button>

                    <button
                      onClick={shareToFacebook}
                      className="flex flex-col items-center gap-1 p-2 hover:bg-gray-50 rounded-xl transition-colors group flex-1"
                      title="Facebook"
                    >
                      <div className="w-10 h-10 bg-[#1877F2] text-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FaFacebook className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-medium text-gray-600">
                        Facebook
                      </span>
                    </button>

                    <button
                      onClick={shareToTwitter}
                      className="flex flex-col items-center gap-1 p-2 hover:bg-gray-50 rounded-xl transition-colors group flex-1"
                      title="X (Twitter)"
                    >
                      <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FaXTwitter className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-medium text-gray-600">
                        X
                      </span>
                    </button>

                    <button
                      onClick={shareToInstagram}
                      className="flex flex-col items-center gap-1 p-2 hover:bg-gray-50 rounded-xl transition-colors group flex-1"
                      title="Instagram"
                    >
                      <div className="w-10 h-10 bg-gradient-to-tr from-[#f56040] via-[#c13584] to-[#405de6] text-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FaInstagram className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-medium text-gray-600">
                        Instagram
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
