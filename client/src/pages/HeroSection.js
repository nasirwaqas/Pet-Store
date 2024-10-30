
import '../style/Herosection.css';
import React from 'react';
import { Carousel } from 'react-bootstrap';
import '../style/Herosection.css';

import dogImage from './images/dog.jpg';
import dogImage1 from './images/dog1.jpg';
import parrotImage from './images/parrot.jpg';

const HeroSection = () => {
  return (
    <Carousel>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={dogImage}
          alt="First slide"
        />
        <Carousel.Caption>
          <h3>Welcome to PetStore</h3>
          <p>Your one-stop shop for all your pet needs.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={dogImage1}
          alt="Second slide"
        />
        <Carousel.Caption>
          <h3>Find Your Perfect Pet</h3>
          <p>Explore a wide variety of pets and accessories.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={parrotImage}
          alt="Third slide"
        />
        <Carousel.Caption>
          <h3>Quality and Care</h3>
          <p>We ensure the best care and quality for your pets.</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};

export default HeroSection;

