import React, { useState } from "react";
// Animations
import { motion } from "framer-motion";
import { pageAnimation, titleAnim } from "../../animation";
import styled from "styled-components";

function ContactUs() {
  const initialState = {
    name: "",
    email: "",
    subject: "",
    message: "",
  };
  const [formData, setFormData] = useState(initialState);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const onNameChange = (e) => {
    setFormData({ ...formData, name: e.target.value });
  };

  const onEmailChange = (e) => {
    setFormData({ ...formData, email: e.target.value });
  };
  const onSubjectChange = (e) => {
    setFormData({ ...formData, subject: e.target.value });
  };

  const onMessageChange = (e) => {
    setFormData({ ...formData, message: e.target.value });
  };

  return (
    <ContactStyle variants={pageAnimation} initial="hidden" animate="show" exit="exit">
      <Title>
        <Hide>
          <motion.h2 variants={titleAnim}>Get in touch</motion.h2>
        </Hide>
      </Title>
      <FormContainer>
        <form id="contact-form" onSubmit={handleSubmit} method="POST">
          <Hide>
            <motion.div variants={titleAnim}>
              <FormGroup>
                <label htmlFor="name">
                  YOUR NAME <span>(required)</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={formData.name}
                  onChange={onNameChange}
                />
              </FormGroup>
            </motion.div>
          </Hide>
          <Hide>
            <motion.div variants={titleAnim}>
              <FormGroup>
                <label htmlFor="inputEmail">
                  EMAIL ADDRESS <span>(required)</span>
                </label>
                <input
                  type="email"
                  className="form-input"
                  aria-describedby="email"
                  value={formData.email}
                  onChange={onEmailChange}
                />
              </FormGroup>
            </motion.div>
          </Hide>
          <Hide>
            <motion.div variants={titleAnim}>
              <FormGroup>
                <label htmlFor="subject">SUBJECT</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.subject}
                  onChange={onSubjectChange}
                />
              </FormGroup>{" "}
            </motion.div>
          </Hide>
          <Hide>
            <motion.div variants={titleAnim}>
              <FormGroup>
                <label htmlFor="message">MESSAGE</label>
                <textarea
                  className="form-input"
                  rows="10"
                  cols="50"
                  value={formData.message}
                  onChange={onMessageChange}
                ></textarea>
              </FormGroup>
            </motion.div>
          </Hide>
          <Hide>
            <motion.div variants={titleAnim}>
              <FormGroup>
                <button type="submit" className="form-btn">
                  SEND
                </button>
              </FormGroup>
            </motion.div>
          </Hide>
        </form>
      </FormContainer>
    </ContactStyle>
  );
}

const ContactStyle = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 90vh;
`;

const Title = styled.div`
  margin-bottom: 2rem;
  color: #505050;
  @media (max-width: 1300px) {
    margin-bottom: 1rem;
    margin-top: -4rem;
  }
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50%;
  color: rgb(106, 106, 106);
  @media (max-width: 1300px) {
    width: 100%;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  label {
    color: grey;
    margin: 1rem 0 0.2rem;
  }
  .form-input {
    border: 1px solid grey;
    border-radius: 2px;
    padding: 0.5rem;
    font-size: 1.25rem;
    color: rgb(67, 67, 67);
    font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande", "Lucida Sans Unicode",
      Geneva, Verdana, sans-serif;
    letter-spacing: 1px;
  }
  textarea {
    resize: none;
    overflow: auto;
  }
  .form-btn {
    padding: 0.7rem;
    color: white;
    background: rgb(89, 154, 154);
    border: none;
    margin-top: 1rem;
    cursor: pointer;
  }
  @media (max-width: 1300px) {
    width: 90%;
    margin: auto;
    .form-input {
      width: 100%;
    }
  }
`;

const Hide = styled.div`
  overflow: hidden;
`;
export default ContactUs;
