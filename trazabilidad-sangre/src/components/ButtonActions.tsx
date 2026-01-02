import React from "react";
import styled from "styled-components";

interface ButtonProps {
  text: string;
  blue?: boolean;
  onClick: (tokenId: Number, price: string) => void;
  tokenId: Number,
  price: string
}

interface ButtonActionsProps {
  tokenId: number; // ✅ not Number
  price: number;
  onClick: (tokenId: number, price: number) => void;
  text: string;
  blue?: boolean;
}


const ButtonActions: React.FC<ButtonProps> = ({ text, blue = false, onClick, tokenId, price }) => {
  return (
    <Div>
      <button key={Number(tokenId)} onClick={() => onClick(tokenId, price)} className={`${blue ? "blue" : ""}`}>{text}</button>
    </Div>
  );
}
export default ButtonActions;
const Div = styled.div`
  button {
    border-radius: 4rem;
    // padding: 0.8rem 2rem;
    padding: 0.2rem 0.5rem;
    border: none;
    color: white;
    font-size: 1.1rem;
    cursor: pointer;
    :not(.blue) {
      background-color: transparent;
      border: 1px solid white;
    }
  }
  .blue {
    background-color: #2d69fd;
  }
`;
