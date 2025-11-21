// deleteProduct.js
import React from 'react';
import { message, Button } from 'antd';
import axios from 'axios';



const DeleteProduct = ({ productId, onDeleteSuccess }) => {
  const API_URL = process.env.REACT_APP_API_URL;

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.delete(`${API_URL}/product/deleteProduct/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        message.success('Product deleted successfully');
        onDeleteSuccess(); // Callback to refresh the list of Products after deletion
      } else {
        message.error('Failed to delete Product');
      }
    } catch (error) {
      console.error('Error deleting Product:', error);
      message.error('Something went wrong');
    }
  };

  return (
    <Button type="primary" style={{ margin: '30px', textAlign: 'center', backgroundColor: 'red'  }} danger onClick={handleDelete}>
      Delete
    </Button>
  );
};

export default DeleteProduct;  // Ensure the component is exported as default
