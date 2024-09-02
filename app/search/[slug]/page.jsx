'use client'

import React, { useState, useEffect } from 'react';
import ProductCard from '../../components/ProductCard';
import { db as firestore } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';

const SearchedProducts = ({ params }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSearchedProducts = async () => {
            setLoading(true);
            try {
                const productsRef = collection(firestore, 'site/tls/products');
                const querySnapshot = await getDocs(productsRef);
                const searchTerm = params.slug.toLowerCase();

                // Filter products by title, categories, and keywords
                const searchedProducts = querySnapshot.docs
                    .map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }))
                    .filter((product) => {
                        const titleMatch = product.title && product.title.toLowerCase().includes(searchTerm);
                        const categoryMatch = Array.isArray(product.categories) 
                            && product.categories.some(category => category.toLowerCase().includes(searchTerm));
                        const keywordsMatch = Array.isArray(product.keywords) 
                            && product.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm));

                        return titleMatch || categoryMatch || keywordsMatch;
                    });

                console.log('Search term:', searchTerm);
                console.log('Fetched Searched Products:', searchedProducts);

                setProducts(searchedProducts);
            } catch (error) {
                console.error('Error fetching searched products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSearchedProducts();
    }, [params.slug]);

    return (
        <div className="flex-grow container mx-auto px-4 py-8 mt-16">
            <h1 className="text-3xl font-bold mb-3 text-center">Search Results</h1>

            {loading ? (
                <p className="text-center mt-4">Loading...</p>
            ) : products.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            id={product.id}
                            image={product.images && product.images.length > 0 ? product.images[0] : ''}
                            name={product.title || ''}
                            price={product.price || ''}
                            originalPrice={product.originalPrice || ''}
                            discountPercentage={
                                product.price && product.originalPrice
                                    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                                    : 0
                            }
                        />
                    ))}
                </div>
            ) : (
                <div className='flex justify-center items-center flex-col'>
                <h3 className="text-center text-gray-500 mt-8">No products found matching your search.</h3>
                <img src="/nosearch.gif" alt="Not Found" className='w-64'/>
                </div>
            )}
        </div>
    );
};

export default SearchedProducts;
