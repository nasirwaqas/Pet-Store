import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Badge, Modal, Form } from 'react-bootstrap';
import AdminLayout from './Layout';

const ManageProducts = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [pets, setPets] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUpdatePetModal, setShowUpdatePetModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [showViewPetModal, setShowViewPetModal] = useState(false); // New state for view modal

  // Fetch users and pets data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const petRes = await axios.get('http://localhost:8080/admin/pets')
        const petsData = Array.isArray(petRes.data) ? petRes.data : petRes.data.pets || [];

        setPets(petsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setPets([]);
      }
    };
    fetchData();
  }, []);


  // Handle pet status change
  const handlePetStatus = async (petId, status) => {
    try {
      await axios.put(`http://localhost:8080/admin/pet-status`, { petId, status });
      setPets(pets.map(pet => pet._id === petId ? { ...pet, status } : pet));
    } catch (error) {
      console.error('Error updating pet status:', error);
    }
  };

  // Handle pet update
  const handleUpdatePet = async () => {
    try {
      await axios.put(`http://localhost:8080/admin/pets/${selectedPet._id}`, selectedPet);
      setShowUpdatePetModal(false);
      setPets(pets.map(pet => pet._id === selectedPet._id ? selectedPet : pet));
    } catch (error) {
      console.error('Error updating pet:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-management">
        


        <h2>Manage Pets</h2>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Sr.No.</th>
              <th>Pet Name</th>
              <th>Owner Name</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pets.map((pet, index) => (
              <tr key={pet._id}>
                <td>{index + 1}</td>
                <td>{pet.category}</td>
                <td>{pet.uploadedBy ? pet.uploadedBy.name : 'Unknown'}</td>
                <td>
                  <Badge bg={pet.status === 'Available' ? 'success' : 'danger'}>
                    {pet.status}
                  </Badge>
                </td>
                <td>
                  {pet.status === 'Available' && (
                    <Button variant="danger" onClick={() => handlePetStatus(pet._id, 'Blocked')}>Block</Button>
                  )}
                  {pet.status === 'Blocked' && (
                    <Button variant="success" onClick={() => handlePetStatus(pet._id, 'Available')}>Unblock</Button>
                  )}
                  <Button variant="warning" onClick={() => { setSelectedPet(pet); setShowUpdatePetModal(true); }}>Update</Button>{' '}
                  <Button variant="info" onClick={() => { setSelectedPet(pet); setShowViewPetModal(true); }}>View</Button> {/* New View Button */}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>


        {/* Update Pet Modal */}
        {selectedPet && (
          <Modal show={showUpdatePetModal} onHide={() => setShowUpdatePetModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Update Pet</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="formPetType">
                  <Form.Label>Pet Type</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedPet.category}
                    onChange={(e) => setSelectedPet({ ...selectedPet, category: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="formPrice">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    value={selectedPet.price}
                    onChange={(e) => setSelectedPet({ ...selectedPet, price: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="formStatus">
                  <Form.Label>Status</Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedPet.status}
                    onChange={(e) => setSelectedPet({ ...selectedPet, status: e.target.value })}
                  >
                    <option value="Available">Available</option>
                    <option value="Blocked">Blocked</option>
                  </Form.Control>
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowUpdatePetModal(false)}>Close</Button>
              <Button variant="primary" onClick={handleUpdatePet}>Save Changes</Button>
            </Modal.Footer>
          </Modal>
        )}

        {/* View Pet Modal */}
        {selectedPet && (
          <Modal show={showViewPetModal} onHide={() => setShowViewPetModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>View Pet Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p><strong>Pet Category:</strong> {selectedPet.category}</p>
              <p><strong>Price:</strong> {selectedPet.price}</p>
              <p><strong>Status:</strong> {selectedPet.status}</p>
              <p><strong>Description:</strong> {selectedPet.description}</p>
              <p><strong>Breed:</strong> {selectedPet.breed}</p>
              <p><strong>Account Number:</strong> {selectedPet.accountNumber}</p>
              {selectedPet.images.map((image, index) => (
                      <img
                        key={index}
                        src={'/images/' + image.split("\\").pop()}
                        alt={selectedPet.breed}
                        style={{ width: '100px', marginRight: '10px' }}
                      />
                    ))}
              <p><strong>Owner Name:</strong> {selectedPet.uploadedBy ? selectedPet.uploadedBy.name : 'Unknown'}</p>
              {/* Add more details as needed */}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowViewPetModal(false)}>Close</Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManageProducts;
