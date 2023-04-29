/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import React from 'react';

export const FooterBanner = ({
    footerBanner: { text1, text2, text3, description, price, button, image, name, safeDate, slug },
}) => {
    return (
        <div className="grid grid-cols-3 bg-[#f3f2ee] p-3 sm:text-[26px] lg:text-[40px] lg:px-16 lg:items-center ">
            <div className="">
                <h2 className="font-bold text-red-600 lg:mb-6">
                    <span className="text-black">Save off</span> ${price}
                </h2>
                <h1 className="font-semibold uppercase tracking-wide lg:font-black lg:mb-3">{text2}</h1>
                <p className="text-[14px] lg:text-lg">{safeDate}</p>
            </div>
            <img src={image} alt={name} height="300" width="300" className=" " />
            <div className=" ">
                <h3 className="font-italic text-red-600 tracking-wide uppercase text-[12px] lg:text-xl">{text3}</h3>
                <h2 className="font-bold mb-2">{text1}</h2>
                <p className="hidden md:block text-[14px] mb-4 lg:text-lg">{description}</p>
                <Link href={`/product/${slug}`}>
                    <button className="primary-button text-sm ">{button}</button>
                </Link>
            </div>
        </div>
    );
};
