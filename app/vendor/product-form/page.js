"use client";
import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AddProductForm() {
  const [productData, setProductData] = useState({
    name: "",
    category: "",
    subcategory: "",
    vendor: "",
    location: "",
    imageUrls: [""], // Initialize with one image field
    description: "",
    priceTiers: [{ min: "", max: "", price: "" }], // Pricing tiers
    colors: [""], // Color options
    materials: [""], // Material options
    sizes: [""], // Size options
  });

  // Handle form field changes for basic fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle price tier changes
  const handlePriceTierChange = (index, e) => {
    const { name, value } = e.target;
    const updatedPriceTiers = [...productData.priceTiers];
    updatedPriceTiers[index] = { ...updatedPriceTiers[index], [name]: value };
    setProductData((prevData) => ({
      ...prevData,
      priceTiers: updatedPriceTiers,
    }));
  };

  // Add new price tier
  const addPriceTier = () => {
    setProductData((prevData) => ({
      ...prevData,
      priceTiers: [...prevData.priceTiers, { min: "", max: "", price: "" }],
    }));
  };

  // Remove price tier
  const removePriceTier = (index) => {
    const updatedPriceTiers = [...productData.priceTiers];
    updatedPriceTiers.splice(index, 1);
    setProductData((prevData) => ({
      ...prevData,
      priceTiers: updatedPriceTiers,
    }));
  };

  // Handle colors change
  const handleColorsChange = (index, e) => {
    const updatedColors = [...productData.colors];
    updatedColors[index] = e.target.value;
    setProductData((prevData) => ({
      ...prevData,
      colors: updatedColors,
    }));
  };

  // Add new color option
  const addColor = () => {
    setProductData((prevData) => ({
      ...prevData,
      colors: [...prevData.colors, ""],
    }));
  };

  // Remove color option
  const removeColor = (index) => {
    const updatedColors = [...productData.colors];
    updatedColors.splice(index, 1);
    setProductData((prevData) => ({
      ...prevData,
      colors: updatedColors,
    }));
  };

  // Handle materials change
  const handleMaterialsChange = (index, e) => {
    const updatedMaterials = [...productData.materials];
    updatedMaterials[index] = e.target.value;
    setProductData((prevData) => ({
      ...prevData,
      materials: updatedMaterials,
    }));
  };

  // Add new material option
  const addMaterial = () => {
    setProductData((prevData) => ({
      ...prevData,
      materials: [...prevData.materials, ""],
    }));
  };

  // Remove material option
  const removeMaterial = (index) => {
    const updatedMaterials = [...productData.materials];
    updatedMaterials.splice(index, 1);
    setProductData((prevData) => ({
      ...prevData,
      materials: updatedMaterials,
    }));
  };

  // Handle sizes change
  const handleSizesChange = (index, e) => {
    const updatedSizes = [...productData.sizes];
    updatedSizes[index] = e.target.value;
    setProductData((prevData) => ({
      ...prevData,
      sizes: updatedSizes,
    }));
  };

  // Add new size option
  const addSize = () => {
    setProductData((prevData) => ({
      ...prevData,
      sizes: [...prevData.sizes, ""],
    }));
  };

  // Remove size option
  const removeSize = (index) => {
    const updatedSizes = [...productData.sizes];
    updatedSizes.splice(index, 1);
    setProductData((prevData) => ({
      ...prevData,
      sizes: updatedSizes,
    }));
  };

  // Handle image URL changes
  const handleImageUrlChange = (index, e) => {
    const updatedImageUrls = [...productData.imageUrls];
    updatedImageUrls[index] = e.target.value;
    setProductData((prevData) => ({
      ...prevData,
      imageUrls: updatedImageUrls,
    }));
  };

  // Add new image field
  const addImageField = () => {
    setProductData((prevData) => ({
      ...prevData,
      imageUrls: [...prevData.imageUrls, ""],
    }));
  };

  // Remove an image field
  const removeImageField = (index) => {
    const updatedImageUrls = [...productData.imageUrls];
    updatedImageUrls.splice(index, 1);
    setProductData((prevData) => ({
      ...prevData,
      imageUrls: updatedImageUrls,
    }));
  };

  // Handle form submission and forward to Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "products"), productData);
      alert("Product added successfully!");
      // Reset form data
      setProductData({
        name: "",
        category: "",
        subcategory: "",
        vendor: "",
        location: "",
        imageUrls: [""],
        description: "",
        priceTiers: [{ min: "", max: "", price: "" }],
        colors: [""],
        materials: [""],
        sizes: [""],
      });
    } catch (error) {
      console.error("Error adding product to Firestore:", error);
    }
  };

  return (
    <div className='flex flex-col items-center'>
      <h1 className='text-2xl font-bold mb-4'>Add Product</h1>
      <form
        onSubmit={handleSubmit}
        className='w-full max-w-md grid grid-cols-2 gap-4'
      >
        {/* Basic Product Information */}
        <input
          type='text'
          name='name'
          placeholder='Product Name'
          value={productData.name}
          onChange={handleChange}
          required
          className='border rounded px-3 py-1 text-sm col-span-2'
        />

        <input
          type='text'
          name='category'
          placeholder='Category'
          value={productData.category}
          onChange={handleChange}
          required
          className='border rounded px-3 py-1 text-sm'
        />

        <input
          type='text'
          name='subcategory'
          placeholder='Subcategory'
          value={productData.subcategory}
          onChange={handleChange}
          required
          className='border rounded px-3 py-1 text-sm'
        />

        <input
          type='text'
          name='vendor'
          placeholder='Vendor'
          value={productData.vendor}
          onChange={handleChange}
          required
          className='border rounded px-3 py-1 text-sm'
        />

        <input
          type='text'
          name='location'
          placeholder='Location'
          value={productData.location}
          onChange={handleChange}
          required
          className='border rounded px-3 py-1 text-sm'
        />

        {/* Multiple Image URLs */}
        <h3 className='text-sm font-semibold col-span-2'>Product Images</h3>
        {productData.imageUrls.map((imageUrl, index) => (
          <div key={index} className='col-span-2 flex items-center space-x-2'>
            <input
              type='url'
              placeholder='Image URL'
              value={imageUrl}
              onChange={(e) => handleImageUrlChange(index, e)}
              className='border rounded px-3 py-1 text-sm flex-grow'
            />
            <button
              type='button'
              onClick={() => removeImageField(index)}
              className='bg-red-500 text-white px-2 py-1 text-sm rounded'
            >
              X
            </button>
          </div>
        ))}
        <button
          type='button'
          onClick={addImageField}
          className='bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 text-sm col-span-2'
        >
          Add Another Image
        </button>

        {/* Price Tiers */}
        <h3 className='text-sm font-semibold col-span-2'>Price Tiers</h3>
        {productData.priceTiers.map((tier, index) => (
          <div
            key={index}
            className='col-span-2 grid grid-cols-3 gap-2 items-center'
          >
            <input
              type='number'
              name='min'
              placeholder='Min Quantity'
              value={tier.min}
              onChange={(e) => handlePriceTierChange(index, e)}
              className='border rounded px-2 py-1 text-sm'
            />
            <input
              type='number'
              name='max'
              placeholder='Max Quantity'
              value={tier.max}
              onChange={(e) => handlePriceTierChange(index, e)}
              className='border rounded px-2 py-1 text-sm'
            />
            <input
              type='number'
              name='price'
              placeholder='Price'
              value={tier.price}
              onChange={(e) => handlePriceTierChange(index, e)}
              className='border rounded px-2 py-1 text-sm'
            />
            <button
              type='button'
              onClick={() => removePriceTier(index)}
              className='bg-red-500 text-white px-2 py-1 text-sm rounded'
            >
              X
            </button>
          </div>
        ))}
        <button
          type='button'
          onClick={addPriceTier}
          className='bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 text-sm col-span-2'
        >
          Add Price Tier
        </button>

        {/* Colors */}
        <h3 className='text-sm font-semibold col-span-2'>Colors</h3>
        {productData.colors.map((color, index) => (
          <div key={index} className='col-span-2 flex items-center space-x-2'>
            <input
              type='text'
              placeholder='Color'
              value={color}
              onChange={(e) => handleColorsChange(index, e)}
              className='border rounded px-3 py-1 text-sm flex-grow'
            />
            <button
              type='button'
              onClick={() => removeColor(index)}
              className='bg-red-500 text-white px-2 py-1 text-sm rounded'
            >
              X
            </button>
          </div>
        ))}
        <button
          type='button'
          onClick={addColor}
          className='bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 text-sm col-span-2'
        >
          Add Another Color
        </button>

        {/* Materials */}
        <h3 className='text-sm font-semibold col-span-2'>Materials</h3>
        {productData.materials.map((material, index) => (
          <div key={index} className='col-span-2 flex items-center space-x-2'>
            <input
              type='text'
              placeholder='Material'
              value={material}
              onChange={(e) => handleMaterialsChange(index, e)}
              className='border rounded px-3 py-1 text-sm flex-grow'
            />
            <button
              type='button'
              onClick={() => removeMaterial(index)}
              className='bg-red-500 text-white px-2 py-1 text-sm rounded'
            >
              X
            </button>
          </div>
        ))}
        <button
          type='button'
          onClick={addMaterial}
          className='bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 text-sm col-span-2'
        >
          Add Another Material
        </button>

        {/* Sizes */}
        <h3 className='text-sm font-semibold col-span-2'>Sizes</h3>
        {productData.sizes.map((size, index) => (
          <div key={index} className='col-span-2 flex items-center space-x-2'>
            <input
              type='text'
              placeholder='Size'
              value={size}
              onChange={(e) => handleSizesChange(index, e)}
              className='border rounded px-3 py-1 text-sm flex-grow'
            />
            <button
              type='button'
              onClick={() => removeSize(index)}
              className='bg-red-500 text-white px-2 py-1 text-sm rounded'
            >
              X
            </button>
          </div>
        ))}
        <button
          type='button'
          onClick={addSize}
          className='bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 text-sm col-span-2'
        >
          Add Another Size
        </button>

        {/* Product Description */}
        <textarea
          name='description'
          placeholder='Product Description'
          value={productData.description}
          onChange={handleChange}
          required
          className='border rounded px-3 py-1 text-sm col-span-2'
        />

        {/* Submit Button */}
        <button
          type='submit'
          className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm col-span-2'
        >
          Submit Product
        </button>
      </form>
    </div>
  );
}
