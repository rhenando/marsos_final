// lib/firebaseProductService.js
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase"; // Import Firestore

const productCollection = collection(db, "products");

// Fetch all products
export const fetchProducts = async () => {
  const productSnapshot = await getDocs(productCollection);
  return productSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
};

// Add new product
export const addProduct = async (product) => {
  await addDoc(productCollection, product);
};

// Update product by ID
export const updateProduct = async (id, updatedProduct) => {
  const productDoc = doc(db, "products", id);
  await updateDoc(productDoc, updatedProduct);
};

// Delete product by ID
export const deleteProduct = async (id) => {
  const productDoc = doc(db, "products", id);
  await deleteDoc(productDoc);
};
