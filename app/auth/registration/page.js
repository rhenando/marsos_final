"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import authLogo from "../../../public/logo.svg";

export default function RegistrationPage() {
  const router = useRouter();
  const [role, setRole] = useState("");

  const handleNext = () => {
    if (role === "supplier") {
      router.push("/auth/supplier");
    } else if (role === "buyer") {
      router.push("/auth/buyer");
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-50'>
      <div className='w-full max-w-md p-8 bg-white rounded-lg shadow-lg'>
        {/* Logo */}
        <div className='flex justify-center mb-8'>
          {/* Replace this with the actual logo image */}
          <Image src={authLogo} alt='Logo' className='w-28 h-28' />
        </div>

        {/* Title */}
        <h1 className='text-2xl text-center text-[#2c6449] font-bold mb-6'>
          Register as a
        </h1>

        {/* Role Selection Buttons */}
        <div className='flex justify-around mb-8'>
          <button
            onClick={() => setRole("supplier")}
            className={`py-2 px-6 w-32 rounded-md font-semibold transition-all ${
              role === "supplier"
                ? "bg-[#2c6449] text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Supplier
          </button>
          <button
            onClick={() => setRole("buyer")}
            className={`py-2 px-6 w-32 rounded-md font-semibold transition-all ${
              role === "buyer"
                ? "bg-[#2c6449] text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Buyer
          </button>
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className='w-full py-3 bg-[#2c6449] text-white rounded-md font-semibold hover:bg-[#1d4d36] transition-all ease-in-out duration-200'
        >
          Next
        </button>
      </div>
    </div>
  );
}