// pages/ProductsPage.js
"use client";

import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import bannerImg from "../public/banner.webp";
import CategoryList from "@/components/CategoryList"; // Import CategoryList component
import ProductList from "@/components/ProductList"; // Import ProductList component

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categoriesWithImages, setCategoriesWithImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Products from Firestore
  useEffect(() => {
    async function fetchProducts() {
      try {
        const productSnapshot = await getDocs(collection(db, "products"));
        const productList = productSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProducts(productList);

        // Extract unique categories and associate with the first product's image
        const categoryMap = {};
        productList.forEach((product) => {
          const categoryName = product.category || "Uncategorized";
          if (!categoryMap[categoryName]) {
            categoryMap[categoryName] =
              product.images && product.images[0]
                ? product.images[0].thumbnail
                : "/placeholder-image.png"; // Use first product image or placeholder
          }
        });

        const categories = Object.keys(categoryMap).map((category) => ({
          name: category,
          image: categoryMap[category],
        }));

        setCategoriesWithImages(categories);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products: ", error);
        setLoading(false); // Stop loading if there's an error
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return <p>Loading data...</p>;
  }

  return (
    <>
      <Header />
      {/* Hero Section */}
      <div className='relative h-96 w-full'>
        <Image
          src={bannerImg}
          alt='Banner Image'
          fill
          style={{ objectFit: "cover" }}
          quality={100}
        />
        <div className='absolute inset-0 flex flex-col justify-center items-center text-white bg-black bg-opacity-70'>
          <h1 className='text-5xl font-bold mb-4'>مرحبًا بكم في سوقنا</h1>
          <p className='text-xl mb-8'>
            اكتشف أفضل المنتجات من كبار الموردين حولك.
          </p>
          <div className='flex space-x-4'>
            <Link
              href='/register'
              className='bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600'
            >
              تسوق الآن
            </Link>
            <Link
              href='/register?vendor=true'
              className='bg-[#2c6449] text-white px-4 py-2 rounded-lg hover:bg-blue-600'
            >
              كن مورداً
            </Link>
          </div>
        </div>
      </div>

      <div className='max-w-screen-xl mx-auto p-6'>
        {/* Centered "Our Products" Title */}
        <h1 className='text-5xl font-bold text-center mb-6 tracking-wider'>
          منتجاتنا
        </h1>

        {/* Categories (Right-Aligned with Custom Styling) */}
        <CategoryList categoriesWithImages={categoriesWithImages} />

        {/* Just for You - Product Listing */}
        <ProductList products={products} />
      </div>
      <Footer />
    </>
  );
}
