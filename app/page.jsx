'use client'

import React, { useState, useEffect, Suspense } from "react";
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
import { collection, getDocs, query, limit  } from 'firebase/firestore';

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
  const productCarouselPlugin = React.useRef(
    Autoplay({ delay: 1500, stopOnInteraction: false })
  );

  const feedbackCarouselPlugin = React.useRef(
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
      <div className="sec-height banner-1 w-full bg-black text-white mb-8 overflow-hidden">
  <img src="/banner1.png" alt="banner" className="banner-image" />
</div>

      <div className="px-4 md:px-8 flex justify-start md:justify-center overflow-x-auto whitespace-nowrap gap-4 md:gap-8 relative m-8 scrollbar-hide">
        {category_images.slice(0, 4).map((src, index) => (
          <CircleImageLabel 
            key={index}
            src={src} 
            alt={`Category ${index + 1}`} 
            label={`CATEGORY ${index + 1}`} 
          />
        ))}
      </div>

      <div className="mb-8">
        <video className="w-full" controls preload="none">
          <source src="/path/to/video.mp4" type="video/mp4" />
          <track src="/path/to/captions.vtt" kind="subtitles" srcLang="en" label="English" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Browse Our Collection</h2>
        <div className="w-full md:w-2/3 mx-auto">
          {renderCarousel(category_images, productCarouselPlugin)}
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Latest Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.slice(0, 8).map((product, index) => (
            <ProductCard key={product.id}
          id={product.id}
          image={product.images && product.images.length > 0 ? product.images[0] : ''}
          name={product.title || ''}
          price={product.varients && product.varients.length > 0 ? (product.varients[0].offerprice || product.varients[0].price) : ''}
          originalPrice={product.varients && product.varients.length > 0 ? product.varients[0].price : ''}
          discountPercentage={
            product.varients && product.varients.length > 0 && product.varients[0].offerprice
              ? Math.round(((product.varients[0].price - product.varients[0].offerprice) / product.varients[0].price) * 100)
              : 0
          }/>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">All Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.slice(0, 8).map((product, index) => (
            <ProductCard key={product.id}
          id={product.id}
          image={product.images && product.images.length > 0 ? product.images[0] : ''}
          name={product.title || ''}
          price={product.varients && product.varients.length > 0 ? (product.varients[0].offerprice || product.varients[0].price) : ''}
          originalPrice={product.varients && product.varients.length > 0 ? product.varients[0].price : ''}
          discountPercentage={
            product.varients && product.varients.length > 0 && product.varients[0].offerprice
              ? Math.round(((product.varients[0].price - product.varients[0].offerprice) / product.varients[0].price) * 100)
              : 0
          }/>
          ))}
        </div>
      </div>

      <div className="sec-height banner-1 w-full bg-black text-white mb-8 overflow-hidden">
  <img src="/banner1.png" alt="banner" className="banner-image" />
</div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Customer Feedback</h2>
        <div className="w-full md:w-2/3 mx-auto">
          {renderCarousel(review_images, feedbackCarouselPlugin)}
        </div>
      </div>

      <div className="space-y-12 flex flex-col">
        <SideSection
          title="Vision"
          description="Our vision is to be the ultimate one-stop solution for all your home needs, providing a seamless and comprehensive experience that caters to every aspect of your living space. From the moment you step into your new home, to the day-to-day essentials that keep it running smoothly, we are committed to offering a wide range of products and services that meet the highest standards of quality and convenience."
          imageSrc="/vision.png"
          reverse={false}
        />
        <SideSection
          title="Strength"
          description="Our strengths lie in our unwavering commitment to quality, innovation, and customer satisfaction, making us a trusted leader in the home solutions industry. We pride ourselves on offering an extensive range of products and services that cater to diverse tastes, needs, and budgets, ensuring that every customer finds exactly what they’re looking for."
          imageSrc="/strength.png"
          reverse={true}
        />
      </div>
      <div className="my-20">
        <h2 className="text-2xl font-bold mb-6 text-center">Best Sellers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.slice(0, 8).map((product, index) => (
            <ProductCard key={product.id}
          id={product.id}
          image={product.images && product.images.length > 0 ? product.images[0] : ''}
          name={product.title || ''}
          price={product.varients && product.varients.length > 0 ? (product.varients[0].offerprice || product.varients[0].price) : ''}
          originalPrice={product.varients && product.varients.length > 0 ? product.varients[0].price : ''}
          discountPercentage={
            product.varients && product.varients.length > 0 && product.varients[0].offerprice
              ? Math.round(((product.varients[0].price - product.varients[0].offerprice) / product.varients[0].price) * 100)
              : 0
          }/>
          ))}
        </div>
      </div>
    </div>
  );
}
