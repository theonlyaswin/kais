'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import ProductCard from '../components/ProductCard';
import { db } from '../firebase';
import { collection, query, getDocs, limit, startAfter, where, orderBy } from 'firebase/firestore';

const InfiniteScrollProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [categories, setCategories] = useState([]);
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

  const fetchCategories = async () => {
    try {
      const categoriesRef = collection(db, 'site/tls/categories');
      const categorySnapshot = await getDocs(categoriesRef);
      const categoryList = categorySnapshot.docs.map(doc => doc.data().category);
      setCategories(categoryList);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

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
    fetchCategories();
  }, []);

  useEffect(() => {
    setProducts([]);
    setLastVisible(null);
    setHasMore(true);
    fetchProducts(true);
  }, [selectedCategory]);

  return (
    <div className="flex-grow container mx-auto px-4 py-8 mt-12" ref={pageRef}>
      <h1 className="text-2xl lg:text-3xl font-bold mb-6 text-center">All Products</h1>

      {/* Category Dropdown */}
      <div className="mb-8 flex flex-col sm:flex-row justify-center items-center gap-2">
        <h2 className='text-lg sm:text-2xl'>Category:</h2>
        <select
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-2 py-2 rounded bg-gray-200 text-center sm:text-left w-full sm:w-auto"
          value={selectedCategory}
        >
          <option value="All">All</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
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
