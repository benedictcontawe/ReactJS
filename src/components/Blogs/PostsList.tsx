import React from 'react';
import Card from '../Card/Card';
import type { BlogPost } from '../../redux/blogSlice';
import './PostsList.css';

interface PostsListProps {
  posts: BlogPost[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}
/**
 * PostsList component displays a list of blog post cards.
 * 
 * @param posts - Array of blog posts to display
 * @param onEdit - Callback function when edit button is clicked (receives index)
 * @param onDelete - Callback function when delete button is clicked (receives index)
 * @returns JSX element containing a list of Card components
 */
const PostsList: React.FC<PostsListProps> = ({ posts, onEdit, onDelete }) => {
  return (
    <ul className="posts-list">
      {posts.map((item, index) => (
        <Card
          key={item.id || index}
          id={index}
          name={item.name}
          image_name={item.image_name}
          image_url={item.image_url}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
};

export default PostsList;