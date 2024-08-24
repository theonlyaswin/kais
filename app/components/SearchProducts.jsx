'use client'

import React from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from './ProductCard';

const SearchProducts = ({ products }) => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search')?.toLowerCase();

  const filteredProducts = products.filter(product => {
    if (searchQuery) {
      return (
        product.title?.toLowerCase().includes(searchQuery) ||
        (product.categories && (
          (typeof product.categories === 'string' && product.categories.toLowerCase().includes(searchQuery)) ||
          (Array.isArray(product.categories) && product.categories.some(cat => cat.toLowerCase().includes(searchQuery)))
        ))
      );
    }
    return true;
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {filteredProducts.map(product => (
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
  );
};

export default SearchProducts;