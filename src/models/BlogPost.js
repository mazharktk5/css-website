import mongoose from "mongoose";

// Robust model registration for Next.js - clearing cache if it exists 
// to ensure schema updates are picked up during hot-reloading (npm run dev).
const modelName = "BlogPost";

const BlogPostSchema = new mongoose.Schema({
    content: { type: String, default: "" },
    image: { type: String, default: "" },
    likes: { type: Number, default: 0 },
    comments: [{
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
    }],
}, { timestamps: true });

// Check if model already exists and use it, or create it.
// In development, handle hot-reloading by potentially clearing the model cache.
let BlogPost;

if (mongoose.models[modelName]) {
    // If we're in dev mode and the model doesn't have the comments path, 
    // it's stale and should be re-compiled.
    if (!mongoose.models[modelName].schema.paths.comments) {
        delete mongoose.models[modelName];
        BlogPost = mongoose.model(modelName, BlogPostSchema);
    } else {
        BlogPost = mongoose.model(modelName);
    }
} else {
    BlogPost = mongoose.model(modelName, BlogPostSchema);
}

export default BlogPost;
