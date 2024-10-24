"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase"; // Firestore setup
import { collection, getDocs } from "firebase/firestore";
import Header from "@/components/Header"; // Ensure you have the updated Header component
import Image from "next/image"; // Import Next.js Image component
import bannerImg from "../public/banner.webp";

// Example category images (make sure these images are in the public folder)
import buildingMaterialsImg from "../public/buildingcategory.jpg";
import equipmentImg from "../public/equipmentcategory.jpg";
import saudiProductsImg from "../public/saudicategory1.jpg";
import Footer from "@/components/Footer";

export default function HomePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch featured products from Firestore
    const fetchProducts = async () => {
      const productsCollection = collection(db, "products");
      const productSnapshot = await getDocs(productsCollection);
      const productList = productSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productList.slice(0, 4)); // Show 4 products as featured
    };

    fetchProducts();
  }, []);

  return (
    <>
      {/* Overlay Header */}
      <div className='relative'>
        <Header />

        {/* Hero Section with Image Component */}
        <div className='relative h-96 w-full'>
          <Image
            src={bannerImg} // Ensure this path is correct
            alt='Banner Image'
            fill
            style={{ objectFit: "cover" }}
            quality={100}
          />
          <div className='absolute inset-0 flex flex-col justify-center items-center text-white bg-black bg-opacity-70'>
            <div className='text-center'>
              <h1 className='text-5xl font-bold mb-4'>
                Welcome to Our Marketplace
              </h1>
              <p className='text-xl mb-8'>
                Find the best products from top vendors around you.
              </p>
              <div className='flex space-x-4 justify-center'>
                <Link
                  href='/register'
                  className='bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600'
                >
                  Shop Now
                </Link>
                <Link
                  href='/register?vendor=true'
                  className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600'
                >
                  Become a Vendor
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className='mx-auto p-4 mt-10'>
        <section className='mb-8'>
          <h2 className='text-3xl font-bold mb-4 text-center'>
            Featured Products
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {products.length > 0 ? (
              products.map((product) => (
                <div
                  key={product.id}
                  className='bg-white p-4 rounded-lg shadow-lg'
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className='w-full h-48 object-cover mb-4 rounded-md'
                  />
                  <h3 className='text-xl font-semibold'>{product.name}</h3>
                  <p className='text-gray-700'>Price: ${product.price}</p>
                  <Link
                    href={`/products/${product.id}`}
                    className='text-blue-600 hover:underline mt-2 block'
                  >
                    View Product
                  </Link>
                </div>
              ))
            ) : (
              <p>No products available.</p>
            )}
          </div>
        </section>

        {/* Browse Categories Section with Images */}
        <section className='mb-8'>
          <h2 className='text-3xl font-bold mb-4 text-center'>
            Browse Categories
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <Link
              href='/products/category/Building Materials'
              className='block bg-gray-100 p-6 rounded-lg shadow-lg text-center'
            >
              <Image
                src={buildingMaterialsImg} // Path to image
                alt='Building Materials'
                width={450}
                height={150}
                className='mx-auto mb-4 rounded-md'
              />
              <h3 className='text-xl font-semibold'>Building Materials</h3>
            </Link>
            <Link
              href='/products/category/Equipment'
              className='block bg-gray-100 p-6 rounded-lg shadow-lg text-center'
            >
              <Image
                src={equipmentImg} // Path to image
                alt='Equipment'
                width={450}
                height={150}
                className='mx-auto mb-4 rounded-md'
              />
              <h3 className='text-xl font-semibold'>Equipment</h3>
            </Link>
            <Link
              href='/products/category/Saudi Products'
              className='block bg-gray-100 p-6 rounded-lg shadow-lg text-center'
            >
              <Image
                src={saudiProductsImg} // Path to image
                alt='Saudi Products'
                width={450}
                height={150}
                className='mx-auto mb-4 rounded-md'
              />
              <h3 className='text-xl font-semibold'>Saudi Products</h3>
            </Link>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
