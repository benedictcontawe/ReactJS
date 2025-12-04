import mongoose, { Schema, Document } from 'mongoose';

/**
 * Post interface representing a blog post document in MongoDB.
 */
export interface IPost extends Document {
  name: string;
  image_name: string;
  image_url: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Post schema for MongoDB.
 * Matches the structure expected by postController.
 */
const postSchema = new Schema<IPost> (
  {
    name: {
      type: String,
      required: [true, 'Post name is required'],
      trim: true,
    },
    image_name: {
      type: String,
      required: [true, 'Image name is required'],
      trim: true,
    },
    image_url: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    collection: 'posts', // Explicitly set collection name to "posts"
  }
);

// Create indexes for better query performance
postSchema.index({ createdAt: -1 }); // Descending order for latest posts first

// Export the model
export const Post = mongoose.model<IPost>('Post', postSchema);