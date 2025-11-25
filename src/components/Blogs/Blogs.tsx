import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts, addPost, updatePost, deletePost } from '../../redux/blogSlice';
import './Blogs.css';
import { postsAPI } from '../../network/api-client';
import Card from '../Card/Card';
import AddDialog from '../AddDialog/AddDialog';
import EditDialog from '../EditDialog/EditDialog';
import type { RootState } from '../../redux/store';
import type { BlogPost } from '../../redux/blogSlice';

const Blogs = () => {
  const posts = useSelector((state: RootState) => state.blog.posts);
  const dispatch = useDispatch();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editItemIndex, setEditItemIndex] = useState<number | null>(null);
  useEffect(() => {
    const fetchPosts = async () => {
      console.log('Fetching...');
      try {
        const response = await postsAPI.getAll();
        const posts: BlogPost[] = response.data.data || response.data || [];
        console.log('Fetched posts:', posts);
        dispatch(setPosts(posts));
      } catch (error) {
        console.error('Fetch error:', error);
        alert('Failed to fetch posts. Please try again.');
      }
    };
    fetchPosts();
  }, [dispatch]);
  
  const handleFabClick = () => setShowAddModal(true);
  const handleCloseModal = () => setShowAddModal(false);

  const handleAddNewItem = async (newItem: { name: string; image_name: string; image_url: string }) => {
    console.log('Appending...');
    try {
      const response = await postsAPI.create(newItem);
      const newPost: BlogPost = {
        id: response.data.data?.id || response.data.id || Date.now().toString(),
        ...newItem
      };
      console.log('Insert Done:', newPost);
      dispatch(addPost(newPost));
      setShowAddModal(false);
    } catch (error) {
      console.error('Insert error:', error);
      alert('Failed to create post. Please try again.');
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
      <ul style={{ listStyle: 'none', padding: 0 }}>
        { posts.map((item, index) => (
          <Card key={index} id={index} 
            name={item.name} 
            image_name={item.image_name}
            image_url={item.image_url}
            onEdit={handleEditItem}
            onDelete={handleDeleteItem}
          />
        ))}
      </ul>
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