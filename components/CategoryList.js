// components/CategoryList.js
import React from "react";

const CategoryList = ({ categoriesWithImages }) => {
  return (
    <section className='mb-8'>
      <h2
        className='text-right text-3xl font-semibold mb-4' // Increased font size
        style={{ color: "#2c6449", letterSpacing: "0.1em" }} // Added letter spacing
      >
        الفئات {/* Arabic for "Categories" */}
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
  );
};

export default CategoryList;
