"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase"; // Firestore setup
import { collection, getDocs, query, where } from "firebase/firestore";

export default function CategoryProductsPage({ params }) {
  // Decode the category from the URL to handle spaces and special characters
  const category = decodeURIComponent(params.category);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, "products");
        const q = query(productsCollection, where("category", "==", category));
        const productSnapshot = await getDocs(q);
        const productList = productSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productList);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [category]);

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-4'>{category}</h1>
      {products.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {products.map((product) => (
            <div key={product.id} className='bg-white p-4 rounded-lg shadow-lg'>
              <img
                src={product.imageUrl}
                alt={product.name}
                className='w-full h-48 object-cover mb-4 rounded-md'
              />
              <h2 className='text-xl font-semibold'>{product.name}</h2>
              <p className='text-gray-700'>Price: ${product.price}</p>
              <p className='text-gray-700'>Vendor: {product.vendor}</p>
              <a
                href={`/products/${product.id}`}
                className='text-blue-600 hover:underline mt-2 block'
              >
                View Product
              </a>
            </div>
          ))}
        </div>
      ) : (
        <p>No products available in this category.</p>
      )}
    </div>
  );
}
