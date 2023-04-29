/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';

const ProductItem = ({ product, addToCartHandler }) => {
    return (
        <div className="card hover:scale-105 ease-in duration-[.3s]">
            <Link href={`/product/${product.slug}`}>
                <a>
                    <img
                        src={product.image}
                        alt={product.name}
                        className="rounded shadow object-contain h-64 w-full bg-[#f6f6f6]"
                    />
                </a>
            </Link>
            <div className="flex flex-col items-center justify-center p-5">
                <Link href={`/product/${product.slug}`}>
                    <a>
                        <h2 className="text-lg font-bold">{product.name}</h2>
                    </a>
                </Link>
                <p className="mb-2 font-semibold">{product.brand}</p>
                <p className="mb-2">${product.price}</p>
                <button type="button" className="primary-button" onClick={() => addToCartHandler(product)}>
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default ProductItem;
