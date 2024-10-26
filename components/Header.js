"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import logo from "../public/logo-marsos.svg";
import { User, Menu, X } from "react-feather";
import LogoutButton from "./LogoutButton";
import jwt from "jsonwebtoken";
import { db } from "../lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState(""); // New state for user role
  const router = useRouter();

  // Detect scroll position to apply styles to the horizontal menu
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check login status and set user information based on token and Firestore data
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        setIsLoggedIn(true);
        try {
          const decodedToken = jwt.decode(token);
          const phoneNumber = decodedToken?.phoneNumber;

          if (phoneNumber) {
            // Check across multiple user collections
            const userDoc = await fetchUserFromCollections(phoneNumber);
            setUserName(userDoc?.name || "User");
            setUserRole(userDoc?.role || "buyer"); // Set role for dynamic dashboard links
          }
        } catch (error) {
          console.error("Error decoding token or fetching user data:", error);
          setUserName("User");
          setUserRole("buyer");
        }
      } else {
        setIsLoggedIn(false);
        setUserName("");
        setUserRole("");
      }
    };

    checkLoginStatus();
    window.addEventListener("storage", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  // Fetch user details from multiple Firestore collections based on phone number
  const fetchUserFromCollections = async (phoneNumber) => {
    const collections = ["buyers", "suppliers"]; // Updated from 'sellers' to 'suppliers'

    for (const userCollection of collections) {
      try {
        console.log(
          `Searching for user in collection: ${userCollection} with phoneNumber: ${phoneNumber}`
        );
        const usersCollection = collection(db, userCollection);
        const q = query(
          usersCollection,
          where("phoneNumber", "==", phoneNumber)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          console.log(`User found in ${userCollection} collection:`, userData);
          return { ...userData, role: userCollection.slice(0, -1) }; // Assign role as 'buyer' or 'supplier'
        }
      } catch (error) {
        console.error(
          `Error fetching user data from ${userCollection} collection:`,
          error
        );
      }
    }

    console.warn("No user found for this phone number in any collection.");
    return null;
  };

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
          {/* User Icon, Username, and Hamburger Menu for Mobile */}
          <div className='flex items-center space-x-4 relative'>
            {/* User Icon and Username */}
            <div
              className='flex items-center cursor-pointer'
              onClick={toggleDropdown}
            >
              <User
                className='text-gray-800 hover:text-[#2c6449]'
                aria-label='User Account'
                size={24}
              />
              {isLoggedIn && (
                <span className='ml-2 text-gray-800 font-medium'>
                  {userName}
                </span>
              )}
            </div>
            {isDropdownOpen && (
              <div
                className='absolute bg-white shadow-md rounded-md py-2'
                style={{ top: "50px", left: "0", minWidth: "200px" }}
              >
                {isLoggedIn ? (
                  <>
                    <button
                      className='block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100'
                      onClick={() => router.push(`/dashboard/${userRole}`)}
                    >
                      Dashboard
                    </button>
                    <LogoutButton /> {/* Show Logout if logged in */}
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

            {/* Hamburger Menu Icon */}
            <button
              className='text-gray-800 focus:outline-none md:hidden'
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label='Toggle menu'
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Logo */}
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

      {/* Horizontal Navigation Bar */}
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
              } mr-24`}
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
          {/* Add additional mobile links here */}
        </nav>
      </div>
    </>
  );
}
