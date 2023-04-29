import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        name: { type: String, require: true },
        slug: { type: String, require: true, unique: true },
        category: { type: String, require: true },
        image: { type: String, require: true },
        price: { type: Number, require: true },
        brand: { type: String, require: true },
        rating: { type: Number, require: true, default: 0 },
        numReviews: { type: Number, require: true, default: 0 },
        countInStock: { type: Number, require: true, default: 0 },
        description: { type: String, require: true },
    },
    { timestamps: true },
);

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
