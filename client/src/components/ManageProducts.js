import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Badge, Modal, Form } from 'react-bootstrap';
import AdminLayout from './Layout';

const ManageProducts = ({ children }) => {
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
        const productRes = await axios.get(`${API_URL}/admin/products`)
        const productsData = Array.isArray(productRes.data) ? productRes.data : productRes.data.products || [];

        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setProducts([]);
      }
    };
    fetchData();
  }, []);


  // Handle Product status change
  const handleProductStatus = async (productId, status) => {
    try {
      await axios.put(`${API_URL}/admin/product-status`, { productId, status });
      setProducts(products.map(product => product._id === productId ? { ...product, status } : product));
    } catch (error) {
      console.error('Error updating product status:', error);
    }
  };

  // Handle Product update
  const handleUpdateProduct = async () => {
    try {
      await axios.put(`${API_URL}/admin/products/${selectedProduct._id}`, selectedProduct);
      setShowUpdateProductModal(false);
      setProducts(products.map(product => product._id === selectedProduct._id ? selectedProduct : product));
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-management">
        


        <h2>Manage Products</h2>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Sr.No.</th>
              <th>Product Name</th>
              <th>Owner Name</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product._id}>
                <td>{index + 1}</td>
                <td>{product.category}</td>
                <td>{product.uploadedBy ? product.uploadedBy.name : 'Unknown'}</td>
                <td>
                  <Badge bg={product.status === 'Available' ? 'success' : 'danger'}>
                    {product.status}
                  </Badge>
                </td>
                <td>
                  {product.status === 'Available' && (
                    <Button variant="danger" onClick={() => handleProductStatus(product._id, 'Blocked')}>Block</Button>
                  )}
                  {product.status === 'Blocked' && (
                    <Button variant="success" onClick={() => handleProductStatus(product._id, 'Available')}>Unblock</Button>
                  )}
                  <Button variant="warning" onClick={() => { setSelectedProduct(product); setShowUpdateProductModal(true); }}>Update</Button>{' '}
                  <Button variant="info" onClick={() => { setSelectedProduct(product); setShowViewProductModal(true); }}>View</Button> {/* New View Button */}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>


        {/* Update Product Modal */}
        {selectedProduct && (
          <Modal show={showUpdateProductModal} onHide={() => setShowUpdateProductModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Update Product</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="formProductType">
                  <Form.Label>Product Type</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedProduct.category}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, category: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="formPrice">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    value={selectedProduct.price}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, price: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="formStatus">
                  <Form.Label>Status</Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedProduct.status}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, status: e.target.value })}
                  >
                    <option value="Available">Available</option>
                    <option value="Blocked">Blocked</option>
                  </Form.Control>
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowUpdateProductModal(false)}>Close</Button>
              <Button variant="primary" onClick={handleUpdateProduct}>Save Changes</Button>
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
              <p><strong>Product Category:</strong> {selectedProduct.category}</p>
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

export default ManageProducts;
