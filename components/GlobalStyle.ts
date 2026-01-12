import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  :root {
    --accent: #303030;
    --text:#bdbdbd;
    --text-dark:#7e7e7e;
    --heading:#d6d6d6;
    --body-bg: #1b1b1b;
    --dark-bg: #141414;
    --nav-height: 50px;
    --max-w-screen: 800px;
    --font-fallback: -apple-system,"BlinkMacSystemFont","Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif;
    --font-serif: "Newsreader","Signifier","Times",serif;
    --font-display: "Inter",var(--font-fallback);
    
    /* Border Radius Variables */
    --border-radius-xs: 2px;
    --border-radius-sm: 4px;
    --border-radius-md: 7px;
    --border-radius-lg: 10px;
    --border-radius-xl: 12px;
    --border-radius-2xl: 14px;
  }

  .max-w-screen {
    width: 100%;
    max-width: var(--max-w-screen);
  }

  *{
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-feature-settings: "kern", "ss02", "ss03", "ss04";
    scrollbar-color: rgb(155 155 155 / 50%) transparent;

    scrollbar-width: thin;

    &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      border: transparent;
      border-radius: 20px;
      background-color: rgb(155 155 155 / 50%);
    }

    ::selection {
      background: rgb(60 60 60 / 50%); /* WebKit/Blink Browsers */
    }
    ::-moz-selection {
      background: rgb(60 60 60 / 50%); /* Gecko Browsers */
    }
  }

  html{
    font-family: 'Inter', sans-serif;
    overflow-y: scroll;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overscroll-behavior-y: none;
    scroll-behavior: smooth;
    scroll-padding-top: 90px;
    text-rendering: optimizeLegibility;
    touch-action: manipulation;

    @media (width <= 1200px){
      font-size: 95%;
    }
  }

  body{
    min-height: 100vh;
    background: var(--body-bg);
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: var(--heading);
  }

  p{
    color: var(--text);
  }
  span{
    font-weight: bold;
  }
  a{
    font-family: inherit;
    color: inherit;
    text-decoration: underline solid var(--accent);
    transition: all .2s ease;
    text-underline-offset: 3px;

    &:hover,
    &:active {
      color: var(--heading);
      text-decoration: underline solid var(--text);
    }
  }

  .blur {
    position: fixed;
    top: 0;
    z-index: 1;
    width: 100%;
    height: 96px;
    margin-bottom: -96px;
    opacity: .95;
    pointer-events: none;
    user-select: none;
    backdrop-filter: blur(5px);
    mask-image: linear-gradient(to bottom ,#000000 25%,transparent);
  }
  .custom-focus:focus {
    outline: var(--accent) solid 1.5px;
    outline-offset: 2px;
  }
`

export default GlobalStyle
