
import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Form, Input, message, List } from 'antd';
import axios from 'axios';
import DeletePet from '../components/deletePet'; // Default import
import UploadPetForm from './PetForm'; // Import the UploadPetForm component
import useLogout from '../hooks/HandleLogout'; // Import the useLogout hook
import UserNavbar from './UserNavbar';
import Spinner from 'react-bootstrap/Spinner';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [petData, setPetData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPetModalVisible, setIsPetModalVisible] = useState(false);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [form] = Form.useForm();
  const [petForm] = Form.useForm();
  const logout = useLogout(); // Use the logout hook
  const [loading, setLoading] = useState(true);
    const API_URL = process.env.REACT_APP_API_URL;


  const refreshPetList = () => {
    getUserPets();
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

  const getUserPets = async () => {
    try {
      const res = await axios.get(`${API_URL}/pet/getPetsByUser`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (res.data.success) {
        setPetData(res.data.pets);
      } else {
        message.error('Failed to fetch pets data');
      }
    } catch (error) {
      console.error('Error fetching pets data:', error);
      if (error.response && error.response.status === 401) {
        logout(); // Logout if token is expired
      } else {
        message.error('Failed to fetch pets data');
      }
    }
  };

  useEffect(() => {
    getUserData();
    getUserPets();
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
    form.setFieldsValue(userData);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handlePetCancel = () => {
    setIsPetModalVisible(false);
    setSelectedPet(null);
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

  const handlePetUpdate = async (values) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`${API_URL}/pet/updatePet/${selectedPet._id}`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        message.success('Pet updated successfully');
        getUserPets();
        setIsPetModalVisible(false);
        setSelectedPet(null);
      } else {
        message.error('Failed to update pet');
      }
    } catch (error) {
      console.error('Error updating pet:', error);
      if (error.response && error.response.status === 401) {
        logout(); // Logout if token is expired
      } else {
        message.error('Something went wrong');
      }
    }
    
  };

  const showPetModal = (pet) => {
    setSelectedPet(pet);
    petForm.setFieldsValue(pet);
    setIsPetModalVisible(true);
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
      <Card title="Uploaded Pets" style={{ marginBottom: '30px', textAlign: 'center', backgroundColor: 'palegreen' }}>
        {petData.length > 0 ? (
          <List
            itemLayout="vertical"
            dataSource={petData}
            renderItem={pet => (
              <List.Item key={pet._id}>
                <div>
                  <strong>Pet Type:</strong> {pet.petType}
                </div>
                <div>
                  <strong>Breed:</strong> {pet.breed}
                </div>
                <div>
                  <strong>Price:</strong> ${pet.price}
                </div>
                <div>
                  <strong>accountNumber:</strong> 92{pet.accountNumber}
                </div>
                <div>
                  <strong>Description:</strong> {pet.description}
                </div>
                {pet.images && pet.images.length > 0 && (
                  <div>
                    {pet.images.map((image, index) => (
                      <img
                        key={index}
                        src={'/images/' + image.split("\\").pop()}
                        alt={pet.breed}
                        style={{ width: '100px', marginRight: '10px' }}
                      />
                    ))}
                  </div>
                )}
                <Button type="primary" onClick={() => showPetModal(pet)}>
                  Edit
                </Button>
                <DeletePet petId={pet._id} onDeleteSuccess={refreshPetList} />
              </List.Item>
            )}
          />
        ) : (
          <p>No pets uploaded yet.</p>
        )}
        <Button type="primary" onClick={showUploadModal} block>
          Upload New Pet
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
        title="Update Pet"
        visible={isPetModalVisible}
        onCancel={handlePetCancel}
        footer={null}
      >
        <Form
          form={petForm}
          layout="vertical"
          onFinish={handlePetUpdate}
        >
          <Form.Item
            label="Pet Type"
            name="petType"
            rules={[{ required: true, message: 'Please input pet type!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Breed"
            name="breed"
            rules={[{ required: true, message: 'Please input breed!' }]}
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
        title="Upload New Pet"
        visible={isUploadModalVisible}
        onCancel={handleUploadCancel}
        footer={null}
      >
        <UploadPetForm />
      </Modal>

    </div>
    </>
  );
};

export default Profile;
