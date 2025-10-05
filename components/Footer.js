"use client";
import Link from "next/link";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#297BCD] text-white py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <h2 className="text-xl font-bold ">SwiftBill</h2>

          {/* Social Icons */}
          <div className="flex space-x-6 mt-4 sm:mt-0 ">
            <Link href="https://facebook.com" target="_blank">
              <FaFacebookF className="bg-yellow-300 text-black border-white rounded-full p-1 w-10 h-7 hover:shadow-lg" />
            </Link>
            <Link href="https://twitter.com" target="_blank">
              <FaTwitter className="bg-yellow-300 text-black border-white rounded-full p-1 w-10 h-7" />
            </Link>
            <Link href="https://linkedin.com" target="_blank">
              <FaWhatsapp className="bg-yellow-300 text-black border-white rounded-full p-1 w-10 h-7" />
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300 my-4"></div>

        {/* Bottom Section */}
        <div>
          <p className="text-center text-sm text-gray-200">
            © {new Date().getFullYear()} SwiftBill. All rights reserved.
          </p>
          <p className="text-center text-sm text-gray-200 mb-2">
            Made with ❤️ by Simdi Technologies - Your go-to app for effortless
            bill payments!
          </p>
        </div>
      </div>
    </footer>
  );
}
