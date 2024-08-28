'use client'

import React, { useState, useEffect } from 'react';
import ProductCard from '../../components/ProductCard';
import { FaTruck, FaMoneyBillWave, FaRedoAlt, FaMinus, FaPlus } from 'react-icons/fa';
import { doc, getDoc, collection, query, where, getDocs,} from 'firebase/firestore';
import { db as firestore, database } from '../../firebase';
import { useRouter } from 'next/navigation';
import { ref, get, set } from 'firebase/database'

const ProductPage = ({ params }) => {
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [mainImage, setMainImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [oldPrice, setCurrentPrice] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [offerPrice, setOfferPrice] = useState(null);

  // Utility functions for generating and retrieving device ID
  function getOrCreateDeviceId() {
    if (typeof window !== 'undefined') {
      let deviceId = localStorage.getItem('deviceId');
      if (!deviceId) {
        deviceId = generateUUID();
        localStorage.setItem('deviceId', deviceId);
      }
      return deviceId;
    }
    return null;
  }

  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  const uniqueDeviceId = getOrCreateDeviceId();

  // Fetch product data
  useEffect(() => {
    const fetchProductData = async () => {
      if (!params.slug) return;

      try {
        const productRef = doc(firestore, `site/tls/products/${params.slug}`);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          const productData = productSnap.data();
          productData.id = params.slug;  // Assigning the slug as the product ID
          
          // Process color variants
          const colorVariants = productData.colorVarients || [];
          const images = [];
          const colors = [];
          
          colorVariants.forEach(variant => {
            if (variant.label) {
              colors.push(variant.label);
            }
            if (variant.source && variant.source.length > 0) {
              const variantImages = variant.source.filter(src => src.url).map(src => src.url);
              images.push(...variantImages);
            }
          });

          productData.images = images;
          productData.colors = colors;

          // Set initial color and image
          if (colors.length > 0) {
            setSelectedColor(colors[0]);
          }
          setMainImage(images[0]);

          // Process size variants
          const sizeVariants = productData.varients || [];
          const sizes = sizeVariants.map(variant => variant.label);
          productData.sizes = sizes;

          // Set initial size and price
          if (sizes.length > 0) {
            setSelectedSize(sizes[0]);
            setCurrentPrice(sizeVariants[0].price);
          } else {
            setCurrentPrice(productData.price);
          }

          if (sizes.length > 0) {
            setSelectedSize(sizes[0]);
            setCurrentPrice(sizeVariants[0].price);
            setOfferPrice(sizeVariants[0].offerprice);
          } else {
            setCurrentPrice(productData.price);
            setOfferPrice(productData.offerprice);
          }

          setProduct(productData);
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






  const handleAddToBag = async () => {
    if (!uniqueDeviceId || !product) return;

    if (!product.id) {
      console.error("Product ID is undefined. Cannot add to cart.");
      return;
    }

    const cartRef = ref(database, `${uniqueDeviceId}/Mycarts`);
    const snapshot = await get(cartRef);

    let cartItems = snapshot.exists() ? snapshot.val() : [];

    const existingItemIndex = cartItems.findIndex(item => 
      item.id === product.id && item.size === selectedSize && item.color === selectedColor
    );

    if (existingItemIndex > -1) {
      cartItems[existingItemIndex].quantity += quantity;
    } else {
      cartItems.push({ 
        id: product.id, 
        quantity: quantity, 
        price: offerPrice,
        size: selectedSize,
        color: selectedColor
      });
    }

    try {
      await set(cartRef, cartItems);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  const handleBuynow = async () => {
    if (!uniqueDeviceId || !product) return;

    if (!product.id) {
      console.error("Product ID is undefined. Cannot add to cart.");
      return;
    }

    const cartRef = ref(database, `${uniqueDeviceId}/Mycarts`);
    const snapshot = await get(cartRef);

    let cartItems = snapshot.exists() ? snapshot.val() : [];

    const existingItemIndex = cartItems.findIndex(item => 
      item.id === product.id && item.size === selectedSize && item.color === selectedColor
    );

    if (existingItemIndex > -1) {
      cartItems[existingItemIndex].quantity += quantity;
    } else {
      cartItems.push({ 
        id: product.id, 
        quantity: quantity, 
        price: offerPrice,
        size: selectedSize,
        color: selectedColor
      });
    }

    try {
      await set(cartRef, cartItems);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
      router.push('/checkout');
    } catch (error) {
      console.error("Error :", error);
    }
  };


  const handleThumbnailClick = (clickedImage) => {
    if (!product) return;
    
    const currentMainImage = mainImage;
    const clickedImageIndex = product.images.indexOf(clickedImage);
    const updatedImages = [...product.images];

    // Swap the clicked image with the main image
    updatedImages[clickedImageIndex] = currentMainImage;
    setMainImage(clickedImage);
    product.images = updatedImages;
  };


  const handleColorChange = (color) => {
    setSelectedColor(color);
    const colorVariant = product.colorVarients.find(v => v.label === color);
    if (colorVariant && colorVariant.source && colorVariant.source.length > 0) {
      setMainImage(colorVariant.source[0].url);
    }
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
    const sizeVariant = product.varients.find(v => v.label === size);
    if (sizeVariant) {
      setCurrentPrice(sizeVariant.price);
      setOfferPrice(sizeVariant.offerprice);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    const qty = Math.max(1, Math.min(100, newQuantity));
    setQuantity(qty);
  };

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
                className="w-16 h-16 md:w-20 md:h-20 rounded object-cover cursor-pointer"
                onClick={() => setMainImage(image)}
              />
            ))}
          </div>
        )}

        {/* Center: Main Image */}
        <div className="order-1 md:order-2">
          <img 
            src={mainImage}
            alt="Main Product Image"
            className="w-full md:w-[600px] h-auto rounded-lg"
          />
        </div>

        {/* Right Side: Product Details */}
        <div className="w-full md:w-1/2 mt-4 md:mt-0 order-3">
        <h1 className="text-xl md:text-2xl font-semibold">{product.title}</h1>
        <p className="text-gray-500 mt-2">Inclusive of all Taxes</p>
        <div className="flex items-center space-x-2 mt-4">
          <span className="text-2xl md:text-3xl font-bold text-red-600">₹{offerPrice}</span>
          <span className="line-through text-gray-500">₹{oldPrice}</span>
        </div>

          <div className="mt-6">
            <label className="block text-gray-700">Quantity, Size & Color</label>
            <div className="flex gap-4 mt-2">
              <div className="flex items-center border rounded w-1/3">
                <button 
                  className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-l"
                  onClick={() => handleQuantityChange(quantity - 1)}
                >
                  <FaMinus />
                </button>
                <input 
                  type="number"
                  className="w-full text-center border-none focus:outline-none"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                  min="1"
                  max="100"
                />
                <button 
                  className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-r"
                  onClick={() => handleQuantityChange(quantity + 1)}
                >
                  <FaPlus />
                </button>
              </div>
              <select 
                className="border p-2 w-1/3"
                value={selectedSize}
                onChange={(e) => handleSizeChange(e.target.value)}
              >
                {product.sizes.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
              {product.colors.length > 1 && (
                <select 
                  className="border p-2 w-1/3"
                  value={selectedColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                >
                  {product.colors.map((color) => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="flex space-x-4 mt-6">
            <button 
              className="border-2 border-black px-4 py-2 rounded" 
              onClick={handleAddToBag}
            >
              ADD TO BAG
            </button>
            <button className="bg-black text-white px-4 py-2 rounded" onClick={handleBuynow}>BUY NOW</button>
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

      {showPopup && (
        <div className="fixed top-4 right-4 bg-gray-100 text-black p-4 rounded-lg shadow-lg z-50 animate-slide-in lg:w-1/5 w-2/3">
          <h2 className="text-green-500 mb-2">Successfully Added to Bag</h2>
          <p>{product.title}</p>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
