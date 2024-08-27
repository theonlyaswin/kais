'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FaShoppingBag, FaGift, FaRing, FaBaby, FaPaintBrush, FaFemale } from 'react-icons/fa';
import { GiEarrings, GiRing, GiTempleGate, GiFootprint, GiElephant, GiNecklace, GiBigDiamondRing, GiLipstick, GiCookingPot } from 'react-icons/gi';
import { MdChildCare, MdHome, MdSchool, MdKitchen } from 'react-icons/md';
import { BsFillBagFill, BsWater } from 'react-icons/bs';
import { AiFillCar } from 'react-icons/ai';
import ProductCard from '../components/ProductCard';
import { db } from '../firebase'; 
import { collection, query, getDocs, limit, startAfter, where, orderBy } from 'firebase/firestore';

const categories = [
  { name: 'pouches', icon: <FaShoppingBag /> },
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
  { name: 'bangles', icon: <FaRing /> },
  { name: 'Kitchen Appliances', icon: <MdKitchen /> },
  { name: 'Makeup Items', icon: <GiLipstick /> },
  { name: 'Bridal Collection', icon: <FaFemale /> },
  { name: 'Fancy Items', icon: <GiBigDiamondRing /> },
  { name: 'Necklaces', icon: <GiNecklace /> },
  { name: 'Baby Products', icon: <FaBaby /> },
  { name: 'Cookware', icon: <GiCookingPot /> },
  { name: 'Art Supplies', icon: <FaPaintBrush /> },
];

const InfiniteScrollProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const observer = useRef();
  const pageRef = useRef(null);

  const lastProductElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            fetchProducts();
          }
        },
        { threshold: 0.99 }
      );
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const fetchProducts = useCallback(
    async (isInitialLoad = false) => {
      if (loading || (!isInitialLoad && !hasMore)) return;

      setLoading(true);
      try {
        let productsRef = collection(db, 'site/tls/products');
        let q = query(productsRef, orderBy('title'), limit(8));

        if (selectedCategory !== 'All') {
          console.log(`Fetching products for category: ${selectedCategory}`);
          q = query(productsRef, where("categories", "==", selectedCategory));
        } else {
          console.log(`Fetching all products`);
        }

        if (lastVisible && !isInitialLoad) {
          q = query(q, startAfter(lastVisible));
        }

        const querySnapshot = await getDocs(q);
        const newProducts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProducts((prevProducts) => (isInitialLoad ? newProducts : [...prevProducts, ...newProducts]));
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setHasMore(querySnapshot.docs.length === 8);

        console.log('Fetched Products:', newProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    },
    [selectedCategory, lastVisible, loading, hasMore]
  );

  useEffect(() => {
    setProducts([]);
    setLastVisible(null);
    setHasMore(true);
    fetchProducts(true);
  }, [selectedCategory]);

  return (
    <div className="flex-grow container mx-auto px-4 py-8 mt-12" ref={pageRef}>
      <h1 className="text-2xl lg:text-3xl font-bold mb-6 text-center">All Products</h1>

      {/* Category Filter */}
      <div className="mb-8 flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-4 py-2 rounded ${selectedCategory === 'All' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          All
        </button>
        {categories.map((category) => (
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
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <div
            key={product.id}
            ref={index === products.length - 1 ? lastProductElementRef : null}
          >
            <ProductCard
              id={product.id}
              image={product.images && product.images.length > 0 ? product.images[0] : ''}
              name={product.title || ''}
              price={product.varients && product.varients.length > 0 ? (product.varients[0].offerprice || product.varients[0].price) : ''}
              originalPrice={product.varients && product.varients.length > 0 ? product.varients[0].price : ''}
              discountPercentage={
                product.varients && product.varients.length > 0 && product.varients[0].offerprice
                  ? Math.round(((product.varients[0].price - product.varients[0].offerprice) / product.varients[0].price) * 100)
                  : 0
              }
            />
          </div>
        ))}
      </div>

      {loading && <p className="text-center mt-4 mb-8">Loading...</p>}
      {!loading && products.length === 0 && (
        <p className="text-center text-gray-500 mt-8 mb-8">No products found in this category.</p>
      )}
      {!loading && !hasMore && products.length > 0 && (
        <p className="text-center text-gray-500 mt-8 mb-8">No more products to load.</p>
      )}
    </div>
  );
};

export default InfiniteScrollProductsPage;
