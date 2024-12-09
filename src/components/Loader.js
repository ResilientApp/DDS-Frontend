import React from 'react';
import styled, { keyframes } from 'styled-components';
import '../App.css';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const LoaderOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #0f0f1a; /* Updated background color */
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${fadeIn} 0.5s ease-in-out;
  z-index: 9999;
`;


const StyledSpinner = styled.div`
  width: 60px;
  height: 60px;
  border: 6px solid rgba(0, 123, 255, 0.2);
  border-top-color: #3417ff;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoaderText = styled.div`
  margin-top: 20px;
  font-size: 1.2rem;
  color: #3417ff;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1.5px;
`;

const Loader = () => {
  return (
    <LoaderOverlay>
      <div>
        <StyledSpinner />
        <LoaderText>Loading...</LoaderText>
      </div>
    </LoaderOverlay>
  );
};

export default Loader;
