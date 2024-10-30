import React from 'react';
import { Form, Button } from 'react-bootstrap';

const DeliveryForm = ({ handleDeliveryInfoSubmit }) => {
  return (
    <Form onSubmit={handleDeliveryInfoSubmit}>
      <h4>Delivery Information</h4>
      
      <Form.Group controlId="fullName">
        <Form.Label>Full Name</Form.Label>
        <Form.Control type="text" placeholder="Enter your first and last name" required />
      </Form.Group>

      <Form.Group controlId="phoneNumber">
        <Form.Label>Phone Number</Form.Label>
        <Form.Control type="text" placeholder="Please enter your phone number" required />
      </Form.Group>

      <Form.Group controlId="addressLine">
        <Form.Label>Building / House No / Floor / Street</Form.Label>
        <Form.Control type="text" placeholder="Please enter" required />
      </Form.Group>

      <Form.Group controlId="colony">
        <Form.Label>Colony / Suburb / Locality / Landmark</Form.Label>
        <Form.Control type="text" placeholder="Please enter" required />
      </Form.Group>

      <Form.Group controlId="province">
        <Form.Label>Province</Form.Label>
        <Form.Control as="select" required>
          <option value="">Please choose your province</option>
          {/* Add options here */}
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="city">
        <Form.Label>City</Form.Label>
        <Form.Control as="select" required>
          <option value="">Please choose your city</option>
          {/* Add options here */}
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="area">
        <Form.Label>Area</Form.Label>
        <Form.Control as="select" required>
          <option value="">Please choose your area</option>
          {/* Add options here */}
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="fullAddress">
        <Form.Label>Address</Form.Label>
        <Form.Control type="text" placeholder="For Example: House# 123, Street# 123, ABC Road" required />
      </Form.Group>

      <Form.Group controlId="deliveryLabel">
        <Form.Label>Select a label for effective delivery:</Form.Label>
        <Form.Control as="select" required>
          <option value="home">HOME</option>
          <option value="office">OFFICE</option>
          <option value="save">SAVE</option>
        </Form.Control>
      </Form.Group>

      <Button variant="primary" type="submit">Submit Delivery Info</Button>
    </Form>
  );
};

export default DeliveryForm;
