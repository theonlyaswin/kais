'use client'

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FaHome, FaEllipsisH, FaSearch, FaShoppingCart, FaShoppingBag, FaHeart, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
      router.push(`/search/${searchQuery.trim()}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <>
      <nav className="bg-white shadow-md text-black fixed top-0 left-0 right-0 z-50 py-3">
        <div className="container mx-auto lg:px-28 md:px-4 px-4">
          {/* Top line */}
          <div className="flex items-center justify-between py-4">
            {/* Search Icon */}
            <div className="w-1/4 flex items-center">
              <button onClick={() => setIsSearchOpen(true)} className="md:hidden hover:text-gray-600">
                <FaSearch size={18} />
              </button>
              {!isMobile && (
                <form onSubmit={handleSearchSubmit} className="relative w-full max-w-sm">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md pr-10"
                  />
                  <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <FaSearch className="text-gray-400" />
                  </button>
                </form>
              )}
            </div>

            {/* Logo */}
            <div className="text-2xl font-bold absolute left-1/2 transform -translate-x-1/2">
              <Link href="/"><img src="/logo.png" alt="logo" className='w-20'/></Link>
            </div>

            {/* Cart icon */}
            <div>
              <Link href="/cart" className="hover:text-gray-600">
                <FaShoppingCart size={18} />
              </Link>
            </div>
          </div>

          {/* Bottom line - only visible on desktop */}
          <div className="hidden md:flex justify-center space-x-6 py-4">
            <Link href="/" className="hover:text-black text-gray-600">HOME</Link>
            <Link href="/products" className="hover:text-black text-gray-600">PRODUCTS</Link>
            <Link href="/wishlist" className="hover:text-black text-gray-600">WISHLIST</Link>
            <Link href="/orders" className="hover:text-black text-gray-600">ORDERS</Link>
            <Link href="/about" className="hover:text-black text-gray-600">ABOUT</Link>
            <Link href="/contact" className="hover:text-black text-gray-600">CONTACT</Link>
          </div>
        </div>
      </nav>

      {/* Bottom navigation for mobile */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-black shadow-md z-50">
          <div className="flex justify-around py-2">
            <Link href="/" className="flex flex-col items-center text-black hover:text-gray-600">
              <FaHome size={18} />
              <span>Home</span>
            </Link>
            <Link href="/products" className="flex flex-col items-center text-black hover:text-gray-600">
              <FaShoppingBag size={18} />
              <span>Products</span>
            </Link>
            <Link href="/wishlist" className="flex flex-col items-center text-black hover:text-gray-600">
              <FaHeart size={18} />
              <span>Wishlist</span>
            </Link>
          </div>
        </div>
      )}

      {/* Search Popup for Mobile */}
      {isSearchOpen && isMobile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg w-full max-w-md mx-3 top-0">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Search</h2>
              <button onClick={() => setIsSearchOpen(false)} className="text-gray-500 hover:text-gray-700">
                <FaTimes size={24} />
              </button>
            </div>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border rounded-md pr-10"
              />
              <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <FaSearch className="text-gray-400" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Spacer for mobile to prevent content from being hidden behind the bottom nav */}
      {isMobile && <div className="h-16"></div>}
      
      {/* Spacer to prevent content from being hidden behind the navbar on desktop */}
      {!isMobile && <div className="h-20"></div>}
    </>
  );
};

export default Navbar;
