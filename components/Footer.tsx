"use client";

import { SHOP_LINKS, SOCIAL_LINKS, SUPPORT_LINKS } from "@/app/data/constants";
import { isValidEmail } from "@/utils/helpers";
import { Facebook, Instagram, Mail, Twitter } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setMessage("Please enter an email address");
      return;
    }
    if (!isValidEmail(email)) {
      setMessage("Please enter a valid email address");
      return;
    }
    setMessage("Thank you for subscribing!");
    setEmail("");
  };

  return (
    <footer className="bg-gray-900 text-white py-20">
      <div className="container mx-auto px-6">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-16 mb-20">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-8">
              <h2 className="text-2xl font-light tracking-widest">SANSLI</h2>
            </Link>
            <p className="text-gray-400 text-sm font-light leading-relaxed mb-8">
              Elegance woven into every thread. Discover the finest collection
              of traditional Bangladeshi heritage wear.
            </p>
            {/* Social Links */}
            <div className="flex gap-6">
              <Link
                href={SOCIAL_LINKS.instagram}
                className="text-gray-400 hover:text-white transition-colors duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </Link>
              <Link
                href={SOCIAL_LINKS.facebook}
                className="text-gray-400 hover:text-white transition-colors duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </Link>
              <Link
                href={SOCIAL_LINKS.twitter}
                className="text-gray-400 hover:text-white transition-colors duration-300"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase mb-8 text-gray-300">
              Collections
            </h3>
            <ul className="space-y-4">
              {SHOP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-300 font-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase mb-8 text-gray-300">
              Support
            </h3>
            <ul className="space-y-4">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-300 font-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase mb-8 text-gray-300">
              Newsletter
            </h3>
            <p className="text-sm text-gray-400 mb-6 font-light">
              Subscribe to get special offers and updates.
            </p>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="relative">
                <div className="flex items-center border-b border-gray-700 focus-within:border-white transition-colors duration-300">
                  <Mail className="w-4 h-4 text-gray-600" />
                  <input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-transparent border-none py-3 px-3 text-sm focus:outline-none text-white placeholder-gray-500"
                    aria-label="Email address"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-white text-gray-900 text-xs font-semibold tracking-wide hover:bg-gray-100 transition-all duration-300"
              >
                Subscribe
              </button>
              {message && (
                <p
                  className={`text-xs ${
                    message.includes("Thank you")
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {message}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-500 text-xs tracking-wide gap-4">
            <p>
              &copy; {new Date().getFullYear()} Sansli by Zebin. All rights
              reserved.
            </p>
            <div className="flex gap-6">
              <Link
                href="/privacy"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="hover:text-white transition-colors"
              >
                Terms of Use
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
