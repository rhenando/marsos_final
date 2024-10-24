import Link from "next/link";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className='bg-[#2c6449] text-white py-10'>
      <div className='max-w-screen-xl mx-auto px-4 lg:px-10'>
        {/* Footer Content */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {/* Left Column: Company Overview */}
          <div>
            <h3 className='text-lg font-semibold mb-4'>Marsos</h3>
            <p className='text-gray-300 mb-4'>
              We are a customer-focused company offering top-quality products
              and services to help you excel. Explore our product range and
              connect with us.
            </p>
            <p className='text-gray-300'>1234 Street Name, City, Country</p>
            <p className='text-gray-300'>Phone: +123-456-7890</p>
            <p className='text-gray-300'>Email: info@yourcompany.com</p>
          </div>

          {/* Middle Column: Quick Links */}
          <div className='flex flex-col space-y-4'>
            <h3 className='text-lg font-semibold mb-4'>Quick Links</h3>
            <ul className='space-y-2'>
              <li>
                <Link href='/about-us' className='hover:text-gray-300'>
                  About Us
                </Link>
              </li>
              <li>
                <Link href='/help-center' className='hover:text-gray-300'>
                  Help Center
                </Link>
              </li>
              <li>
                <Link href='/privacy-policy' className='hover:text-gray-300'>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href='/terms-conditions' className='hover:text-gray-300'>
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href='/careers' className='hover:text-gray-300'>
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Right Column: Newsletter Signup & Social Icons */}
          <div>
            <h3 className='text-lg font-semibold mb-4'>Stay Connected</h3>
            <p className='text-gray-300 mb-4'>
              Subscribe to our newsletter and stay updated with the latest news
              and special offers.
            </p>
            {/* Newsletter Signup Form */}
            <form className='flex mb-4'>
              <input
                type='email'
                placeholder='Enter your email'
                className='w-full p-2 rounded-l-md text-gray-800'
              />
              <button className='bg-[#1d4d36] p-2 rounded-r-md hover:bg-[#15422c]'>
                Subscribe
              </button>
            </form>
            {/* Social Media Icons */}
            <div className='flex space-x-4'>
              <a
                href='https://facebook.com'
                target='_blank'
                rel='noopener noreferrer'
                className='text-gray-300 hover:text-white'
              >
                <FaFacebookF className='w-5 h-5' />
              </a>
              <a
                href='https://twitter.com'
                target='_blank'
                rel='noopener noreferrer'
                className='text-gray-300 hover:text-white'
              >
                <FaTwitter className='w-5 h-5' />
              </a>
              <a
                href='https://instagram.com'
                target='_blank'
                rel='noopener noreferrer'
                className='text-gray-300 hover:text-white'
              >
                <FaInstagram className='w-5 h-5' />
              </a>
              <a
                href='https://linkedin.com'
                target='_blank'
                rel='noopener noreferrer'
                className='text-gray-300 hover:text-white'
              >
                <FaLinkedinIn className='w-5 h-5' />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className='mt-8 border-t border-gray-600 pt-6 text-center text-gray-400 text-sm'>
          © {new Date().getFullYear()} Marsos. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
