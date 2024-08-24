'use client'

import React, { useState, useEffect, Suspense } from 'react';
import { FaShoppingBag, FaGift, FaRing, FaBaby, FaPaintBrush, FaFemale } from 'react-icons/fa';
import { GiEarrings, GiRing, GiTempleGate, GiFootprint, GiElephant, GiNecklace, GiBigDiamondRing, GiLipstick, GiCookingPot } from 'react-icons/gi';
import { MdChildCare, MdHome, MdSchool, MdKitchen } from 'react-icons/md';
import { BsFillBagFill, BsWater } from 'react-icons/bs';
import { AiFillCar } from 'react-icons/ai';
import { db } from '../firebase'; 
import { collection, getDocs } from 'firebase/firestore';
import SearchProducts from '../components/SearchProducts';

const categories = [
  { name: 'Pouches', icon: <FaShoppingBag /> },
  { name: 'Earrings', icon: <GiEarrings /> },
  { name: 'Kids Items', icon: <MdChildCare /> },
  { name: 'Rings', icon: <GiRing /> },
  { name: 'Temple Design Ornaments', icon: <GiTempleGate /> },
  { name: 'Footwear', icon: <GiFootprint /> },
  { name: 'Fabric Toys', icon: <GiElephant /> },
  { name: 'Home Appliances', icon: <MdHome /> },
  { name: 'Water Bottles', icon: <BsWater /> },
  { name: 'School Items', icon: <MdSchool /> },
  { name: 'Bags', icon: <BsFillBagFill /> },
  { name: 'Car Accessories', icon: <AiFillCar /> },
  { name: 'Gift Items', icon: <FaGift /> },
  { name: 'Bangles', icon: <FaRing /> },
  { name: 'Kitchen Appliances', icon: <MdKitchen /> },
  { name: 'Makeup Items', icon: <GiLipstick /> },
  { name: 'Bridal Collection', icon: <FaFemale /> },
  { name: 'Fancy Items', icon: <GiBigDiamondRing /> },
  { name: 'Necklaces', icon: <GiNecklace /> },
  { name: 'Baby Products', icon: <FaBaby /> },
  { name: 'Cookware', icon: <GiCookingPot /> },
  { name: 'Art Supplies', icon: <FaPaintBrush /> },
];

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [visibleProducts, setVisibleProducts] = useState(12);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsRef = collection(db, 'site/tls/products');
        const querySnapshot = await getDocs(productsRef);
        const productData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productData);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const loadMoreProducts = () => {
    setVisibleProducts(prevVisible => prevVisible + 12);
  };

  const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
      loadMoreProducts();
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(product => 
        product.categories && 
        (typeof product.categories === 'string' 
          ? product.categories.toLowerCase() === selectedCategory.toLowerCase()
          : Array.isArray(product.categories) && 
            product.categories.some(cat => cat.toLowerCase() === selectedCategory.toLowerCase())
        )
      );

  return (
    <div className="container mx-auto px-4 py-8 banner-1">
      <h1 className="text-3xl font-bold mb-6 text-center">All Products</h1>

      {/* Category Filter */}
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-4 py-2 rounded ${selectedCategory === 'All' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          All
        </button>
        {categories.map(category => (
          <button
            key={category.name}
            onClick={() => setSelectedCategory(category.name)}
            className={`px-4 py-2 rounded flex items-center ${selectedCategory === category.name ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {category.icon}
            <span className="ml-2">{category.name}</span>
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <Suspense fallback={<div>Loading...</div>}>
        <SearchProducts products={filteredProducts.slice(0, visibleProducts)} />
      </Suspense>
      
      {filteredProducts.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No products found in this category.</p>
      )}

      
    </div>
  );
};

export default ProductsPage;