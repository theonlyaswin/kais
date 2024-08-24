'use client'

import React, { useState, useEffect } from 'react';
import ProductCard from '../../components/ProductCard';
import { FaTruck, FaMoneyBillWave, FaRedoAlt } from 'react-icons/fa';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db as firestore } from '../../firebase';

const ProductPage = ({ params }) => {
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchProductData = async () => {
      if (!params.slug) return;

      try {
        const productRef = doc(firestore, `site/tls/products/${params.slug}`);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          setProduct(productSnap.data());
        } else {
          console.error('No such document!');
        }
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    fetchProductData();
  }, [params.slug]);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!params.slug) return;

      try {
        const relatedProductsQuery = query(
          collection(firestore, 'site/tls/products/'),
          where('categories', '==', product?.categories) 
        );

        const querySnapshot = await getDocs(relatedProductsQuery);
        const products = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setRelatedProducts(products);
      } catch (error) {
        console.error('Error fetching related products:', error);
      }
    };

    if (product) {
      fetchRelatedProducts();
    }
  }, [params.slug, product]);

  if (!product) return <p>Loading...</p>;

  return (
    <div className="container mx-auto px-4 my-20">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Side: Image Thumbnails */}
        {product.images.length > 1 && (
          <div className="flex md:flex-col gap-4 order-2 md:order-1">
            {product.images.map((image, index) => (
              <img 
                key={index}
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-16 h-16 md:w-20 md:h-20 rounded object-cover"
              />
            ))}
          </div>
        )}

        {/* Center: Main Image */}
        <div className="order-1 md:order-2">
          <img 
            src={product.images[0]} // Display the first image as main image
            alt="Main Product Image"
            className="w-full md:w-[600px] h-auto rounded-lg"
          />
        </div>

        {/* Right Side: Product Details */}
        <div className="w-full md:w-1/2 mt-4 md:mt-0 order-3">
          <h1 className="text-xl md:text-2xl font-semibold">{product.title}</h1>
          <p className="text-gray-500 mt-2">Inclusive of all Taxes</p>
          <div className="flex items-center space-x-2 mt-4">
            <span className="text-2xl md:text-3xl font-bold text-red-600">₹{product.price}</span>
            <span className="line-through text-gray-500">₹{product.originalPrice}</span>
            <span className="text-green-600">{product.discountPercentage}% OFF</span>
          </div>

          <div className="mt-6">
            <label className="block text-gray-700">Quantity & Size</label>
            <div className="flex gap-4 mt-2">
              <select className="border p-2 w-1/3">
                <option>1</option>
                <option>2</option>
                <option>3</option>
              </select>
              <select className="border p-2 w-1/3">
                <option>Onesize</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-4 mt-6">
            <button className="border-2 border-black px-4 py-2 rounded">ADD TO BAG</button>
            <button className="bg-black text-white px-4 py-2 rounded">BUY NOW</button>
          </div>

          <div className="space-y-2 mt-6 border-2 p-4 md:p-8">
            <p className="text-gray-700 flex items-center"><FaTruck className="mr-2" /> Get it delivered in 4-9 days</p>
            <p className="text-gray-700 flex items-center"><FaMoneyBillWave className="mr-2" /> Cash on Delivery</p>
            <p className="text-gray-700 flex items-center"><FaRedoAlt className="mr-2" /> Exchange Only within 3 days</p>
          </div>

          <div className="mt-6 border-2 p-4 md:p-8">
            <h2 className="text-lg md:text-xl font-semibold">Product Description</h2>
            <p className="text-gray-700 mt-2">
              {product.description || 'Elevate your style with the exclusive and stunning designs from Binni\'s Wardrobe. Each product is crafted with the finest materials...'}
            </p>
          </div>
        </div>
      </div>

      <section className='w-full my-16'>
        <h1 className='text-xl md:text-2xl font-bold mb-6 text-center'>Related Products</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map(relatedProduct => (
            <ProductCard
              key={relatedProduct.id}
              image={relatedProduct.images[0]} // Assuming the related product has at least one image
              name={relatedProduct.title}
              price={relatedProduct.price}
              originalPrice={relatedProduct.originalPrice}
              discountPercentage={relatedProduct.discountPercentage}
              id={relatedProduct.id}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductPage;
