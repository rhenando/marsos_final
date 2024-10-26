"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import logo from "../public/logo-marsos.svg";
import { User, Menu, X } from "react-feather"; // Import Feather Icons

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown
  const router = useRouter();

  // Detect scroll position to apply styles to the horizontal menu only
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100); // Trigger scroll effect after 100px
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Handle link click to close mobile menu
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Static Top Header */}
      <header
        className='relative z-50 bg-white text-gray-800 transition-all duration-500'
        style={{ zIndex: 1000 }}
      >
        <div className='max-w-screen-xl mx-auto px-4 lg:px-10 flex items-center justify-between py-3'>
          {/* Left Side: User Icon and Hamburger Menu for Mobile */}
          <div className='flex items-center space-x-4'>
            {/* User Icon */}
            <User
              className='text-gray-800 cursor-pointer hover:text-[#2c6449]'
              onClick={toggleDropdown}
              aria-label='User Account'
              size={24} // Feather icons use `size` prop for dimension
            />
            {isDropdownOpen && (
              <div className='absolute left-0 mt-12 w-48 bg-white shadow-md rounded-md py-2'>
                <button
                  className='block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100'
                  onClick={() => router.push("/auth/registration")}
                >
                  Login
                </button>
              </div>
            )}

            {/* Hamburger Menu Icon */}
            <button
              className='text-gray-800 focus:outline-none md:hidden'
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label='Toggle menu'
            >
              {isMenuOpen ? (
                <X size={24} /> // Feather icons use `size` prop
              ) : (
                <Menu size={24} /> // Feather icons use `size` prop
              )}
            </button>
          </div>

          {/* Right Side: Logo aligned to the Right */}
          <Link href='/'>
            <div className='transition-all duration-500'>
              <Image
                src={logo}
                alt='Logo'
                width={80}
                height={80}
                className='transition-all duration-500'
              />
            </div>
          </Link>
        </div>
      </header>

      {/* Horizontal Navigation Bar with Sticky Position and Scroll Animation */}
      <nav
        className={`${
          isScrolled
            ? "bg-white text-[#2c6449] shadow-md"
            : "bg-[#2c6449] text-white"
        } py-2 hidden lg:flex sticky top-0 z-40 transition-all duration-500`}
      >
        <div className='max-w-screen-xl mx-auto px-4 flex justify-between items-center'>
          {/* Navigation Links */}
          <div className='flex justify-center space-x-8 text-sm lg:text-base'>
            <Link href='/' className='hover:text-gray-500'>
              All categories
            </Link>
            <Link href='/' className='hover:text-gray-500'>
              Featured selections
            </Link>
            <Link href='/' className='hover:text-gray-500'>
              Trade Assurance
            </Link>
            <Link href='/' className='hover:text-gray-500'>
              Buyer Central
            </Link>
            <Link href='/' className='hover:text-gray-500'>
              Help Center
            </Link>
            <Link href='/' className='hover:text-gray-500'>
              Get the app
            </Link>
            <Link
              href='/'
              className={`hover:text-gray-500 ${
                isScrolled ? "text-[#2c6449]" : "text-white"
              } mr-24`} /* Increased margin for more spacing */
            >
              Become a vendor
            </Link>
          </div>

          {/* Right-Aligned Logo with Hover Effect */}
          <div className='transition-opacity duration-500 ease-in-out transform hover:scale-110'>
            <Image
              src={logo}
              alt='Right Logo'
              width={40}
              height={40}
              className={`${
                isScrolled ? "opacity-100" : "opacity-0"
              } transition-opacity duration-500`}
            />
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <div
        className={`${
          isMenuOpen ? "block" : "hidden"
        } md:hidden bg-[#2c6449] text-white transition-all duration-500 py-4`}
      >
        <nav className='flex flex-col space-y-4 text-center'>
          <Link
            href='/'
            className='hover:text-gray-300'
            onClick={handleLinkClick}
          >
            البائعين
          </Link>
          <Link
            href='/'
            className='hover:text-gray-300'
            onClick={handleLinkClick}
          >
            حمل التطبيق
          </Link>
          <Link
            href='/'
            className='hover:text-gray-300'
            onClick={handleLinkClick}
          >
            خدمة العملاء
          </Link>
          <Link
            href='/'
            className='hover:text-gray-300'
            onClick={handleLinkClick}
          >
            منتجات سعودية
          </Link>
          <Link
            href='/'
            className='hover:text-gray-300'
            onClick={handleLinkClick}
          >
            معدات
          </Link>
          <Link
            href='/'
            className='hover:text-gray-300'
            onClick={handleLinkClick}
          >
            مواد بناء
          </Link>
        </nav>
      </div>
    </>
  );
}
