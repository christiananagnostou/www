import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  :root {
    --accent: #343b45;
    --text: #aeaeae;
    --heading: #cecece;
    --max-w-screen: 800px;
  }

  .max-w-screen {
    width: 100%;
    max-width: var(--max-w-screen);
  }

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
    overflow-x: hidden;
    overflow-y: scroll;
    @media (max-width: 1200px){
      font-size: 95%;
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
    color: var(--heading);
  }
  h4{
    font-weight: bold;
    font-size: 1.5rem;
  }
  p{
    padding: 3rem 0;
    color: var(--text);
    font-size: 1.4rem;
    line-height: 150%;
  }
  span{
    font-weight: bold;
  }
  a{
    font-family: inherit;
    color: inherit;
    text-decoration: underline dashed var(--accent);
    text-underline-offset: 3px;

    &:hover,
    &:active {
      color: var(--accent);
    }
  }
`;

export default GlobalStyle;
