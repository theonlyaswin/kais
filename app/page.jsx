'use client'

import React, { useState, useEffect, useRef } from "react";
import "./globals.css";
import CircleImageLabel from './components/CircleImageLabel';
import Autoplay from "embla-carousel-autoplay";
import ProductCard from './components/ProductCard';
import SideSection from './components/SideSection'; 

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { db } from './firebase'; 
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { motion } from 'framer-motion';

const category_images = [
  '/collection1.png',
  '/collection2.png',
  '/collection3.png',
  '/collection4.png',
];

const review_images = [
  "/review1.png",
  "/review2.png",
  "/review3.png",
  "/review4.png",
  "/review5.png",
  "/review6.png",
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const productCarouselPlugin = useRef(
    Autoplay({ delay: 1500, stopOnInteraction: false })
  );

  const feedbackCarouselPlugin = useRef(
    Autoplay({ delay: 1500, stopOnInteraction: false })
  );

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsRef = collection(db, 'site/tls/products');
        const productsQuery = query(productsRef, limit(8));
        const querySnapshot = await getDocs(productsQuery);
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

  const renderCarousel = (images, plugin) => (
    <Carousel className="w-full" plugins={[plugin.current]}>
      <CarouselContent className="-ml-1">
        {images.map((src, index) => (
          <CarouselItem key={index} className="pl-1 basis-full sm:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <Card className="h-48 sm:h-64 md:h-80">
                <CardContent className="flex items-center justify-center p-0 h-full">
                  <img src={src} alt={`Image ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex" />
      <CarouselNext className="hidden sm:flex" />
    </Carousel>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        className="sec-height banner-1 w-full bg-black text-white mb-8 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <img src="/banner1.png" alt="banner" className="banner-image" />
      </motion.div>

      <motion.div
        className="px-4 md:px-8 flex justify-start md:justify-center overflow-x-auto whitespace-nowrap gap-4 md:gap-8 relative m-8 scrollbar-hide"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {category_images.slice(0, 4).map((src, index) => (
          <CircleImageLabel 
            key={index}
            src={src} 
            alt={`Category ${index + 1}`} 
            label={`CATEGORY ${index + 1}`} 
          />
        ))}
      </motion.div>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <video className="w-full" controls preload="none">
          <source src="/path/to/video.mp4" type="video/mp4" />
          <track src="/path/to/captions.vtt" kind="subtitles" srcLang="en" label="English" />
          Your browser does not support the video tag.
        </video>
      </motion.div>

      <motion.div
        className="mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Browse Our Collection</h2>
        <div className="w-full md:w-2/3 mx-auto">
          {renderCarousel(category_images, productCarouselPlugin)}
        </div>
      </motion.div>

      <motion.div
        className="mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Latest Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.slice(0, 8).map((product) => (
            <ProductCard
              key={product.id}
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
          ))}
        </div>
      </motion.div>

      <motion.div
        className="mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">All Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.slice(0, 8).map((product) => (
            <ProductCard
              key={product.id}
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
          ))}
        </div>
      </motion.div>

      <motion.div
        className="sec-height banner-1 w-full bg-black text-white mb-8 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <img src="/banner1.png" alt="banner" className="banner-image" />
      </motion.div>

      <motion.div
        className="mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Customer Feedback</h2>
        <div className="w-full md:w-2/3 mx-auto">
          {renderCarousel(review_images, feedbackCarouselPlugin)}
        </div>
      </motion.div>

      <motion.div
        className="space-y-12 flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4">Product of the Week</h2>
          <SideSection />
        </div>
      </motion.div>
    </div>
  );
}
