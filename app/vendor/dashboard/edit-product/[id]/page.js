"use client";

import { useEffect, useState } from "react";
import { fetchProducts, updateProduct } from "@/lib/firebaseProductService";
import { useRouter } from "next/navigation";

export default function EditProduct({ params }) {
  const { id } = params;
  const router = useRouter();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      const products = await fetchProducts();
      const product = products.find((p) => p.id === id);
      setProduct(product);
    };
    loadProduct();
  }, [id]);

  const handleEditProduct = async () => {
    try {
      await updateProduct(id, product);
      router.push("/vendor/dashboard");
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div>
      <h1>Edit Product</h1>
      <input
        type='text'
        placeholder='Product Name'
        value={product.name}
        onChange={(e) => setProduct({ ...product, name: e.target.value })}
      />
      <input
        type='number'
        placeholder='Price'
        value={product.price}
        onChange={(e) => setProduct({ ...product, price: e.target.value })}
      />
      <textarea
        placeholder='Description'
        value={product.description}
        onChange={(e) =>
          setProduct({ ...product, description: e.target.value })
        }
      />
      <input
        type='text'
        placeholder='Image URL'
        value={product.imageUrl}
        onChange={(e) => setProduct({ ...product, imageUrl: e.target.value })}
      />
      <input
        type='number'
        placeholder='Stock'
        value={product.stock}
        onChange={(e) => setProduct({ ...product, stock: e.target.value })}
      />
      <button onClick={handleEditProduct}>Save Changes</button>
    </div>
  );
}
