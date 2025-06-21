import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts, addPost, updatePost, deletePost } from '../../redux/blogSlice';
import './Blogs.css'
import { supabase } from '../../supabaseClient';
import Card from '../Card/Card';
import AddDialog from '../AddDialog/AddDialog';
import EditDialog from '../EditDialog/EditDialog';
import type { RootState } from '../../redux/store';

const Blogs = () => {
  const posts = useSelector((state: RootState) => state.blog.posts);
  const dispatch = useDispatch();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editItemIndex, setEditItemIndex] = useState<number | null>(null);
  useEffect(() => {
    const fetchPosts = async () => {
      console.log('Fetching...');
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Fetch error:', error);
      } else {
        console.log('Fetched', data);
        dispatch(setPosts(data || []));
      }
    };
    fetchPosts();
  }, [dispatch])
  const handleFabClick = () => {
    //alert('FAB Clicked!');
    setShowAddModal(true);
  };
  const handleCloseModal = () => {
    setShowAddModal(false);
  };
  const handleAddNewItem = async (newItem: { title: string; content: string }) => {
    console.log('Appending...');
    const { data, error } = await supabase
      .from('posts')
      .insert([newItem])
      .select();
    if (error) {
      console.error('Insert error:', error);
    } else if (data && data[0]) {
      console.log('Insert Done');
      dispatch(addPost(data[0]));
      setShowAddModal(false);
    }
  };
  const handleEditItem = (indexToEdit: number) => {
    setEditItemIndex(indexToEdit);
    setShowEditModal(true);
  };
  const handleDeleteItem = async (indexToDelete: number) => {
    const id = posts[indexToDelete].id;
    if (window.confirm(`Are you sure you want to delete "${posts[indexToDelete].title}"?`)) {
      const { error } = await supabase.from('posts').delete().eq('id', id);
      if (error) {
        console.error('Delete error:', error);
      } else {
        dispatch(deletePost(id));
      }
    }
  };
  const handleSaveEditedItem = async (updatedItem: { title: string; content: string }) => {
    if (editItemIndex !== null) {
      const id = posts[editItemIndex].id;
      const { data, error } = await supabase
        .from('posts')
        .update(updatedItem)
        .eq('id', id)
        .select();
      if (error) {
        console.error('Update error:', error);
      } else if (data && data[0]) {
        dispatch(updatePost(data[0]));
        setEditItemIndex(null);
        setShowEditModal(false);
      }
    }
  };
  return (
    <React.Fragment>
      <h1>Blog List</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        { posts.map((item, index) => (
          <Card key={index} id={index} 
            title={item.title} 
            content={item.content} 
            onEdit={handleEditItem}
            onDelete={handleDeleteItem}
          />
        ))}
      </ul>
      <button className="fab" onClick={handleFabClick}>+</button>
      {showAddModal && (
        <AddDialog
          isOpen={showAddModal}
          onClose={handleCloseModal}
          onAdd={handleAddNewItem}
        />
      )}
      {showEditModal && editItemIndex !== null && (
        <EditDialog
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveEditedItem}
          defaultValues={posts[editItemIndex]}
        />
      )}
    </React.Fragment>
  )
}

export default Blogs