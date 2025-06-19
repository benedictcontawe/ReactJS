import React, { useState } from 'react';
import './App.css'
import Card from './components/Card/Card'
import AddDialog from './components/AddDialog/AddDialog';
import EditDialog from './components/EditDialog/EditDialog';

function App() {
  const [items, setItems] = useState([
    { title: 'First Blog Post', content: 'This is the content of the first blog post.' },
    { title: 'Second Blog Post', content: 'This is the content of the second blog post.' },
    { title: 'Third Blog Post', content: 'This is the content of the third blog post.' },
    { title: 'Fourth Blog Post', content: 'This is the content of the fourth blog post.' },
    { title: 'Fifth Blog Post', content: 'This is the content of the fifth blog post.' },
    { title: 'Sixth Blog Post', content: 'This is the content of the sixth blog post.' },
    { title: 'Seventh Blog Post', content: 'This is the content of the seventh blog post.' },
    { title: 'Eighth Blog Post', content: 'This is the content of the eighth blog post.' },
    { title: 'Ninth Blog Post', content: 'This is the content of the ninth blog post.' },
    { title: 'Tenth Blog Post', content: 'This is the content of the tenth blog post.' },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editItemIndex, setEditItemIndex] = useState<number | null>(null);
  const handleFabClick = () => {
    //alert('FAB Clicked!');
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
  };
  const handleAddNewItem = (newItem: { title: string; content: string }) => {
    //setItems(prevItems => [...prevItems, newItem]);
    setItems(prevItems => [newItem, ...prevItems]);
    setShowAddModal(false);
  };
  const handleEditItem = (indexToEdit: number) => {
    setEditItemIndex(indexToEdit);
    setShowEditModal(true);
  };
  const handleDeleteItem = (indexToDelete: number) => {
    if (window.confirm(`Are you sure you want to delete "${items[indexToDelete].title}"?`)) {
      setItems(prevItems => prevItems.filter((_, i) => i !== indexToDelete));
    }
  };
  const handleSaveEditedItem = (updatedItem: { title: string; content: string }) => {
    if (editItemIndex !== null) {
      setItems(prevItems => {
        const updatedItems = [...prevItems];
        updatedItems[editItemIndex] = updatedItem;
        return updatedItems;
      });
      setEditItemIndex(null);
      setShowEditModal(false);
    }
  };
  return (
    <React.Fragment>
      <h1>Blog Application</h1>
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
          isOpen={showAddModal} // Pass visibility state
          onClose={handleCloseModal} // Pass close handler
          onAdd={handleAddNewItem}   // Pass add handler
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

export default App