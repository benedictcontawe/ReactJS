// Dummy posts data
export interface Post {
  id: string;
  name: string;
  image_name: string;
  image_url: string;
}

export const dummyPosts: Post[] = [
  {
    id: '1',
    name: 'First Blog Post',
    image_name: 'image1.jpg',
    image_url: 'https://via.placeholder.com/300'
  },
  {
    id: '2',
    name: 'Second Blog Post',
    image_name: 'image2.jpg',
    image_url: 'https://via.placeholder.com/300'
  },
  {
    id: '3',
    name: 'Third Blog Post',
    image_name: 'image3.jpg',
    image_url: 'https://via.placeholder.com/300'
  }
];

// Get post by ID
export const getPostById = (id: string): Post | undefined => {
  return dummyPosts.find(post => post.id === id);
};

// Get all posts
export const getAllPosts = (): Post[] => {
  return dummyPosts;
};

// Generate new ID
export const generatePostId = (): string => {
  return Date.now().toString();
};