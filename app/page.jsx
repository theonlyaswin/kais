'use client'

import React, { useState, useEffect, useRef } from "react";
import "./globals.css";
import CircleImageLabel from './components/CircleImageLabel';
import Autoplay from "embla-carousel-autoplay";
import ProductCard from './components/ProductCard';
import ReviewCard from "./components/ReviewCard";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { db } from './firebase'; 
import { collection, getDocs, query, limit, doc, getDoc } from 'firebase/firestore';

const truncateReview = (text, wordCount = 10) => {
  const words = text.split(' ');
  if (words.length > wordCount) {
    return words.slice(0, wordCount).join(' ') + '...more';
  }
  return text;
};

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [bannerImages, setBannerImages] = useState([]);
  const [videoUrls, setVideoUrls] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  
  const productCarouselPlugin = useRef(
    Autoplay({ delay: 1500, stopOnInteraction: false })
  );

  const feedbackCarouselPlugin = useRef(
    Autoplay({ delay: 1500, stopOnInteraction: false })
  );

  const bannerCarouselPlugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const productsRef = collection(db, 'site/tls/products');
        const productsQuery = query(productsRef, limit(8));
        const productsSnapshot = await getDocs(productsQuery);
        const productData = productsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productData);

        // Fetch categories
        const categoriesRef = collection(db, 'site/tls/categories');
        const categoriesSnapshot = await getDocs(categoriesRef);
        const categoryData = categoriesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(categoryData);

        // Fetch reviews
        const reviewsRef = collection(db, 'site/tls/reviews');
        const reviewsSnapshot = await getDocs(reviewsRef);
        const reviewData = reviewsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReviews(reviewData);

        // Fetch banner images
        const bannerRef = collection(db, 'site/tls/headerslides');
        const bannerSnapshot = await getDocs(bannerRef);
        const bannerData = bannerSnapshot.docs.map(doc => doc.data().image);
        setBannerImages(bannerData);

        // Fetch video URL
        const videoRef = collection(db, 'site/tls/video');
        const videoSnapshot = await getDocs(videoRef);
        const videoData = videoSnapshot.docs.map(doc => doc.data().url);
        setVideoUrls(videoData);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

    const handleVideoEnd = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videoUrls.length);
  };

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
      <div className="sec-height banner-1 w-full mb-8 overflow-hidden">
        <Carousel className="w-full h-full" plugins={[bannerCarouselPlugin.current]}>
          <CarouselContent>
            {bannerImages.map((src, index) => (
              <CarouselItem key={index}>
                <div className="w-full h-full">
                  <img src={src} alt={`Banner ${index + 1}`} className="w-full h-full object-cover" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </div>

      <div className="flex justify-start md:justify-center overflow-x-auto whitespace-nowrap gap-3 md:gap-3 relative m-8 scrollbar-hide">
        {categories.slice(0, 4).map((category) => (
          <CircleImageLabel 
            key={category.id}
            src={category.image} 
            alt={`Category ${category.caption}`} 
            label={category.caption} 
          />
        ))}
      </div>

      <div className="mb-8">
        {videoUrls.length > 0 ? (
          <video 
            className="w-full autoPlay loop muted controls preload='none'" 
            controls 
            preload="metadata"
            playsInline
            onEnded={handleVideoEnd}
          >
            <source src={videoUrls[currentVideoIndex]} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <p>No videos available.</p>
        )}
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Browse Our Collection</h2>
        <div className="w-full md:w-2/3 mx-auto">
          {renderCarousel(categories.map(category => category.image), productCarouselPlugin)}
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Latest Products</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">All Products</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
      </div>

      <div className="sec-height banner-1 w-full mb-8 overflow-hidden">
        <Carousel className="w-full h-full" plugins={[bannerCarouselPlugin.current]}>
          <CarouselContent>
            {bannerImages.map((src, index) => (
              <CarouselItem key={index}>
                <div className="w-full h-full">
                  <img src={src} alt={`Banner ${index + 1}`} className="w-full h-full object-cover" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Customer Feedback</h2>
        <div className="w-full md:w-2/3 mx-auto">
          <Carousel className="w-full" plugins={[feedbackCarouselPlugin.current]}>
            <CarouselContent className="-ml-1">
              {reviews.map((review, index) => (
                <CarouselItem key={index} className="pl-1 basis-full sm:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <ReviewCard
                      image={review.image}
                      name={review.name}
                      rating={review.rating}
                      date={review.date}
                      review={truncateReview(review.review)}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </div>
      </div>
    </div>
  );
}