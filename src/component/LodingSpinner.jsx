import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;

  &::before {
    content: '';
    width: 32px;
    height: 32px;
    border: 4px solid #4b5563;
    border-top-color: transparent;
    border-radius: 50%;
    animation: ${spin} 1s linear infinite;
  }
`;

const LoadingComponent = () => {
  return (
    <LoadingSpinner />
  );
};

export default LoadingComponent;
