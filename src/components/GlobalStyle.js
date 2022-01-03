import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    scrollbar-width: thin;
    scrollbar-color: rgba(155, 155, 155, 0.5) transparent;
    &::-webkit-scrollbar {
      width: 5px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background-color: rgba(155, 155, 155, 0.5);
      border-radius: 20px;
      border: transparent;
    }
  }

  html{
    @media (max-width: 1200px){
      font-size: 80%;
    }
  }
  body{
    background: #ffffff;
    font-family:  sans-serif;
    color: #1b1b1b;
    overflow-x: hidden;
    letter-spacing: 0.02em;
  }

  .max-width{
    max-width: 1200px;
  } 

  a{
    font-family: inherit;
    color: #6DA5EA;
    text-decoration: none;
    
    &:hover{ 
      text-decoration: underline dashed #6DA5EA;
    }
  }
`;

export default GlobalStyle;
