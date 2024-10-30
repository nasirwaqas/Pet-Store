// import React from 'react';
// import { Button, Checkbox, Form, Input, message } from 'antd';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const Login = ({ handleClose }) => {
//   const navigate = useNavigate();

//   const onFinishHandler = async (values) => {
//     try {
//       const res = await axios.post("http://localhost:8080/user/login", values);
//       if (res.data.success) {
//         localStorage.setItem('token', res.data.token);
//         localStorage.setItem('userName', res.data.user.name); // Store username
//         message.success('Login Successfully');
        
//         if (handleClose) {
//           handleClose(); // Close modal on success if handleClose is provided
//         }
//         navigate('/'); // Redirect to home page
        
//       } else {
//         message.error(res.data.message);
//       }
//     } catch (error) {
//       console.error(error);
//       message.error('Something went wrong');
//     }
//   };

//   return (
//     <Form
//       name="basic"
//       labelCol={{ span: 8 }}
//       wrapperCol={{ span: 16 }}
//       onFinish={onFinishHandler}
//       autoComplete="off"
//     >
//       <Form.Item
//         label="Email"
//         name="email"
//         rules={[{ required: true, message: 'Please input your Email!' }]}
//       >
//         <Input />
//       </Form.Item>
//       <Form.Item
//         label="Password"
//         name="password"
//         rules={[{ required: true, message: 'Please input your password!' }]}
//       >
//         <Input.Password />
//       </Form.Item>
//       <Form.Item
//         name="remember"
//         valuePropName="checked"
//         wrapperCol={{ offset: 8, span: 16 }}
//       >
//         <Checkbox>Remember me</Checkbox>
//       </Form.Item>
//       <Form.Item
//         wrapperCol={{ offset: 8, span: 16 }}
//       >
//         <Button type="primary" htmlType="submit">Submit</Button>
//       </Form.Item>
//     </Form>
//   );
// };

// export default Login;


// src/pages/Login.js
import React from 'react';
import { Button, Checkbox, Form, Input, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ handleClose }) => {
  const navigate = useNavigate();

  // src/pages/Login.js
const onFinishHandler = async (values) => {
  try {
    const res = await axios.post("http://localhost:8080/user/login", values);
    if (res.data.success) {
      const userData = {
        token: res.data.token,
        name: res.data.user.name,
        role: res.data.user.role, // Assuming role is part of the user data
      };
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('userName', res.data.user.name); // Store user name separately
      message.success('Login Successfully');
       // Check user status
    if (userData.status === 'Rejected') {
      return res.status(403).json({ success: false, message: 'You have been rejected by admin' });
    }
      if (userData.role === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
      if (handleClose) {
        handleClose(); // Close modal on success if handleClose is provided
      }
    } else {
      message.error(res.data.message);
    }
  } catch (error) {
    console.error(error);
    message.error('Something went wrong');
  }
};


  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      onFinish={onFinishHandler}
      autoComplete="off"
    >
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: 'Please input your Email!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        name="remember"
        valuePropName="checked"
        wrapperCol={{ offset: 8, span: 16 }}
      >
        <Checkbox>Remember me</Checkbox>
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">Submit</Button>
      </Form.Item>
    </Form>
  );
};

export default Login;
