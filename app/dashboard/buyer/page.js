"use client";

import Link from "next/link";

export default function BuyerDashboard() {
  return (
    <div className='p-8'>
      <h1 className='text-2xl font-bold mb-4'>Welcome to Buyer Dashboard</h1>

      {/* Order Overview Section */}
      <div className='grid grid-cols-2 gap-6'>
        <div className='bg-white shadow-md rounded-lg p-6'>
          <h2 className='text-lg font-semibold'>Total Orders</h2>
          <p className='text-3xl font-bold'>50</p>
        </div>
        <div className='bg-white shadow-md rounded-lg p-6'>
          <h2 className='text-lg font-semibold'>Current Orders</h2>
          <p className='text-3xl font-bold'>2</p>
        </div>
      </div>

      {/* Order History */}
      <div className='mt-8'>
        <h2 className='text-lg font-semibold mb-4'>Order History</h2>
        <table className='min-w-full bg-white'>
          <thead>
            <tr>
              <th className='py-2 px-4'>Order ID</th>
              <th className='py-2 px-4'>Product</th>
              <th className='py-2 px-4'>Status</th>
              <th className='py-2 px-4'>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className='border py-2 px-4'>12345</td>
              <td className='border py-2 px-4'>Laptop</td>
              <td className='border py-2 px-4'>Delivered</td>
              <td className='border py-2 px-4'>$1200</td>
            </tr>
            <tr>
              <td className='border py-2 px-4'>12346</td>
              <td className='border py-2 px-4'>Phone</td>
              <td className='border py-2 px-4'>Shipped</td>
              <td className='border py-2 px-4'>$800</td>
            </tr>
            {/* Add more rows as needed */}
          </tbody>
        </table>
      </div>

      {/* Browse Products Section */}
      <div className='mt-8'>
        <Link href='/products'>
          <button className='bg-green-500 text-white px-4 py-2 rounded'>
            Browse Products
          </button>
        </Link>
      </div>

      {/* Profile Management Section */}
      <div className='mt-8'>
        <h2 className='text-lg font-semibold mb-4'>Manage Profile</h2>
        <Link href='/dashboard/buyer/profile'>
          <button className='bg-blue-500 text-white px-4 py-2 rounded'>
            Edit Profile
          </button>
        </Link>
      </div>

      {/* Logout Button */}
      <div className='mt-8'>
        <button className='bg-red-500 text-white px-4 py-2 rounded'>
          Logout
        </button>
      </div>
    </div>
  );
}
