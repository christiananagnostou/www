import { motion } from 'framer-motion'
import { styled } from 'styled-components'

export const ArticleStyle = styled(motion.section)`
  position: relative;
  max-width: var(--max-w-screen);
  margin: 2rem auto;
  padding: 0 1rem;
  color: var(--text);

  @media (width <= 1000px) {
    padding: 0.5rem 1rem;
  }
`

export const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 4rem;
  font-size: 0.9rem;

  a {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .top-bar__right-side {
    display: flex;
    flex-direction: column;
    align-items: end;
    gap: 0.5rem;

    .top-bar__right-side__buttons {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  }

  @media (width <= 768px) {
    margin-bottom: 3rem;
  }
`

export const TopBarButton = styled(motion.button)`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem;
  border: 1px solid var(--accent);
  border-radius: var(--border-radius-sm);
  background: transparent;
  line-height: 0.7;
  color: inherit;
  cursor: pointer;
  overflow: hidden;

  svg {
    width: 1.25rem;
    min-width: 1.25rem;
    height: 1.25rem;
  }

  span {
    min-width: max-content;
    font-weight: inherit;
  }
`

export const TitleWrap = styled.div`
  left: 1rem;
  border-radius: var(--border-radius-sm);
  text-align: left;

  h1 {
    margin-bottom: 1.5rem;
    font-weight: 500;
    font-size: 2rem;
  }

  @media (width <= 768px) {
    padding: 0;
    h1 {
      font-size: 1.75rem;
    }
  }
`

export const ArticleContent = styled.article`
  position: relative;
  margin: auto;
  text-align: left;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 2rem 0 0.5rem;
    font-weight: normal;
    color: var(--heading);
  }

  h1 {
    margin: 1rem 0;
  }

  p {
    font-weight: 300;
    line-height: 1.8;
    color: var(--text);
  }

  blockquote {
    margin: 1.5em 0;
    padding: 0.5em 1em;
    border-left: 2px solid var(--accent);
    text-align: left;
  }

  blockquote p {
    margin-bottom: 0.5rem !important;
  }

  p:not(:last-child) {
    margin-bottom: 1.5rem;
  }

  strong {
    font-weight: bold;
  }

  hr {
    margin: 1rem auto;
    border: none;
    border-bottom: 1px solid var(--accent);
  }

  code {
    max-width: 100%;
    padding: 3px 5px;
    border-radius: var(--border-radius-sm);
    background-color: rgb(0 0 0 / 20%);
    white-space: pre-wrap;
    word-break: keep-all;
  }

  ul,
  ol {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    margin-left: 0.5rem;
    padding-left: 0.5rem;
    list-style-position: inside;
    line-height: 1.8;

    li {
      font-weight: 300;
      color: var(--text);

      a {
        display: flex;
        justify-content: start;
        align-items: center;
        gap: 5px;
        width: fit-content;
      }

      &::marker {
        margin: 0 1rem;
        font-weight: 300;
        color: var(--text-dark);
      }
    }
  }
  ul {
    list-style: disc;
  }

  nav {
    display: none;
  }

  @media screen and (width >= 1300px) {
    nav {
      position: sticky;
      top: 70px;
      right: 100%;
      display: block;
      float: left;
      width: 220px;
      margin-left: calc(-220px - 2rem);
      padding: 0.5rem;
      border: 1px solid var(--accent);
      border-radius: var(--border-radius-sm);
      background: var(--background);
      box-shadow: 0 2px 8px rgb(0 0 0 / 15%);
      font-size: 0.8em;
    }
    nav ol,
    nav li {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      width: 100%;
      margin: 0;
      padding: 0;
      list-style: none;
      line-height: 1.4;
    }
    nav ol ol {
      margin-left: 0.5rem;
      padding-left: 0.75rem;
      border-left: 1px solid var(--accent);
    }
    nav a {
      padding: 0.3rem 0.5rem;
      border-radius: var(--border-radius-sm);
      color: var(--text);
      text-decoration: none;
      transition:
        background 0.3s ease,
        color 0.3s ease;
    }
    nav a:hover {
      background: var(--accent);
      color: var(--heading);
    }

    /* Hide empty nav */
    nav:has(> ol:empty) {
      display: none;
    }
  }

  img {
    display: block;
    max-width: 100%;
    margin: auto;
    border-radius: var(--border-radius-sm);

    @media (width >= 550px) {
      max-width: 90%;
    }
  }

  /*!
      Theme: StackOverflow Dark
      Description: Dark theme as used on stackoverflow.com
      Author: stackoverflow.com
      Maintainer: @Hirse
      Website: https://github.com/StackExchange/Stacks
      License: MIT
      Updated: 2021-05-15

      Updated for @stackoverflow/stacks v0.64.0
      Code Blocks: /blob/v0.64.0/lib/css/components/_stacks-code-blocks.less
      Colors: /blob/v0.64.0/lib/css/exports/_stacks-constants-colors.less
    */

  code.hljs {
    width: 100%;
    max-width: 100%;
    padding: 3px 5px;
  }
  pre code.hljs {
    display: block;
    padding: 1em;
    overflow-x: auto;
  }

  .hljs {
    margin-bottom: 0.75rem;
    padding: 1rem;
    border-radius: var(--border-radius-sm);

    /* var(--highlight-bg) */
    background: rgb(0 0 0 / 20%);

    /* var(--highlight-color) */
    color: #c9d1d9;
    overflow: auto;
  }

  .hljs-subst {
    /* var(--highlight-color) */
    color: #ffffff;
  }

  .hljs-comment {
    /* var(--highlight-comment) */
    color: #999999;
  }

  .hljs-keyword,
  .hljs-selector-tag,
  .hljs-meta .hljs-keyword,
  .hljs-doctag,
  .hljs-section {
    /* var(--highlight-keyword) */
    color: #88aece;
  }

  .hljs-attr {
    /* var(--highlight-attribute); */
    color: #88aece;
  }

  .hljs-attribute {
    /* var(--highlight-symbol) */
    color: #c59bc1;
  }

  .hljs-name,
  .hljs-type,
  .hljs-number,
  .hljs-selector-id,
  .hljs-quote,
  .hljs-template-tag {
    /* var(--highlight-namespace) */
    color: #f08d49;
  }

  .hljs-selector-class {
    /* var(--highlight-keyword) */
    color: #88aece;
  }

  .hljs-string,
  .hljs-regexp,
  .hljs-symbol,
  .hljs-variable,
  .hljs-template-variable,
  .hljs-link,
  .hljs-selector-attr {
    /* var(--highlight-variable) */
    color: #b5bd68;
  }

  .hljs-meta,
  .hljs-selector-pseudo {
    /* var(--highlight-keyword) */
    color: #88aece;
  }

  .hljs-built_in,
  .hljs-title,
  .hljs-literal {
    /* var(--highlight-literal) */
    color: #f08d49;
  }

  .hljs-bullet,
  .hljs-code {
    /* var(--highlight-punctuation) */
    color: #cccccc;
  }

  .hljs-meta .hljs-string {
    /* var(--highlight-variable) */
    color: #b5bd68;
  }

  .hljs-deletion {
    /* var(--highlight-deletion) */
    color: #de7176;
  }

  .hljs-addition {
    /* var(--highlight-addition) */
    color: #76c490;
  }

  .hljs-emphasis {
    font-style: italic;
  }

  .hljs-strong {
    font-weight: bold;
  }

  .hljs-formula,
  .hljs-operator,
  .hljs-params,
  .hljs-property,
  .hljs-punctuation,
  .hljs-tag {
    /* purposely ignored */
  }

  @media (width <= 1000px) {
    font-size: 90%;
  }
`
