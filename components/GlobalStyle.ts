import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  :root {
    --accent: #303030;
    --text: #bdbdbd;
    --text-dark: #7e7e7e;
    --heading: #d6d6d6;
    --body-bg: #1b1b1b;
    --dark-bg: #141414;
    --nav-height: 50px;
    --max-w-screen: 800px;
    --font-fallback: -apple-system,"BlinkMacSystemFont","Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif;
    --font-serif: "Newsreader","Signifier","Times",serif;
    --font-display: "Inter",var(--font-fallback);
  }

  .max-w-screen {
    width: 100%;
    max-width: var(--max-w-screen);
  }

  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-feature-settings: "kern", "ss02", "ss03", "ss04";

    scrollbar-width: thin;
    scrollbar-color: rgba(155, 155, 155, 0.5) transparent;

    &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background-color: rgba(155, 155, 155, 0.5);
      border-radius: 20px;
      border: transparent;
    }

    ::selection {
      background: rgba(60, 60, 60, 0.5); /* WebKit/Blink Browsers */
    }
    ::-moz-selection {
      background: rgba(60, 60, 60, 0.5); /* Gecko Browsers */
    }
  }

  html{
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    touch-action: manipulation;
    scroll-behavior: smooth;
    scroll-padding-top: 90px;
    overscroll-behavior-y: none;
    overflow-y: scroll;
    font-family: 'Inter', sans-serif;
    @media (max-width: 1200px){
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
    text-underline-offset: 3px;
    transition: all .2s ease;

    &:hover,
    &:active {
      color: var(--heading);
      text-decoration: underline solid var(--text);
    }
  }

  .blur {
    margin-bottom: -96px;
    top: 0;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    pointer-events: none;
    position: fixed;
    width: 100%;
    height: 96px;
    z-index: 1;
    -webkit-backdrop-filter: blur(5px);
    backdrop-filter: blur(5px);
    opacity: .95;
    -webkit-mask-image: linear-gradient(to bottom ,#000000 25%,transparent);
    mask-image: linear-gradient(to bottom ,#000000 25%,transparent);
  }
  .custom-focus:focus {
    outline-color: var(--accent);
    outline-style: solid;
    outline-offset: 2px;
    outline-width: 1.5px;
  }
`

export default GlobalStyle
