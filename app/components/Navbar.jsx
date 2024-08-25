'use client'

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FaHome, FaEllipsisH, FaSearch, FaShoppingCart , FaShoppingBag, FaHeart } from 'react-icons/fa';

const Navbar = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

    const handleSearchSubmit = (e) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      router.push(`/products?search=${searchQuery.trim()}`);
    } else {

    }

  };

  return (
    <>
      <nav className="bg-white shadow-md text-black fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto lg:px-28 md:px-4 px-4">
          {/* Top line */}
          <div className="flex items-center justify-between py-4">
            {/* Search */}
            <div className="w-1/4">
              <form className="relative" onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md pr-10"
                />
                <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </form>
            </div>

            {/* Logo */}
            <div className="text-2xl font-bold absolute left-1/2 transform -translate-x-1/2">
              <Link href="/"><img src="/logo.png" alt="logo" className='w-20'/></Link>
            </div>

            {/* Cart icon */}
            <div>
              <Link href="/cart" className="hover:text-gray-600">
                <FaShoppingCart size={24} />
              </Link>
            </div>
          </div>

          {/* Bottom line - only visible on desktop */}
          <div className="hidden md:flex justify-center space-x-6 py-4">
            <Link href="/" className="hover:text-black text-gray-600">HOME</Link>
            <Link href="/products" className="hover:text-black text-gray-600">PRODUCTS</Link>
            <Link href="/wishlist" className="hover:text-black text-gray-600">WISHLIST</Link>
            <Link href="/about" className="hover:text-black text-gray-600">ABOUT</Link>
            <Link href="/contact" className="hover:text-black text-gray-600">CONTACT</Link>
          </div>
        </div>
      </nav>

      {/* Bottom navigation for mobile */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md z-50">
          <div className="flex justify-around py-2">
            <Link href="/" className="flex flex-col items-center text-black hover:text-gray-600">
              <FaHome size={24} />
              <span>Home</span>
            </Link>
            <Link href="/products" className="flex flex-col items-center text-black hover:text-gray-600">
              <FaShoppingBag size={24} />
              <span>Procuts</span>
            </Link>
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="flex flex-col items-center text-black hover:text-gray-600"
            >
              <Link href="/wishlist" className="flex flex-col items-center text-black hover:text-gray-600">
              <FaHeart size={24} />
              <span>Wishlist</span>
              </Link>
            </button>
          </div>
        </div>
      )}

      {/* Drawer */}
      

      {/* Spacer for mobile to prevent content from being hidden behind the bottom nav */}
      {isMobile && <div className="h-16"></div>}
      
      {/* Spacer to prevent content from being hidden behind the navbar on desktop */}
      {!isMobile && <div className="h-20"></div>}
    </>
  );
};

export default Navbar;
