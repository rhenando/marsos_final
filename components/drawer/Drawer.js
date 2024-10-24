import React, { useState } from "react";

// Updated price tiers and weight options
const priceTiers = [
  { min: 5, max: 49, price: 0.88 },
  { min: 50, max: 99, price: 0.68 },
  { min: 100, max: 149, price: 0.48 },
  { min: 200, price: 0.28 },
];

// Removed colors and materials, replaced sizes with weights
const weights = ["5kgs", "10kgs"];

const Drawer = ({ isOpen, onClose }) => {
  const [selectedVariation, setSelectedVariation] = useState({
    weight: weights[0], // Default weight selection
    quantities: weights.reduce((acc, weight) => ({ ...acc, [weight]: 0 }), {}), // Quantities per weight
  });

  const [subtotal, setSubtotal] = useState(0);

  if (!isOpen) return null;

  // Handle variation change (for weight selection)
  const handleVariationChange = (variationType, value) => {
    setSelectedVariation((prev) => ({
      ...prev,
      [variationType]: value,
    }));
  };

  // Handle quantity change for weights
  const handleQuantityChange = (weight, quantity) => {
    const updatedQuantities = {
      ...selectedVariation.quantities,
      [weight]: quantity,
    };
    setSelectedVariation((prev) => ({
      ...prev,
      quantities: updatedQuantities,
    }));
    calculateSubtotal(updatedQuantities);
  };

  // Calculate subtotal based on quantities
  const calculateSubtotal = (quantities) => {
    let totalQuantity = Object.values(quantities).reduce(
      (acc, qty) => acc + parseInt(qty),
      0
    );
    let price =
      priceTiers.find(
        (tier) =>
          totalQuantity >= tier.min && (!tier.max || totalQuantity <= tier.max)
      )?.price || 0;
    setSubtotal(totalQuantity * price);
  };

  return (
    <div className='fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex justify-end'>
      <div className='w-[400px] bg-white p-6 shadow-xl h-screen overflow-y-auto'>
        <button onClick={onClose} className='text-gray-500 float-right mb-4'>
          X Close
        </button>

        {/* Price Tiers */}
        <h3 className='text-lg font-semibold mb-4'>Price before shipping</h3>
        <div className='text-red-500 mb-6'>
          {priceTiers.map((tier, index) => (
            <div key={index}>
              {tier.min} - {tier.max ? `${tier.max} pieces` : "≥ 200 pieces"}: $
              {tier.price.toFixed(2)}
            </div>
          ))}
        </div>

        {/* Weight Selection */}
        <h4 className='text-lg font-semibold mb-2'>1. Weight</h4>
        <div className='flex space-x-2 mb-4'>
          {weights.map((weight, index) => (
            <button
              key={index}
              onClick={() => handleVariationChange("weight", weight)}
              className={`px-4 py-2 rounded ${
                selectedVariation.weight === weight
                  ? "bg-[#204b36] text-white"
                  : "bg-gray-200"
              }`}
            >
              {weight}
            </button>
          ))}
        </div>

        {/* Quantity Selection with Weight */}
        <h4 className='text-lg font-semibold mb-2'>2. Quantity</h4>
        <div className='grid grid-cols-2 gap-4 mb-6'>
          {weights.map((weight, index) => (
            <div key={index} className='flex items-center justify-between'>
              <p>{weight}</p>
              <div className='flex items-center space-x-2'>
                <button
                  onClick={() =>
                    handleQuantityChange(
                      weight,
                      Math.max(0, selectedVariation.quantities[weight] - 1)
                    )
                  }
                  className='bg-gray-200 px-2 py-1 rounded'
                >
                  -
                </button>
                <input
                  type='number'
                  value={selectedVariation.quantities[weight]}
                  onChange={(e) =>
                    handleQuantityChange(weight, parseInt(e.target.value))
                  }
                  className='w-12 text-center border rounded'
                  min='0'
                />
                <button
                  onClick={() =>
                    handleQuantityChange(
                      weight,
                      selectedVariation.quantities[weight] + 1
                    )
                  }
                  className='bg-gray-200 px-2 py-1 rounded'
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Subtotal */}
        <div className='border-t pt-4 mt-4'>
          <p className='text-lg font-semibold'>
            Item subtotal: ${subtotal.toFixed(2)}
          </p>
          <button className='bg-[#2c6449] text-white px-4 py-2 rounded mt-4 w-full'>
            Complete Order Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default Drawer;
