import { motion } from 'framer-motion'
import { styled } from 'styled-components'

export const ArticleStyle = styled(motion.section)`
  color: var(--text);
  max-width: var(--max-w-screen);
  padding: 0 1rem;
  margin: 2rem auto;
  position: relative;

  @media (max-width: 1000px) {
    padding: 0.5rem 1rem;
  }
`

export const TopBar = styled.div`
  display: flex;
  align-items: start;
  justify-content: space-between;
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

  @media (max-width: 768px) {
    margin-bottom: 3rem;
  }
`

export const CopyButton = styled(motion.button)`
  border: none;
  background: transparent;
  border: 1px solid var(--accent);
  color: inherit;
  padding: 0.25rem;
  border-radius: 3px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  line-height: 0.7;
  overflow: hidden;

  svg {
    width: 1.25rem;
    height: 1.25rem;
    min-width: 1.25rem;
  }

  span {
    font-weight: inherit;
    min-width: max-content;
  }
`

export const TitleWrap = styled.div`
  left: 1rem;
  border-radius: 5px;
  text-align: left;

  h1 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
    font-weight: 500;
  }

  @media (max-width: 768px) {
    padding: 0;
    h1 {
      font-size: 1.75rem;
    }
  }
`

export const ArticleContent = styled.article`
  text-align: left;
  margin: auto;
  position: relative;

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
    border-left: 2px solid var(--accent);
    margin: 1.5em 0;
    padding: 0.5em 1em;
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

  ul,
  ol {
    padding-left: 0.5rem;
    margin-left: 0.5rem;
    margin-bottom: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    line-height: 1.8;
    list-style-position: inside;

    li {
      color: var(--text);
      font-weight: 300;

      a {
        display: flex;
        align-items: center;
        justify-content: start;
        width: fit-content;
        gap: 5px;
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

  @media screen and (min-width: 1300px) {
    nav {
      display: block;
      position: sticky;
      top: 70px;
      right: 100%;
      padding: 0.5rem;
      background: var(--background);
      border: 1px solid var(--accent);
      border-radius: 5px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      width: 220px;
      font-size: 0.8em;
      float: left;
      margin-left: calc(-220px - 2rem);
    }
    nav ol,
    nav li {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      line-height: 1.4;
      width: 100%;
    }
    nav ol ol {
      padding-left: 0.75rem;
      border-left: 1px solid var(--accent);
      margin-left: 0.5rem;
    }
    nav a {
      text-decoration: none;
      color: var(--text);
      padding: 0.3rem 0.5rem;
      border-radius: 4px;
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
    border-radius: 5px;
    max-width: 100%;
    display: block;
    margin: auto;

    @media (min-width: 550px) {
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
    padding: 3px 5px;
    width: 100%;
    max-width: 100%;
  }
  pre code.hljs {
    display: block;
    overflow-x: auto;
    padding: 1em;
  }

  .hljs {
    /* var(--highlight-color) */
    color: #c9d1d9;
    /* var(--highlight-bg) */
    background: rgba(0, 0, 0, 0.2);
    padding: 1rem;
    border-radius: 5px;
    overflow: auto;
    margin-bottom: 0.75rem;
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

  @media (max-width: 1000px) {
    font-size: 90%;
  }
`
