// components/ProductList.js
import React from "react";
import Link from "next/link";

const ProductList = ({ products }) => {
  return (
    <section>
      <h2
        className='text-right text-3xl font-semibold mb-4' // Increased font size
        style={{ color: "#2c6449", letterSpacing: "0.1em" }} // Added letter spacing
      >
        المنتجات المميزة {/* Arabic for "Featured Products" */}
      </h2>
      <ul className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {products.length > 0 ? (
          products.map((product, index) => (
            <li key={index} className='border p-4 rounded shadow-md bg-white'>
              {/* Product Image */}
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
              <h3 className='text-lg font-semibold'>{product.productName}</h3>
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

              {/* Request Quotation Button */}
              <Link
                href={`/products/${product.id}`}
                className='mt-4 bg-[#2c6449] text-white p-2 rounded w-full text-center block'
              >
                طلب عرض سعر {/* Arabic for "Request Quotation" */}
              </Link>
            </li>
          ))
        ) : (
          <p>No products found</p>
        )}
      </ul>
    </section>
  );
};

export default ProductList;
