"use client";

import { useUser } from "../context/UserContext"; // Use user context for auth
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import logo from "../public/logo-marsos.svg";
import {
  FaUser,
  FaShoppingCart,
  FaClipboardList,
  FaCommentDots,
  FaBars,
  FaTimes,
} from "react-icons/fa";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown
  const router = useRouter();

  // Use UserContext-based user and role
  const { user, role, setUser, setRole } = useUser();

  // Adjust scroll state
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle logout function
  const handleLogout = () => {
    localStorage.removeItem("userInfo"); // Clear localStorage
    setUser(null); // Clear user context
    setRole(null); // Clear role context
    router.push("/"); // Redirect to homepage
    setIsDropdownOpen(false); // Close the dropdown
  };

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Redirect to dashboard based on role
  const handleDashboardClick = () => {
    setIsDropdownOpen(false);
    if (role === "supplier") {
      router.push("/dashboard/supplier");
    } else if (role === "buyer") {
      router.push("/dashboard/buyer");
    }
  };

  // Handle link click to close mobile menu
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <header
        className={`relative z-50 transition-all duration-500 ${
          isScrolled
            ? "fixed top-0 left-0 w-full z-50 bg-[#2c6449] text-white"
            : "bg-white text-gray-800"
        }`}
        style={{ zIndex: 1000 }}
      >
        <div className='absolute inset-0'></div>

        <div
          className={`relative max-w-screen-xl mx-auto px-4 lg:px-10 flex items-center justify-between md:flex-row-reverse py-3 transition-all duration-500 ${
            isScrolled ? "py-2" : "py-3"
          }`}
        >
          <div className='md:hidden flex items-center space-x-4'>
            <button
              className='text-2xl focus:outline-none'
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label='Toggle menu'
            >
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>

            <div className='relative'>
              <FaUser
                className='text-2xl cursor-pointer hover:text-[#2c6449]'
                onClick={toggleDropdown}
                aria-label='User Account'
              />
              {isDropdownOpen && (
                <div className='absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md py-2'>
                  {user ? (
                    <>
                      <button
                        className='block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100'
                        onClick={handleDashboardClick}
                      >
                        Dashboard
                      </button>
                      <button
                        className='block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100'
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <button
                      className='block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100'
                      onClick={() => router.push("/auth/registration")}
                    >
                      Login
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <Link href='/'>
            <div className='ml-auto md:ml-0 transition-all duration-500'>
              <Image
                src={logo}
                alt='Logo'
                width={isScrolled ? 60 : 100}
                height={isScrolled ? 60 : 100}
                className='transition-all duration-500'
              />
            </div>
          </Link>

          <div
            className={`hidden md:flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8 text-xl w-full md:w-auto transition-all duration-500 ${
              isScrolled ? "translate-x-[-50px]" : "translate-x-0"
            }`}
          >
            <div className='relative'>
              <FaUser
                className='w-7 h-7 hover:text-[#2c6449] cursor-pointer'
                onClick={toggleDropdown}
                aria-label='User Account'
              />
              {isDropdownOpen && (
                <div className='absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md py-2'>
                  {user ? (
                    <>
                      <button
                        className='block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100'
                        onClick={handleDashboardClick}
                      >
                        Dashboard
                      </button>
                      <button
                        className='block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100'
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <button
                      className='block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100'
                      onClick={() => router.push("/auth/registration")}
                    >
                      Login
                    </button>
                  )}
                </div>
              )}
            </div>

            <FaShoppingCart
              className='w-7 h-7 hover:text-[#2c6449] cursor-pointer'
              aria-label='Cart'
            />
            <FaClipboardList
              className='w-7 h-7 hover:text-[#2c6449] cursor-pointer'
              aria-label='Orders'
            />
            <FaCommentDots
              className='w-7 h-7 hover:text-[#2c6449] cursor-pointer'
              aria-label='Messages'
            />
          </div>
        </div>
      </header>

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
