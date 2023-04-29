/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import Link from 'next/link';
import React from 'react';

const HeroBanner = ({ heroBanner: { name, image, description, text1, text2, button, slug } }) => {
    return (
        <div className="mb-10 relative grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
            <img src={image} alt={name} className="col-span-1 md:col-span-3 lg:col-span-4 " />
            <div className="absolute t-0 l-0  w-[80%] p-2 col-span-1 text-sm sm:col-span-1 sm:text-md  sm:w-[50%] sm:p-5 lg:py-[10%] lg:px-[40px]">
                <h6 className="text-[10px] font-medium uppercase text-red-500 sm:text-[16px] sm:font-semibold md:mb-3">
                    {text1}
                </h6>
                <h2 className="text-[12px] font-semibold mb-5 sm:text-3xl sm:font-bold md:mb-2">{text2}</h2>
                <p className="hidden sm:block md:mb-10">{description}</p>
                <Link href={`/product/${slug}`}>
                    <button className="primary-button text-[10px]   md:text-lg">{button}</button>
                </Link>
            </div>
        </div>
    );
};

export default HeroBanner;
