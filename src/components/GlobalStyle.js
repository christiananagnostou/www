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
  }
  html{
    @media (max-width: 1700px){
      font-size: 75%;
    }
  }
  body{
    background: #1b1b1b;
    font-family: 'Inter', sans-serif;
    overflow-x: hidden;
  }
  button{
    font-family: 'Inter', sans-serif;
    font-weight: bold;
    font-size: 1.1rem;
    cursor: pointer;
    padding: 1rem 2rem;
    border: 3px solid #23d997;
    background: transparent;
    color: white;
    transition: all 0.5s ease;
    &:hover{
      background: #23d997;
      text-shadow: 2px 2px #393939;
    }
  }
  h2{
    font-weight: lighter;
    font-size: 4rem;
  }
  h3{
    color: white;
  }
  h4{
    font-weight: bold;
    font-size: 2rem;
  }
  p{
    padding: 3rem 0;
    color: #ccc;
    font-size: 1.4rem;
    line-height: 150%;
  }
  span{
    font-weight: bold;
    color: #23d997; 
  }
  a{
    font-size: 1.1rem;
  }
`;

export default GlobalStyle;
