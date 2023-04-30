import Head from 'next/head';
import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { ToastContainer } from 'react-toastify';
import { useSession, signOut } from 'next-auth/react';
import { Menu } from '@headlessui/react';
import { AiFillInstagram } from 'react-icons/ai';
import { BsTwitter } from 'react-icons/bs';
import { FaUserCircle, FaShoppingCart } from 'react-icons/fa';

import 'react-toastify/dist/ReactToastify.css';
import { Store } from '../utils/Store.js';
import DropdownLink from './DropdownLink.jsx';
import Cookies from 'js-cookie';

const Layout = ({ children, title }) => {
    const { status, data: session } = useSession();
    const { state, dispatch } = useContext(Store);
    const { cart } = state;
    const [cartItemsCount, setCartItemsCount] = useState(0);

    useEffect(() => {
        setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
    }, [cart.cartItems]);

    const logoutClickHandler = () => {
        Cookies.remove('cart');
        dispatch({ type: 'CART_RESET' });
        signOut({ callbackUrl: '/login' });
    };
    return (
        <>
            <Head>
                <title>{title ? title : 'Wall Store'}</title>
                <link rel="icon" href="../images/icon.png" />
            </Head>

            <ToastContainer position="top-center" limit={1} />
            <div className="flex min-h-screen flex-col justify-between">
                <header>
                    <nav className="flex h-12 items-center px-4 justify-between shadow-md">
                        <Link href="/">
                            <a className="text-xl font-extrabold">Wall Store</a>
                        </Link>
                        <div className="flex flex-row items-center">
                            <Link href="/cart">
                                <a className="relative mr-6 hover:scale-110 ease duration-[.5s]">
                                    <FaShoppingCart className="text-[22px]" />
                                    {cartItemsCount > 0 && (
                                        <span className=" rounded-full bg-red-600 px-2 py-1 text-[7px] font-bold text-white absolute top-[-7px] right-[-16px]">
                                            {cartItemsCount}
                                        </span>
                                    )}
                                </a>
                            </Link>
                            {status === 'loading' ? (
                                'loading'
                            ) : session?.user ? (
                                <Menu as="div" className="relative font-medium ">
                                    <Menu.Button className=" flex ">
                                        {' '}
                                        <FaUserCircle className="text-[22px] mr-2" />
                                        {session.user.name}
                                    </Menu.Button>
                                    <Menu.Items className="border absolute right-0 top-[36px] w-44 origin-top-right shadow-lg bg-white z-50 ease-linear">
                                        <Menu.Item>
                                            <DropdownLink className="dropdown-link" href="/profile">
                                                Profile
                                            </DropdownLink>
                                        </Menu.Item>
                                        <Menu.Item>
                                            <DropdownLink className="dropdown-link" href="/order-history">
                                                Order History
                                            </DropdownLink>
                                        </Menu.Item>
                                        {session.user.isAdmin && (
                                            <Menu.Item>
                                                <DropdownLink className="dropdown-link" href="/admin/dashboard">
                                                    Admin Dashboard
                                                </DropdownLink>
                                            </Menu.Item>
                                        )}
                                        <Menu.Item>
                                            <a href="#" className="dropdown-link" onClick={logoutClickHandler}>
                                                Logout
                                            </a>
                                        </Menu.Item>
                                    </Menu.Items>
                                </Menu>
                            ) : (
                                <Link href="/login">
                                    <a className="p-2 font-semibold">Login</a>
                                </Link>
                            )}
                        </div>
                    </nav>
                </header>
                <main className="container m-auto mt-4 px-4">{children}</main>
                <footer className="flex  justify-center flex-col items-center shadow-inner mt-12 bg-black px-[10px] pt-[30px] pb-[10px] text-white">
                    <p className="text-[15px] mb-[15px] font-bold">
                        {new Date().getFullYear()} Wall Store all rights reserverd
                    </p>
                    <div className="flex gap-3 font-bold text-[22px] text-white mb-[10px]">
                        <AiFillInstagram />
                        <BsTwitter />
                    </div>
                </footer>
            </div>
        </>
    );
};

export default Layout;
