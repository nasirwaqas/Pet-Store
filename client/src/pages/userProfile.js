
import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Form, Input, message, List } from 'antd';
import axios from 'axios';
import DeleteProduct from '../components/deleteProduct'; // Default import
import UploadProductForm from './ProductForm'; // Import the UploadProductForm component
import useLogout from '../hooks/HandleLogout'; // Import the useLogout hook
import UserNavbar from './UserNavbar';
import Spinner from 'react-bootstrap/Spinner';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [productData, setProductData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isProductModalVisible, setIsProductModalVisible] = useState(false);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [form] = Form.useForm();
  const [productForm] = Form.useForm();
  const logout = useLogout(); // Use the logout hook
  const [loading, setLoading] = useState(true);
    const API_URL = process.env.REACT_APP_API_URL;


  const refreshProductList = () => {
    getUserProducts();
  };

  const getUserData = async () => {
    try {
      const res = await axios.post(`${API_URL}/user/getUserData`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (res.data.success && res.data.data) {
        setUserData(res.data.data);
        localStorage.setItem('user', JSON.stringify(res.data.data));
      } else {
        console.error('No data returned from API');
        message.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      if (error.response && error.response.status === 401) {
        logout(); // Logout if token is expired
      } else {
        message.error('Failed to fetch user data');
      }
    } finally {
      setLoading(false); // <-- Always stop loading
    }
  };

  const getUserProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/product/getProductsByUser`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (res.data.success) {
        setProductData(res.data.products);
      } else {
        message.error('Failed to fetch products data');
      }
    } catch (error) {
      console.error('Error fetching products data:', error);
      if (error.response && error.response.status === 401) {
        logout(); // Logout if token is expired
      } else {
        message.error('Failed to fetch products data');
      }
    }
  };

  useEffect(() => {
    getUserData();
    getUserProducts();
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
    form.setFieldsValue(userData);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleProductCancel = () => {
    setIsProductModalVisible(false);
    setSelectedProduct(null);
  };

  const handleUploadCancel = () => {
    setIsUploadModalVisible(false);
  };

  const handleUpdate = async (values) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`${API_URL}/user/updateUser`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setUserData(res.data.user);
        message.success('Profile updated successfully');
        setIsModalVisible(false);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      if (error.response && error.response.status === 401) {
        logout(); // Logout if token is expired
      } else {
        message.error('Something went wrong');
      }
    }
  };

  const handleProductUpdate = async (values) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`${API_URL}/product/updateProduct/${selectedProduct._id}`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        message.success('Product updated successfully');
        getUserProducts();
        setIsProductModalVisible(false);
        setSelectedProduct(null);
      } else {
        message.error('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      if (error.response && error.response.status === 401) {
        logout(); // Logout if token is expired
      } else {
        message.error('Something went wrong');
      }
    }
    
  };

  const showProductModal = (product) => {
    setSelectedProduct(product);
    productForm.setFieldsValue(product);
    setIsProductModalVisible(true);
  };

  const showUploadModal = () => {
    setIsUploadModalVisible(true);
  };

  if (loading) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <Spinner animation="border" />
    </div>
  );
}

  return (
    <>
    <UserNavbar/>
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <Card title="Profile" style={{ marginBottom: '20px', textAlign: 'center', backgroundColor: 'gainsboro' }}>
        <p style={{ textAlign: 'left' }}><strong>Name:</strong> {userData.name || 'N/A'}</p>
        <p style={{ textAlign: 'left' }}><strong>Email:</strong> {userData.email || 'N/A'}</p>
        <p style={{ textAlign: 'left' }}><strong>Address:</strong> {userData.address || 'N/A'}</p>
        <Button type="primary" onClick={showModal}>
          Update Profile
        </Button>
      </Card>
      <Card title="Uploaded Products" style={{ marginBottom: '30px', textAlign: 'center', backgroundColor: 'palegreen' }}>
        {productData.length > 0 ? (
          <List
            itemLayout="vertical"
            dataSource={productData}
            renderItem={product => (
              <List.Item key={product._id}>
                <div>
                  <strong>Product Type:</strong> {product.productType}
                </div>
                <div>
                  <strong>Size:</strong> {product.size}
                </div>
                <div>
                  <strong>Price:</strong> ${product.price}
                </div>
                <div>
                  <strong>accountNumber:</strong> 92{product.accountNumber}
                </div>
                <div>
                  <strong>Description:</strong> {product.description}
                </div>
                {product.images && product.images.length > 0 && (
                  <div>
                    {product.images.map((image, index) => (
                      <img
                        key={index}
                        src={API_URL + '/images/' + image.split("\\").pop()}
                        alt={product.size}
                        style={{ width: '100px', marginRight: '10px' }}
                      />
                    ))}
                  </div>
                )}
                <Button type="primary" onClick={() => showProductModal(product)}>
                  Edit
                </Button>
                <DeleteProduct productId={product._id} onDeleteSuccess={refreshProductList} />
              </List.Item>
            )}
          />
        ) : (
          <p>No products uploaded yet.</p>
        )}
        <Button type="primary" onClick={showUploadModal} block>
          Upload New Product
        </Button>
      </Card>

      <Modal
        title="Update Profile"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Address"
            name="address"
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      
      <Modal
        title="Update Product"
        visible={isProductModalVisible}
        onCancel={handleProductCancel}
        footer={null}
      >
        <Form
          form={productForm}
          layout="vertical"
          onFinish={handleProductUpdate}
        >
          <Form.Item
            label="Product Type"
            name="productType"
            rules={[{ required: true, message: 'Please input product type!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Size"
            name="size"
            rules={[{ required: true, message: 'Please input size!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: 'Please input price!' }]}
          >
            
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
          >

             <Input />
          </Form.Item>
          <Form.Item
            label="About"
            name="about"
          >

            <Input />
          </Form.Item>
          <Form.Item
            label="Details"
            name="details"
          >
                  
            <Input />
          </Form.Item>
          <Form.Item
            label="Discount"
            name="discount"
          >


           <Input />
          </Form.Item>
          <Form.Item
            label="Color"
            name="color"
          >

            <Input />
          </Form.Item>
          <Form.Item
            label="AccountNumber"
            name="accountNumber"
          >
      
            <Input.TextArea />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      
      <Modal
        title="Upload New Product"
        visible={isUploadModalVisible}
        onCancel={handleUploadCancel}
        footer={null}
      >
        <UploadProductForm />
      </Modal>

    </div>
    </>
  );
};

export default Profile;
