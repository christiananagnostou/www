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
    background: #1b1b1b;
    font-family: 'Inter', sans-serif;
    overflow-x: hidden;
  }
  h2{
    font-weight: lighter;
    font-size: 2.5rem;
  }
  h3{
    color: white;
  }
  h4{
    font-weight: bold;
    font-size: 1.5rem;
  }
  p{
    padding: 3rem 0;
    color: #ccc;
    font-size: 1.4rem;
    line-height: 150%;
  }
  span{
    font-weight: bold;
  }
  a{
    font-family: inherit;
    color: inherit;
    text-decoration: underline dashed #4769FF;

    &:hover,
    &:active {
      color: #4769FF;
    }
  }
`;

export default GlobalStyle;
