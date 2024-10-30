// import React, { useState } from 'react';
// import { Form, Input, Button, Select, Upload, Card, Row, Col, notification } from 'antd';
// import { UploadOutlined } from '@ant-design/icons';
// import axios from 'axios';

// const { TextArea } = Input;
// const { Option } = Select;

// function UploadPetForm() {
//   const [form] = Form.useForm();
//   const [images, setImages] = useState([]);

//   const handleImageChange = ({ fileList }) => {
//     setImages(fileList.map(file => file.originFileObj));
//   };

//   const handleSubmit = async (values) => {
//     const formData = new FormData();
//     formData.append('petType', values.petType);
//     formData.append('breed', values.breed);
//     formData.append('price', values.price);
//     formData.append('description', values.description);
//     formData.append('about', values.about);
//     formData.append('details', values.details);
//     formData.append('discount', values.discount);
    
//     formData.append('accountNumber', values.accountNumber);
//     images.forEach((image) => {
//       formData.append('images', image);
//     });

//     try {
//         const token = localStorage.getItem('token'); // Get token from local storage or state
//       const response = await axios.post('http://localhost:8080/pet/uploadPet', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           'Authorization': `Bearer ${token}`, // Add token to the Authorization header
//         },
//       });
//       console.log('Pet uploaded successfully', response.data);

//       // Show success notification
//       notification.success({
//         message: 'Success',
//         description: 'Pet data uploaded successfully!',
//       });

//       // Reset the form fields
//       form.resetFields();
//       setImages([]);
//     } catch (error) {
//       console.error('There was an error uploading the pet', error);

//       // Show error notification
//       notification.error({
//         message: 'Error',
//         description: 'There was an error uploading the pet.',
//       });
//     }
//   };

//   return (
//     <Row justify="center">
//       <Col xs={24} sm={20} md={16} lg={12}>
//         <Card title="Upload Pet Details" bordered={false} style={{ marginTop: 20 }}>
//           <Form
//             form={form}
//             layout="vertical"
//             onFinish={handleSubmit}
//           >
//             <Form.Item
//               name="petType"
//               label="Pet Type"
//               rules={[{ required: true, message: 'Please select a pet type' }]}
//             >
//               <Select placeholder="Select a pet type">
//                 <Option value="Dog">Dog</Option>
//                 <Option value="Cat">Cat</Option>
//                 <Option value="Parrot">Parrot</Option>
//                 {/* Add more options as needed */}
//               </Select>
//             </Form.Item>

//             <Form.Item
//               name="breed"
//               label="Breed"
//               rules={[{ required: true, message: 'Please enter the breed' }]}
//             >
//               <Input />
//             </Form.Item>

//             <Form.Item
//               name="price"
//               label="Price"
//               rules={[{ required: true, message: 'Please enter the price' }]}
//             >
//               <Input type="number" />
//             </Form.Item>

//             <Form.Item
//               name="accountNumber"
//               label="Account Number"
//               rules={[{ required: true, message: 'Please enter an account number' }]}
//             >
//               <Input type="number" />
//             </Form.Item>

//             <Form.Item
//               name="description"
//               label="Description"
//               rules={[{ required: true, message: 'Please enter a description' }]}
//             >
//               <TextArea rows={3} />
//             </Form.Item>

//             <Form.Item
//               name="about"
//               label="About"
//               rules={[{ required: true, message: 'Please enter a about' }]}
//             >
//               <TextArea rows={3} />
//             </Form.Item>

//             <Form.Item
//               name="details"
//               label="Details"
//               rules={[{ required: true, message: 'Please enter a details' }]}
//             >
//               <TextArea rows={3} />
//             </Form.Item>

//             <Form.Item
//               name="discount"
//               label="Discount"
//               rules={[{ required: true, message: 'Please enter a discount' }]}
//             >
//               <TextArea rows={3} />
//             </Form.Item>

//             <Form.Item
//               name="images"
//               label="Images"
//               valuePropName="fileList"
//               getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
//               rules={[{ required: true, message: 'Please upload images' }]}
//             >
//               <Upload
//                 listType="picture"
//                 multiple
//                 beforeUpload={() => false} // Prevent automatic upload
//                 onChange={handleImageChange}
//               >
//                 <Button icon={<UploadOutlined />}>Upload Images</Button>
//               </Upload>
//             </Form.Item>

//             <Form.Item>
//               <Button type="primary" htmlType="submit" block>
//                 Upload Pet
//               </Button>
//             </Form.Item>
//           </Form>
//         </Card>
//       </Col>
//     </Row>
//   );
// }

// export default UploadPetForm;

import React, { useState } from 'react';
import { Form, Input, Button, Select, Upload, Card, Row, Col, notification } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const { TextArea } = Input;
const { Option } = Select;

function UploadPetForm() {
  const [form] = Form.useForm();
  const [images, setImages] = useState([]);

  const handleImageChange = ({ fileList }) => {
    setImages(fileList.map(file => file.originFileObj));
  };

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append('category', values.category);
    formData.append('breed', values.breed);
    formData.append('color', values.color); // Added color field
    formData.append('price', values.price);
    formData.append('description', values.description);
    formData.append('about', values.about);
    formData.append('details', values.details);
    formData.append('discount', values.discount);
    formData.append('accountNumber', values.accountNumber);
    images.forEach((image) => {
      formData.append('images', image);
    });

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8080/pet/uploadPet', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`, // Add token to the Authorization header
        },
      });

      notification.success({
        message: 'Success',
        description: 'Pet data uploaded successfully!',
      });

      form.resetFields();
      setImages([]);
    } catch (error) {
      console.error('Error uploading the pet', error);

      notification.error({
        message: 'Error',
        description: 'There was an error uploading the pet.',
      });
    }
  };

  return (
    <Row justify="center">
      <Col xs={24} sm={20} md={16} lg={12}>
        <Card title="Upload Pet Details" bordered={false} style={{ marginTop: 20 }}>
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: 'Please enter the category' }]}
            >
          
              <Input />
            </Form.Item>

            <Form.Item
              name="breed"
              label="Breed"
              rules={[{ required: true, message: 'Please enter the breed' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="color"
              label="Color"
              rules={[{ required: true, message: 'Please enter the color' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="price"
              label="Price"
              rules={[{ required: true, message: 'Please enter the price' }]}
            >
              <Input type="number" />
            </Form.Item>

            <Form.Item
              name="accountNumber"
              label="Account Number"
              rules={[{ required: true, message: 'Please enter an account number' }]}
            >
              <Input type="number" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: 'Please enter a description' }]}
            >
              <TextArea rows={3} />
            </Form.Item>

            <Form.Item
              name="about"
              label="About"
              rules={[{ required: true, message: 'Please enter an about' }]}
            >
              <TextArea rows={3} />
            </Form.Item>

            <Form.Item
              name="details"
              label="Details"
              rules={[{ required: true, message: 'Please enter details' }]}
            >
              <TextArea rows={3} />
            </Form.Item>

            <Form.Item
              name="discount"
              label="Discount"
              rules={[{ required: true, message: 'Please enter a discount' }]}
            >
              <TextArea rows={3} />
            </Form.Item>

            <Form.Item
              name="images"
              label="Images"
              valuePropName="fileList"
              getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
              rules={[{ required: true, message: 'Please upload images' }]}
            >
              <Upload
                listType="picture"
                multiple
                beforeUpload={() => false}
                onChange={handleImageChange}
              >
                <Button icon={<UploadOutlined />}>Upload Images</Button>
              </Upload>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Upload Pet
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
}

export default UploadPetForm;
