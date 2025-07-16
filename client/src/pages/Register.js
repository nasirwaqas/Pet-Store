import React from 'react';
import { Button, Form, Input, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../redux/features/alertSlice';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const API_URL = process.env.REACT_APP_API_URL;


  const onFinishHandler = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post(`${API_URL}/user/register`, {
        ...values,
        role: values.role || 'User',  // Ensure role is 'user'
      });
      dispatch(hideLoading());
      if (res.data.success) {
        message.success('Register Successfully');
        navigate('/login');
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error('Something went wrong');
    }
  };

  return (
    <>
      <div className='form-container'>
        <Form
          layout="vertical"
          onFinish={onFinishHandler}
          className="register-form"
          initialValues={{ role: 'User' }} // Set default role
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: 'Please input your Name!',
              },
            ]}
          >
            <Input type='text' />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: 'Please input your Email!',
              },
              {
                type: 'email',
                message: 'Please enter a valid email!',
              },
            ]}
          >
            <Input type='email' />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your Password!',
              },
            ]}
          >
            <Input type='password' />
          </Form.Item>

          {/* Hidden field to set role as 'user' by default */}
          <Form.Item
            name="role" hidden>
            <Input type='hidden' />
          </Form.Item>

          <center>
            <Button className='btn btn-primary' type='primary' htmlType='submit'>
              Submit
            </Button>
          </center>
        </Form>
      </div>
    </>
  );
};

export default Register;
