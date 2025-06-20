import React, { useEffect, useState } from 'react';
import './Blogs.css'
import { supabase } from '../../supabaseClient';
import Card from '../Card/Card';
import AddDialog from '../AddDialog/AddDialog';
import EditDialog from '../EditDialog/EditDialog';
interface BlogPost {
  id: number;
  title: string;
  content: string;
}

const Blogs = () => {
  const [items, setItems] = useState<BlogPost[]>([]);
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
        setItems(data || []);
      }
    };
    fetchPosts();
  }, [])
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
      setItems(prevItems => [data[0], ...prevItems]);
      setShowAddModal(false);
    }
  };
  const handleEditItem = (indexToEdit: number) => {
    setEditItemIndex(indexToEdit);
    setShowEditModal(true);
  };
  const handleDeleteItem = async (indexToDelete: number) => {
    const id = items[indexToDelete].id;
    if (window.confirm(`Are you sure you want to delete "${items[indexToDelete].title}"?`)) {
      const { error } = await supabase.from('posts').delete().eq('id', id);
      if (error) {
        console.error('Delete error:', error);
      } else {
        setItems(prevItems => prevItems.filter((_, i) => i !== indexToDelete));
      }
    }
  };
  const handleSaveEditedItem = async (updatedItem: { title: string; content: string }) => {
    if (editItemIndex !== null) {
      const id = items[editItemIndex].id;
      const { data, error } = await supabase
        .from('posts')
        .update(updatedItem)
        .eq('id', id)
        .select();
      if (error) {
        console.error('Update error:', error);
      } else if (data && data[0]) {
        setItems(prev => {
          const copy = [...prev];
          copy[editItemIndex] = data[0];
          return copy;
        });
        setEditItemIndex(null);
        setShowEditModal(false);
      }
    }
  };
  return (
    <React.Fragment>
      <h1>Blog List</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        { items.map((item,index) => (
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
          defaultValues={items[editItemIndex]}
        />
      )}
    </React.Fragment>
  )
}

export default Blogs