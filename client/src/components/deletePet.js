// deletePet.js
import React from 'react';
import { message, Button } from 'antd';
import axios from 'axios';



const DeletePet = ({ petId, onDeleteSuccess }) => {
  const API_URL = process.env.REACT_APP_API_URL;

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.delete(`${API_URL}/pet/deletePet/${petId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        message.success('Pet deleted successfully');
        onDeleteSuccess(); // Callback to refresh the list of pets after deletion
      } else {
        message.error('Failed to delete pet');
      }
    } catch (error) {
      console.error('Error deleting pet:', error);
      message.error('Something went wrong');
    }
  };

  return (
    <Button type="primary" style={{ margin: '30px', textAlign: 'center', backgroundColor: 'red'  }} danger onClick={handleDelete}>
      Delete
    </Button>
  );
};

export default DeletePet;  // Ensure the component is exported as default
