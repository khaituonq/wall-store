import { useContext } from 'react';
import axios from 'axios';

import Layout from '../components/Layout';
import ProductItem from '../components/ProductItem';
import Product from '../models/Product';
import db from '../utils/db';
import { Store } from '../utils/Store';
import { toast } from 'react-toastify';
import Banner from '../models/Banner';
import HeroBanner from '../components/HeroBanner';
import { FooterBanner } from '../components/FooterBanner';
export default function Home({ products, banners }) {
    const { state, dispatch } = useContext(Store);
    const { cart } = state;

    const addToCartHandler = async (product) => {
        const existItem = cart.cartItems.find((x) => x.slug === product.slug);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const { data } = await axios.get(`/api/products/${product._id}`);

        if (data.countInStock < quantity) {
            toast.error('Sorry. Product is out of stock');
            return;
        }
        dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
        toast.success('Product added to the cart');
    };
    return (
        <Layout title="Home page">
            <HeroBanner heroBanner={banners.length && banners[0]} />
            <div className="flex flex-col items-center mb-10">
                <h2 className="text-[30px] font-bold">Best Selling Product</h2>
                <p className="text-[18px] font-normal">New arrivals</p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 mb-10">
                {products.map((product) => (
                    <ProductItem product={product} key={product.slug} addToCartHandler={addToCartHandler} />
                ))}
            </div>
            <FooterBanner footerBanner={banners.length && banners[1]} />
        </Layout>
    );
}

export async function getServerSideProps() {
    await db.connect();
    const products = await Product.find().lean();
    const banners = await Banner.find().lean();
    return {
        props: {
            products: products.map(db.convertDocToObj),
            banners: banners.map(db.convertDocToObj),
        },
    };
}
