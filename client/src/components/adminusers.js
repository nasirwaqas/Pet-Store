import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Badge, Modal, Form } from 'react-bootstrap';
import AdminLayout from './Layout';

const AdminManagement = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUpdateProductModal, setShowUpdateProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showViewProductModal, setShowViewProductModal] = useState(false); // New state for view modal

    const API_URL = process.env.REACT_APP_API_URL;

  // Fetch users and Products data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axios.get(`${API_URL}/admin/users`);
        const usersData = Array.isArray(userRes.data) ? userRes.data : userRes.data.users || [];
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setUsers([]);
      }
    };
    fetchData();
  }, []);

  // Handle user status change
  const handleUserStatus = async (userId, status) => {
    try {
      if (!userId) {
        console.error('User ID is undefined');
        return;
      }

      const response = await axios.put(`${API_URL}/admin/user-status`, { userId, status });

      if (response.data.success) {
        setUsers(users.map(user => user._id === userId ? { ...user, status } : user));
      } else {
        console.error('Error updating user status:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  // Handle user update
  const handleUpdateUser = async () => {
    try {
      await axios.put(`${API_URL}/admin/users/${selectedUser._id}`, selectedUser);
      setShowUpdateModal(false);
      setUsers(users.map(user => user._id === selectedUser._id ? selectedUser : user));
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // Handle user delete
  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`${API_URL}/admin/users/${userId}`);
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-management">
        <h2>Manage Users</h2>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Sr.No.</th>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <Badge bg={user.status === 'Accepted' ? 'success' : user.status === 'Rejected' ? 'danger' : 'warning'}>
                    {user.status}
                  </Badge>
                </td>
                <td>
                  {user.status === 'Pending' && (
                    <>
                      <Button variant="success" onClick={() => handleUserStatus(user._id, 'Accepted')}>Accept</Button>{' '}
                      <Button variant="danger" onClick={() => handleUserStatus(user._id, 'Rejected')}>Reject</Button>
                    </>
                  )}
                  {user.status === 'Accepted' && (
                    <Button variant="danger" onClick={() => handleUserStatus(user._id, 'Rejected')}>Reject</Button>
                  )}
                  {user.status === 'Rejected' && (
                    <Button variant="success" onClick={() => handleUserStatus(user._id, 'Accepted')}>Accept</Button>
                  )}
                  <Button variant="warning" onClick={() => { setSelectedUser(user); setShowUpdateModal(true); }}>Update</Button>{' '}
                  <Button variant="danger" onClick={() => handleDeleteUser(user._id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Update User Modal */}
        {selectedUser && (
          <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Update User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="formName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedUser.name}
                    onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={selectedUser.email}
                    onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>Close</Button>
              <Button variant="primary" onClick={handleUpdateUser}>Save Changes</Button>
            </Modal.Footer>
          </Modal>
        )}


        {/* View Product Modal */}
        {selectedProduct && (
          <Modal show={showViewProductModal} onHide={() => setShowViewProductModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>View Product Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p><strong>Product Type:</strong> {selectedProduct.productType}</p>
              <p><strong>Price:</strong> {selectedProduct.price}</p>
              <p><strong>Status:</strong> {selectedProduct.status}</p>
              <p><strong>Description:</strong> {selectedProduct.description}</p>
              <p><strong>Size:</strong> {selectedProduct.size}</p>
              <p><strong>Account Number:</strong> {selectedProduct.accountNumber}</p>
              {selectedProduct.images.map((image, index) => (
                      <img
                        key={index}
                        src={API_URL + '/images/' + image.split("\\").pop()}
                        alt={selectedProduct.size}
                        style={{ width: '100px', marginRight: '10px' }}
                      />
                    ))}
              <p><strong>Owner Name:</strong> {selectedProduct.uploadedBy ? selectedProduct.uploadedBy.name : 'Unknown'}</p>
              {/* Add more details as needed */}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowViewProductModal(false)}>Close</Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminManagement;
