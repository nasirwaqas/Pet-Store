import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Col, Row, Card, Alert, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner'; 
import '../style/ProductCard.css';

const ProductCard = () => {
  const [products, setProducts] = useState([]);
    const API_URL = process.env.REACT_APP_API_URL;


  // Fetch Product data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productRes = await axios.get(`${API_URL}/admin/products`);
        const productsData = Array.isArray(productRes.data) ? productRes.data : productRes.data.products || [];
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setProducts([]);
      }
    };
    fetchData();
  }, []);

  // Calculate average rating
  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1); // Return average rating with one decimal place
  };

  return (
    <Container>
      <Row className="mt-4">
        <Col xs={12}>
          <h2 className="text-center my-4">
            <span className="border-top border-bottom border-dark px-3">Our Products</span>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-around">
        {products && products.length > 0 ? (
          products.filter(product => product.status !== 'Blocked').map((product) => (
            <Col key={product._id} xs={12} sm={6} lg={3} className="d-flex align-items-stretch mb-4">
              <Link to={`/product-details/${product._id}`} className="card-link"> {/* Wrap the entire card */}
                <Card className="product-card">
                  {product.images && product.images.length > 0 && (
                    <Card.Img className="product-image" variant="top" src={API_URL + '/images/' + product.images[0].split("\\").pop()} alt={product.Type} />
                  )}
                  <Card.Body className="d-flex flex-column">
                    {/* product Title */}
                    <Card.Title className="product-title">
                      <Card.Text className="text-left description">
                        {product.description}
                      </Card.Text>
                    </Card.Title>

                    {/* Price and Discount */}
                    <div className="d-flex">
                      <Card.Text className="product-price">
                        Rs. {product.price}
                      </Card.Text>
                      {product.discount && (
                        <span className="product-discount ms-2"> {product.discount}% Off</span>
                      )}
                    </div>

                    {/* Sold Count, Average Rating, and Reviews */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <Card.Text className="sold-count">{product.soldCount || 0} sold</Card.Text>
                      <Card.Text className="product-rating">
                        <span className="stars">
                          {'★'.repeat(Math.round(calculateAverageRating(product.reviews)))} {/* Display average rating stars */}
                          {'☆'.repeat(5 - Math.round(calculateAverageRating(product.reviews)))} {/* Empty stars */}
                        </span>
                        ({product.reviews.length} reviews)
                      </Card.Text>
                    </div>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))
        ) : (
          <Col>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                 <Spinner animation="border" />
               </div>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default ProductCard;
