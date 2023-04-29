import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema(
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
        button: { type: String, require: true },
        text1: { type: String, require: true },
        text2: { type: String, require: true },
        text3: { type: String, require: true },
        safeDate: { type: Date, require: true },
    },
    { timestamps: true },
);

const Banner = mongoose.models.Banner || mongoose.model('Banner', bannerSchema);
export default Banner;
