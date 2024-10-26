"use client";
import { useState, useEffect } from "react";
import { db, storage } from "../../../../lib/firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function AddProduct() {
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");

  const [colorVariations, setColorVariations] = useState([
    { color: "", price: "" },
  ]);
  const [sizeVariations, setSizeVariations] = useState([
    { size: "", price: "" },
  ]);
  const [typeVariations, setTypeVariations] = useState([
    { type: "", price: "" },
  ]);

  const [priceRanges, setPriceRanges] = useState([
    { minQuantity: "", maxQuantity: "", price: "" },
  ]);
  const [images, setImages] = useState([{ mainImage: null, thumbnail: null }]);
  const [supplierName, setSupplierName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("+966541308463"); // Replace with actual phone number

  const [dimensions, setDimensions] = useState({
    height: { value: "", unit: "cm" },
    weight: { value: "", unit: "kg" },
    length: { value: "", unit: "cm" },
    width: { value: "", unit: "cm" },
  });

  useEffect(() => {
    const fetchSupplierData = async () => {
      try {
        if (!phoneNumber) return;

        const suppliersRef = collection(db, "suppliers");
        const q = query(suppliersRef, where("phoneNumber", "==", phoneNumber));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const supplierDoc = querySnapshot.docs[0];
          const supplierData = supplierDoc.data();
          setSupplierName(supplierData.name || ""); // Set supplier name automatically
        } else {
          console.error("Supplier not found with the provided phone number");
        }
      } catch (error) {
        console.error("Error fetching supplier data:", error);
      }
    };

    fetchSupplierData();
  }, [phoneNumber]);

  const uploadImage = async (imageFile, filePath) => {
    const storageRef = ref(storage, filePath);
    const snapshot = await uploadBytes(storageRef, imageFile);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const timestamp = new Date().getTime();

      const uploadedImages = await Promise.all(
        images.map(async (image, index) => {
          const mainImageURL = await uploadImage(
            image.mainImage,
            `products/${phoneNumber}/mainImage_${timestamp}_${index}`
          );
          const thumbnailURL = await uploadImage(
            image.thumbnail,
            `products/${phoneNumber}/thumbnail_${timestamp}_${index}`
          );
          return { mainImage: mainImageURL, thumbnail: thumbnailURL };
        })
      );

      // Add supplier name automatically to the product data
      await addDoc(collection(db, "products"), {
        productName,
        category,
        location,
        stockQuantity,
        productDescription,
        deliveryMethod,
        deliveryTime,
        colorVariations,
        sizeVariations,
        typeVariations,
        priceRanges,
        images: uploadedImages,
        phoneNumber,
        name: supplierName, // Automatically set supplier's name as "name" field
        dimensions,
      });

      // Clear form fields after submission
      setProductName("");
      setCategory("");
      setLocation("");
      setStockQuantity("");
      setProductDescription("");
      setDeliveryMethod("");
      setDeliveryTime("");
      setColorVariations([{ color: "", price: "" }]);
      setSizeVariations([{ size: "", price: "" }]);
      setTypeVariations([{ type: "", price: "" }]);
      setPriceRanges([{ minQuantity: "", maxQuantity: "", price: "" }]);
      setDimensions({
        height: { value: "", unit: "cm" },
        weight: { value: "", unit: "kg" },
        length: { value: "", unit: "cm" },
        width: { value: "", unit: "cm" },
      });
      setImages([{ mainImage: null, thumbnail: null }]);
      alert("Product added successfully!");
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Please try again.");
    }
  };

  const handleVariationChange = (index, field, value, type) => {
    const updatedVariations =
      type === "color"
        ? [...colorVariations]
        : type === "size"
        ? [...sizeVariations]
        : [...typeVariations];

    updatedVariations[index][field] = value;

    if (type === "color") setColorVariations(updatedVariations);
    if (type === "size") setSizeVariations(updatedVariations);
    if (type === "type") setTypeVariations(updatedVariations);
  };

  const addVariation = (type) => {
    if (type === "color") {
      setColorVariations([...colorVariations, { color: "", price: "" }]);
    } else if (type === "size") {
      setSizeVariations([...sizeVariations, { size: "", price: "" }]);
    } else if (type === "type") {
      setTypeVariations([...typeVariations, { type: "", price: "" }]);
    }
  };

  const handlePriceRangeChange = (index, field, value) => {
    const updatedRanges = [...priceRanges];
    updatedRanges[index][field] = value;
    setPriceRanges(updatedRanges);
  };

  const addPriceRange = () => {
    setPriceRanges([
      ...priceRanges,
      { minQuantity: "", maxQuantity: "", price: "" },
    ]);
  };

  const handleImageChange = (index, field, file) => {
    const updatedImages = [...images];
    updatedImages[index][field] = file;
    setImages(updatedImages);
  };

  const addImageFields = () => {
    setImages([...images, { mainImage: null, thumbnail: null }]);
  };

  const handleDimensionChange = (field, value, unit) => {
    setDimensions({ ...dimensions, [field]: { value, unit } });
  };

  return (
    <>
      <Header />
      <div className='min-h-screen flex items-center justify-center bg-gray-100'>
        <div className='bg-white p-6 shadow-lg rounded-lg max-w-4xl w-full'>
          <h3 className='text-lg font-bold text-center mb-4'>
            Supplier Name: {supplierName || "Loading..."}
          </h3>

          <form onSubmit={handleSubmit} className='grid grid-cols-2 gap-4'>
            {/* Product Name */}
            <input
              type='text'
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder='Product Name'
              className='border rounded p-2 w-full col-span-2'
              required
            />

            {/* Category and Location */}
            <input
              type='text'
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder='Category'
              className='border rounded p-2 w-full'
              required
            />
            <input
              type='text'
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder='Location'
              className='border rounded p-2 w-full'
              required
            />

            {/* Product Description and Stock Quantity */}
            <select
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              className='border rounded p-2 w-full'
              required
            >
              <option value=''>Choose Product Description</option>
              <option value='Wet'>Wet</option>
              <option value='Dry'>Dry</option>
              <option value='Both'>Both</option>
            </select>

            <input
              type='number'
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              placeholder='Stock Quantity'
              className='border rounded p-2 w-full'
              required
            />

            {/* Delivery Method and Delivery Time */}
            <select
              value={deliveryTime}
              onChange={(e) => setDeliveryTime(e.target.value)}
              className='border rounded p-2 w-full'
              required
            >
              <option value=''>Choose Delivery Time</option>
              {[...Array(31)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} day{i + 1 > 1 ? "s" : ""}
                </option>
              ))}
            </select>

            <select
              value={deliveryMethod}
              onChange={(e) => setDeliveryMethod(e.target.value)}
              className='border rounded p-2 w-full'
              required
            >
              <option value=''>Choose Delivery Method</option>
              <option value='Big Truck'>Big Truck</option>
              <option value='Small Pick Up'>Small Pick Up</option>
              <option value='Normal Car'>Normal Car</option>
              <option value='Motor Cycle'>Motor Cycle</option>
            </select>

            {/* Color Variations */}
            <h4 className='col-span-2 text-lg font-semibold'>
              Color Variations
            </h4>
            {colorVariations.map((variation, index) => (
              <div key={index} className='col-span-2 grid grid-cols-2 gap-2'>
                <input
                  type='text'
                  value={variation.color}
                  onChange={(e) =>
                    handleVariationChange(
                      index,
                      "color",
                      e.target.value,
                      "color"
                    )
                  }
                  placeholder='Color'
                  className='border rounded p-2'
                />
                <input
                  type='number'
                  value={variation.price}
                  onChange={(e) =>
                    handleVariationChange(
                      index,
                      "price",
                      e.target.value,
                      "color"
                    )
                  }
                  placeholder='Price'
                  className='border rounded p-2'
                />
              </div>
            ))}
            <button
              type='button'
              onClick={() => addVariation("color")}
              className='bg-gray-300 text-black p-2 rounded col-span-2'
            >
              Add Another Color Variation
            </button>

            {/* Size Variations */}
            <h4 className='col-span-2 text-lg font-semibold'>
              Size Variations
            </h4>
            {sizeVariations.map((variation, index) => (
              <div key={index} className='col-span-2 grid grid-cols-2 gap-2'>
                <input
                  type='text'
                  value={variation.size}
                  onChange={(e) =>
                    handleVariationChange(index, "size", e.target.value, "size")
                  }
                  placeholder='Size'
                  className='border rounded p-2'
                />
                <input
                  type='number'
                  value={variation.price}
                  onChange={(e) =>
                    handleVariationChange(
                      index,
                      "price",
                      e.target.value,
                      "size"
                    )
                  }
                  placeholder='Price'
                  className='border rounded p-2'
                />
              </div>
            ))}
            <button
              type='button'
              onClick={() => addVariation("size")}
              className='bg-gray-300 text-black p-2 rounded col-span-2'
            >
              Add Another Size Variation
            </button>

            {/* Type Variations */}
            <h4 className='col-span-2 text-lg font-semibold'>
              Type Variations
            </h4>
            {typeVariations.map((variation, index) => (
              <div key={index} className='col-span-2 grid grid-cols-2 gap-2'>
                <input
                  type='text'
                  value={variation.type}
                  onChange={(e) =>
                    handleVariationChange(index, "type", e.target.value, "type")
                  }
                  placeholder='Type'
                  className='border rounded p-2'
                />
                <input
                  type='number'
                  value={variation.price}
                  onChange={(e) =>
                    handleVariationChange(
                      index,
                      "price",
                      e.target.value,
                      "type"
                    )
                  }
                  placeholder='Price'
                  className='border rounded p-2'
                />
              </div>
            ))}
            <button
              type='button'
              onClick={() => addVariation("type")}
              className='bg-gray-300 text-black p-2 rounded col-span-2'
            >
              Add Another Type Variation
            </button>

            {/* Price Ranges */}
            <h4 className='col-span-2 text-lg font-semibold'>
              Wholesale Price Ranges
            </h4>
            {priceRanges.map((range, index) => (
              <div key={index} className='col-span-2 grid grid-cols-3 gap-2'>
                <input
                  type='number'
                  value={range.minQuantity}
                  onChange={(e) =>
                    handlePriceRangeChange(index, "minQuantity", e.target.value)
                  }
                  placeholder='Min Quantity'
                  className='border rounded p-2'
                />
                <input
                  type='number'
                  value={range.maxQuantity}
                  onChange={(e) =>
                    handlePriceRangeChange(index, "maxQuantity", e.target.value)
                  }
                  placeholder='Max Quantity'
                  className='border rounded p-2'
                />
                <input
                  type='number'
                  value={range.price}
                  onChange={(e) =>
                    handlePriceRangeChange(index, "price", e.target.value)
                  }
                  placeholder='Price'
                  className='border rounded p-2'
                />
              </div>
            ))}
            <button
              type='button'
              onClick={addPriceRange}
              className='bg-gray-300 text-black p-2 rounded col-span-2'
            >
              Add Price Range
            </button>

            {/* Dimensions */}
            <h4 className='col-span-2 text-lg font-semibold'>Dimensions</h4>
            <div className='col-span-2 grid grid-cols-4 gap-2'>
              {/* Height */}
              <div className='flex space-x-2'>
                <input
                  type='number'
                  value={dimensions.height.value}
                  onChange={(e) =>
                    handleDimensionChange(
                      "height",
                      e.target.value,
                      dimensions.height.unit
                    )
                  }
                  placeholder='Height'
                  className='border rounded p-2 w-full'
                />
                <select
                  value={dimensions.height.unit}
                  onChange={(e) =>
                    handleDimensionChange(
                      "height",
                      dimensions.height.value,
                      e.target.value
                    )
                  }
                  className='border rounded p-2 w-24'
                >
                  <option value='cm'>cm</option>
                  <option value='m'>m</option>
                </select>
              </div>

              {/* Width */}
              <div className='flex space-x-2'>
                <input
                  type='number'
                  value={dimensions.width.value}
                  onChange={(e) =>
                    handleDimensionChange(
                      "width",
                      e.target.value,
                      dimensions.width.unit
                    )
                  }
                  placeholder='Width'
                  className='border rounded p-2 w-full'
                />
                <select
                  value={dimensions.width.unit}
                  onChange={(e) =>
                    handleDimensionChange(
                      "width",
                      dimensions.width.value,
                      e.target.value
                    )
                  }
                  className='border rounded p-2 w-24'
                >
                  <option value='cm'>cm</option>
                  <option value='m'>m</option>
                </select>
              </div>

              {/* Length */}
              <div className='flex space-x-2'>
                <input
                  type='number'
                  value={dimensions.length.value}
                  onChange={(e) =>
                    handleDimensionChange(
                      "length",
                      e.target.value,
                      dimensions.length.unit
                    )
                  }
                  placeholder='Length'
                  className='border rounded p-2 w-full'
                />
                <select
                  value={dimensions.length.unit}
                  onChange={(e) =>
                    handleDimensionChange(
                      "length",
                      dimensions.length.value,
                      e.target.value
                    )
                  }
                  className='border rounded p-2 w-24'
                >
                  <option value='cm'>cm</option>
                  <option value='m'>m</option>
                </select>
              </div>

              {/* Weight */}
              <div className='flex space-x-2'>
                <input
                  type='number'
                  value={dimensions.weight.value}
                  onChange={(e) =>
                    handleDimensionChange(
                      "weight",
                      e.target.value,
                      dimensions.weight.unit
                    )
                  }
                  placeholder='Weight'
                  className='border rounded p-2 w-full'
                />
                <select
                  value={dimensions.weight.unit}
                  onChange={(e) =>
                    handleDimensionChange(
                      "weight",
                      dimensions.weight.value,
                      e.target.value
                    )
                  }
                  className='border rounded p-2 w-24'
                >
                  <option value='kg'>kg</option>
                  <option value='g'>g</option>
                </select>
              </div>
            </div>

            {/* Images */}
            <h4 className='col-span-2 text-lg font-semibold'>Product Images</h4>
            {images.map((image, index) => (
              <div key={index} className='col-span-2 grid grid-cols-2 gap-4'>
                <div>
                  <label>Main Image</label>
                  <input
                    type='file'
                    accept='image/*'
                    onChange={(e) =>
                      handleImageChange(index, "mainImage", e.target.files[0])
                    }
                    className='border rounded p-2 w-full'
                    required
                  />
                </div>
                <div>
                  <label>Thumbnail Image</label>
                  <input
                    type='file'
                    accept='image/*'
                    onChange={(e) =>
                      handleImageChange(index, "thumbnail", e.target.files[0])
                    }
                    className='border rounded p-2 w-full'
                    required
                  />
                </div>
              </div>
            ))}
            <button
              type='button'
              onClick={addImageFields}
              className='bg-gray-300 text-black p-2 rounded col-span-2'
            >
              Add More Images
            </button>

            {/* Submit Button */}
            <button
              type='submit'
              className='bg-blue-500 text-white p-2 rounded col-span-2'
            >
              Add Product
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
