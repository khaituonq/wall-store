import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

import Layout from '../../components/Layout';
import { Store } from '../../utils/Store';
import db from '../../utils/db';
import Product from '../../models/Product';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProductScreen = (props) => {
    const { product } = props;
    console.log(product._id);
    const { state, dispatch } = useContext(Store);
    const router = useRouter();
    if (!product) {
        return <Layout title="Product Not Found">Product Not Found</Layout>;
    }
    const addToCartHandler = async () => {
        const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const { data } = await axios.get(`/api/products/${product._id}`);

        if (data.countInStock < quantity) {
            toast.error('Sorry. Product is out of stock');
            return;
        }
        dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
        router.push('/cart');
    };
    return (
        <Layout title={product.name}>
            <div className="grid mt-5 md:grid-cols-4 md:gap-3">
                <div className="md:col-span-2 w-[400px] h-[400px]">
                    <Image
                        src={product.image}
                        alt={product.name}
                        width={400}
                        height={400}
                        layout="responsive"
                        className="object-contain"
                    ></Image>
                </div>
                <div>
                    <ul>
                        <li>
                            <h1 className="text-xl font-bold mb-2">{product.name}</h1>
                        </li>
                        <li>
                            <p className="font-medium">Category:</p> {product.category}
                        </li>
                        <li>
                            <p className="font-medium">Brand:</p> {product.brand}
                        </li>

                        <li className="text-red-500">
                            {product.rating} star of {product.numReviews} reviews
                        </li>
                        <li>
                            <p className="font-medium">Description:</p> {product.description}
                        </li>
                    </ul>
                </div>
                <div>
                    <div className="card p-5">
                        <div className="mb-2 flex justify-between">
                            <div className="font-medium">Price</div>
                            <div>${product.price}</div>
                        </div>
                        <div className="mb-2 flex justify-between">
                            <div className="font-medium mb-5">Status</div>
                            <div>{product.countInStock > 0 ? 'In stock' : 'Unavailable'}</div>
                        </div>
                        <button type="button" className="primary-button w-full" onClick={addToCartHandler}>
                            Add to cart
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ProductScreen;

export async function getServerSideProps(context) {
    const { params } = context;
    const { slug } = params;

    await db.connect();
    const product = await Product.findOne({ slug }).lean();
    await db.disconnect();
    return {
        props: {
            product: product ? db.convertDocToObj(product) : null,
        },
    };
}
