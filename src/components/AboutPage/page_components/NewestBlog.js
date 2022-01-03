import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { blogs } from "../../../cms/blogs";

function LatestBlog() {
  const [selectedPost, setSelectedPost] = useState(blogs[0]);

  return (
    <StyledSection>
      <TileList>
        <h2>Latest Blog Posts</h2>
        {blogs.map((blog, i) => (
          <Tile onClick={() => setSelectedPost(blog)} selected={blog.slug === selectedPost.slug}>
            <h3>{blog.title}</h3>
            <p>{blog.snippet}</p>
            <Link to={`/blog/${blog.slug}`}>View Post</Link>
          </Tile>
        ))}
      </TileList>

      <BlogSnippet>
        <h3>TL;DR</h3>
        <h4>{selectedPost.title}</h4>
        <p>{selectedPost.summary}</p>
      </BlogSnippet>
    </StyledSection>
  );
}
export default LatestBlog;

const StyledSection = styled.section`
  margin: 3rem auto;
  display: flex;
  width: 100%;

  h2 {
    font-weight: 500;
    margin-bottom: 1rem;
  }
`;

const TileList = styled.div`
  width: 50%;
`;

const Tile = styled.div.attrs((props) => props)`
  width: 100%;
  margin-bottom: 1rem;
  padding: 1rem;
  padding: ${(props) => (props.selected ? "1rem 1.5rem" : "1rem")};
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  transition: all 0.2s ease;
  cursor: pointer;
  border: ${(props) => (props.selected ? "1px solid #6DA5EA" : "1px solid white")};

  &:hover {
    border: 1px solid ${(props) => (props.selected ? "#6DA5EA" : "#1b1b1b")};
  }

  h3 {
    font-weight: 400;
    font-size: 1.2rem;
  }
  p {
    padding: 0.25rem 0;
    font-weight: 200;
    line-height: 1.75rem;
  }

  a {
    width: fit-content;
  }
  @media (max-width: 1000px) {
  }
`;

const BlogSnippet = styled.div`
  padding: 2rem 1rem;
  width: 50%;
  height: 100%;

  h3 {
    font-weight: 300;
  }

  h4 {
    margin: 1rem 2rem;
    font-weight: 500;
  }

  p {
    margin: 1rem;
    line-height: 1.75rem;
  }
`;
