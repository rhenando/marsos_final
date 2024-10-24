"use client";

import { useState, useEffect } from "react";
import Link from "next/link"; // Import Link for navigation
import { db } from "../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categoriesWithImages, setCategoriesWithImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Products from Firestore
  useEffect(() => {
    async function fetchProducts() {
      try {
        // Fetch all products
        const productSnapshot = await getDocs(collection(db, "products"));
        const productList = productSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProducts(productList); // Set Products

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

        setCategoriesWithImages(categories); // Set categories with associated images
        setLoading(false); // Stop loading
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
      <div className='max-w-screen-xl mx-auto p-6'>
        {/* Centered "Our Products" Title */}
        <h1 className='text-3xl font-bold text-center mb-6'>Our Products</h1>

        {/* Categories (Right-Aligned with Custom Styling) */}
        <section className='mb-8'>
          <h2
            className='text-right text-2xl font-semibold mb-4'
            style={{ color: "#2c6449" }}
          >
            Categories
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {categoriesWithImages.length > 0 ? (
              categoriesWithImages.map((category, idx) => (
                <div key={idx} className='p-4 bg-white rounded-lg shadow-md'>
                  <img
                    src={category.image}
                    alt={category.name}
                    className='w-full h-48 object-cover rounded mb-2'
                  />
                  <h3 className='text-lg font-semibold text-center'>
                    {category.name}
                  </h3>
                </div>
              ))
            ) : (
              <p>No categories found</p>
            )}
          </div>
        </section>

        {/* Just for You - Product Listing */}
        <section>
          <h2 className='text-xl font-semibold mb-4'>Featured Products</h2>
          <ul className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {products.length > 0 ? (
              products.map((product, index) => (
                <li
                  key={index}
                  className='border p-4 rounded shadow-md bg-white'
                >
                  {/* Product Image (Thumbnail) */}
                  {product.images && product.images[0] ? (
                    <img
                      src={product.images[0].thumbnail}
                      alt={product.productName}
                      className='w-full h-48 object-cover rounded mb-4'
                    />
                  ) : (
                    <img
                      src='/placeholder-image.png'
                      alt='Placeholder'
                      className='w-full h-48 object-cover rounded mb-4'
                    />
                  )}

                  {/* Product Name and Category */}
                  <h3 className='text-lg font-semibold'>
                    {product.productName}
                  </h3>
                  <p className='text-gray-600 text-sm'>
                    Category: {product.category || "N/A"}
                  </p>

                  {/* Price and Minimum Order */}
                  {product.priceRanges && product.priceRanges.length > 0 && (
                    <p className='text-sm text-gray-600'>
                      ﷼{product.priceRanges[0].price} (Min. order:{" "}
                      {product.priceRanges[0].min} units)
                    </p>
                  )}

                  {/* Stock Quantity */}
                  {product.stockQuantity && (
                    <p className='text-sm text-gray-600'>
                      Stock: {product.stockQuantity}
                    </p>
                  )}

                  {/* Request Quotation Button (Link to Product Details Page) */}
                  <Link
                    href={`/products/${product.id}`}
                    className='mt-4 bg-[#2c6449] text-white p-2 rounded w-full text-center block'
                  >
                    Request Quotation
                  </Link>
                </li>
              ))
            ) : (
              <p>No products found</p>
            )}
          </ul>
        </section>
      </div>
      <Footer />
    </>
  );
}
