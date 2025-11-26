import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts, addPost, updatePost, deletePost } from '../../redux/blogSlice';
import './Blogs.css';
import { postsAPI } from '../../network/api-client';
import AddDialog from '../AddDialog/AddDialog';
import EditDialog from '../EditDialog/EditDialog';
import EmptyState from './EmptyState';
import PostsList from './PostsList';
import LoadingState from './LoadingState';
import type { RootState } from '../../redux/store';
import type { BlogPost } from '../../redux/blogSlice';

const Blogs = () => {
  const posts = useSelector((state: RootState) => state.blog.posts);
  const dispatch = useDispatch();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editItemIndex, setEditItemIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPosts = async () => {
      console.log('[Blogs] Fetching posts...');
      setLoading(true);
      try {
        const response = await postsAPI.getAll();
        console.log('[Blogs] API response:', response);
        const posts: BlogPost[] = response.data.data || response.data || [];
        console.log('[Blogs] Fetched posts:', posts);
        dispatch(setPosts(posts));
      } catch (error: any) {
        console.error('[Blogs] Fetch error:', error);
        console.error('[Blogs] Error response:', error.response);
        console.error('[Blogs] Error message:', error.message);
        const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch posts';
        alert(`Failed to fetch posts: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [dispatch]);
  
  const handleFabClick = () => setShowAddModal(true);
  const handleCloseModal = () => setShowAddModal(false);

  const handleAddNewItem = async (newItem: { name: string; image_name: string; image_url: string }) => {
    console.log('[Blogs] Creating new post...', newItem);
    try {
      const response = await postsAPI.create(newItem);
      console.log('[Blogs] Create post response:', response);      
      // Extract the created post from response
      const createdPost = response.data.data || response.data;
      console.log('[Blogs] Created post:', createdPost);      
      if (createdPost && createdPost.id) {
        const newPost: BlogPost = {
          id: createdPost.id,
          name: createdPost.name || newItem.name,
          image_name: createdPost.image_name || newItem.image_name,
          image_url: createdPost.image_url || newItem.image_url,
        };        
        console.log('[Blogs] Adding post to Redux:', newPost);
        dispatch(addPost(newPost));
        setShowAddModal(false);        
        // Refetch all posts to ensure we have the latest data from Firestore
        console.log('[Blogs] Refetching all posts after creation...');
        const fetchResponse = await postsAPI.getAll();
        const allPosts: BlogPost[] = fetchResponse.data.data || fetchResponse.data || [];
        console.log('[Blogs] Refetched posts:', allPosts);
        dispatch(setPosts(allPosts));
      } else {
        throw new Error('Invalid response from server: missing post data');
      }
    } catch (error: any) {
      console.error('[Blogs] Create post error:', error);
      console.error('[Blogs] Error response:', error.response);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to create post';
      alert(`Failed to create post: ${errorMessage}`);
    }
  };
  
  const handleEditItem = (indexToEdit: number) => {
    setEditItemIndex(indexToEdit);
    setShowEditModal(true);
  };

  const handleDeleteItem = async (indexToDelete: number) => {
    const id = posts[indexToDelete].id;
    if (window.confirm(`Are you sure you want to delete "${posts[indexToDelete].name}"?`)) {
      try {
        await postsAPI.delete(id);
        dispatch(deletePost(id));
      } catch (error) {
        console.error('Delete error:', error);
        alert('Failed to delete post. Please try again.');
      }
    }
  };

  const handleSaveEditedItem = async (updatedItem: { name: string; image_name: string; image_url: string }) => {
    if (editItemIndex !== null) {
      const id = posts[editItemIndex].id;
      try {
        await postsAPI.update(id, updatedItem);
        const updatedPost: BlogPost = {
          id,
          ...updatedItem
        };
        dispatch(updatePost(updatedPost));
        setEditItemIndex(null);
        setShowEditModal(false);
      } catch (error) {
        console.error('Update error:', error);
        alert('Failed to update post. Please try again.');
      }
    }
  };
  return (
    <React.Fragment>
      <h1>Blog List</h1>
      {loading ? (
        <LoadingState />
      ) : posts.length === 0 ? (
        <EmptyState />
      ) : (
        <PostsList 
          posts={posts}
          onEdit={handleEditItem}
          onDelete={handleDeleteItem}
        />
      )}
      <button className="fab" onClick={handleFabClick}>+</button>
      {showAddModal && (
        <AddDialog
          onClose={handleCloseModal}
          onAdd={handleAddNewItem}
        />
      )}
      {showEditModal && editItemIndex !== null && (
        <EditDialog
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveEditedItem}
          defaultValues={posts[editItemIndex]}
        />
      )}
    </React.Fragment>
  )
}

export default Blogs