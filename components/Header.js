"use client"; // For client-side rendering

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Import useRouter for redirection
import logo from "../public/logo-marsos.svg"; // Adjust the path to your logo
import {
  FaUser,
  FaShoppingCart,
  FaClipboardList,
  FaCommentDots,
  FaBars, // Add hamburger icon
  FaTimes, // Add close icon
} from "react-icons/fa"; // For icons

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to control menu visibility
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // State for submenu visibility
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Simulating user logged-in state (you can replace this with your actual login logic)
  const userMenuRef = useRef(null); // Reference for the user menu
  const router = useRouter(); // Initialize the router

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true); // When scrolled down 50px or more
      } else {
        setIsScrolled(false); // Reset when at the top of the page
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close the submenu if clicked outside
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    // Add event listener for clicks outside the menu
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Cleanup the event listener on component unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleUserIconClick = () => {
    // If the user is not logged in, redirect to the registration page
    if (!isLoggedIn) {
      router.push("/auth/registration");
    } else {
      // Otherwise, toggle the user menu
      setIsUserMenuOpen(!isUserMenuOpen);
    }
  };

  return (
    <>
      {/* Header Section */}
      <header
        className={`relative z-50 transition-all duration-500 ${
          isScrolled
            ? "fixed top-0 left-0 w-full z-50 bg-[#2c6449] text-white"
            : "bg-white text-gray-800"
        }`}
        style={{ zIndex: 1000 }} // Ensure header has higher z-index
      >
        <div className='absolute inset-0'></div>

        <div
          className={`relative max-w-screen-xl mx-auto px-4 lg:px-10 flex items-center justify-between md:flex-row-reverse py-3 transition-all duration-500 ${
            isScrolled ? "py-2" : "py-3"
          }`}
        >
          {/* Hamburger Menu Icon for small and medium screens (left side) */}
          <div className='md:hidden flex items-center'>
            <button
              className='text-2xl focus:outline-none'
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          {/* Main Logo Section (right side on small and medium screens, and on the right for large screens) */}
          <Link href='/'>
            <div className='ml-auto md:ml-0 transition-all duration-500'>
              <Image
                src={logo}
                alt='Logo'
                width={isScrolled ? 60 : 100} // Reduce logo size when scrolled
                height={isScrolled ? 60 : 100}
                className='transition-all duration-500'
              />
            </div>
          </Link>

          {/* Icons and Info Section - Hidden on small/medium, visible on large screens */}
          <div
            className={`hidden md:flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8 text-xl w-full md:w-auto transition-all duration-500 ${
              isScrolled ? "translate-x-[-50px]" : "translate-x-0"
            }`}
          >
            {/* Icons */}
            <div className='flex justify-center md:justify-start space-x-6 relative'>
              {/* User Icon */}
              <FaUser
                className='w-7 h-7 hover:text-[#2c6449] cursor-pointer'
                onClick={handleUserIconClick} // Call the user icon click handler
              />

              {/* Submenu Container */}
              {isUserMenuOpen && isLoggedIn && (
                <div
                  ref={userMenuRef}
                  className='absolute top-full mt-2 bg-white text-gray-800 p-4 shadow-lg rounded-lg z-50 w-64 max-h-[300px] overflow-y-auto'
                  style={{ zIndex: 1001 }} // Ensure submenu is above everything
                >
                  <ul className='text-base space-y-4'>
                    <li>
                      <Link href='/my-marsos'>My Marsos</Link>
                    </li>
                    <li>
                      <Link href='/orders'>Orders</Link>
                    </li>
                    <li>
                      <Link href='/messages'>Messages</Link>
                    </li>
                    <li>
                      <Link href='/rfqs'>RFQs</Link>
                    </li>
                    <li>
                      <Link href='/favorites'>Favorites</Link>
                    </li>
                    <li>
                      <Link href='/account'>Account</Link>
                    </li>
                    <li>
                      <Link href='/sign-out'>Sign Out</Link>
                    </li>
                  </ul>
                </div>
              )}

              {/* Other Icons */}
              <FaShoppingCart className='w-7 h-7 hover:text-[#2c6449] cursor-pointer' />
              <FaClipboardList className='w-7 h-7 hover:text-[#2c6449] cursor-pointer' />
              <FaCommentDots className='w-7 h-7 hover:text-[#2c6449] cursor-pointer' />
            </div>

            {/* Delivery Info */}
            <div className='flex items-center justify-center md:justify-start space-x-2'>
              <span className='text-lg'>التوصيل إلى:</span>{" "}
              {/* Translated "Deliver to:" */}
              <Image
                src='/sa-flag.svg'
                alt='Saudi Flag'
                width={24}
                height={18}
              />
              <span className='text-lg font-semibold'>SA</span>
            </div>

            {/* Language & Currency */}
            <div className='text-lg space-x-2 text-center md:text-left'>
              <span>English-USD</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hamburger Menu Links (small and medium screens) */}
      <div
        className={`${
          isMenuOpen ? "block" : "hidden"
        } md:hidden bg-[#2c6449] text-white transition-all duration-500 py-4`}
      >
        <nav className='flex flex-col space-y-4 text-center'>
          <Link href='/' className='hover:text-gray-300'>
            البائعين {/* Become a vendor */}
          </Link>
          <Link href='/' className='hover:text-gray-300'>
            حمل التطبيق {/* Get the app */}
          </Link>
          <Link href='/' className='hover:text-gray-300'>
            خدمة العملاء {/* Help Center */}
          </Link>
          <Link href='/' className='hover:text-gray-300'>
            منتجات سعودية {/* Products */}
          </Link>
          <Link href='/' className='hover:text-gray-300'>
            معدات {/* Equipment */}
          </Link>
          <Link href='/' className='hover:text-gray-300'>
            مواد بناء {/* Construction */}
          </Link>
        </nav>
      </div>

      {/* Horizontal Navigation Bar for larger screens */}
      <div
        className={`hidden md:block transition-all duration-500 py-4 shadow-md ${
          isScrolled
            ? "bg-white text-[#2c6449] fixed top-0 left-0 w-full z-40"
            : "bg-[#2c6449] text-white"
        }`}
      >
        <nav className='max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between items-center'>
          {/* Right-side Links */}
          <div className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-10'>
            <Link href='/' className='hover:text-gray-500'>
              البائعين {/* Become a vendor */}
            </Link>
            <Link href='/' className='hover:text-gray-500'>
              حمل التطبيق {/* Get the app */}
            </Link>
            <Link href='/' className='hover:text-gray-500'>
              خدمة العملاء {/* Help Center */}
            </Link>
          </div>

          {/* Left-side Links */}
          <div className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-10 mt-4 md:mt-0 items-center'>
            <Link href='/' className='hover:text-gray-500'>
              منتجات سعودية {/* Products */}
            </Link>
            <Link href='/' className='hover:text-gray-500'>
              معدات {/* Equipment */}
            </Link>
            <Link href='/' className='hover:text-gray-500'>
              مواد بناء {/* Construction */}
            </Link>
            {isScrolled && (
              <Image
                src={logo}
                alt='Small Logo'
                width={40}
                height={40}
                className='ml-4 transition-opacity duration-500'
              />
            )}
          </div>
        </nav>
      </div>
    </>
  );
}
