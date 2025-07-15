import { useState, useEffect } from 'react';
import React from 'react';
import { Button, Modal, Form, message } from 'antd';
import { Input } from 'antd';
import axios from 'axios';

const RegisterForm = () => {
  const [userData, setUserData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchUserData = async () => {
    try {
      const res = await axios.post('https://pet-store-zeta-rust.vercel.app/user/getUserData', {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUserData(res.data.user);
    } catch (error) {
      console.error(error);
      message.error('Failed to fetch user data');
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const showModal = () => {
    form.setFieldsValue(userData); // Set initial form values to current user data
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleUpdate = async (values) => {
    try {
      const res = await axios.put('https://pet-store-zeta-rust.vercel.app/user/updateUserData', values, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (res.data.success) {
        message.success('Profile updated successfully');
        setIsModalVisible(false);
        fetchUserData(); // Refresh user data
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      message.error('Failed to update profile');
    }
  };

  if (!userData) return null; // Render nothing if userData is not yet fetched

  return (
    <div>
      <h1>Profile</h1>
      <p><strong>Name:</strong> {userData.name}</p>
      <p><strong>Email:</strong> {userData.email}</p>
      {/* Add more user data fields as needed */}
      <Button type="primary" onClick={showModal}>Update Profile</Button>

      <Modal
        title="Update Profile"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleUpdate}>
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
          {/* Add more form fields as needed */}
          <Form.Item>
            <Button type="primary" htmlType="submit">Update</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RegisterForm;
