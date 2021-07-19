import React, { useState } from "react";
// Email connection
import emailjs from "emailjs-com";
// Animations
import { motion } from "framer-motion";
import { fade, pageAnimation, titleAnim } from "../../animation";
import styled from "styled-components";
import SocialLinks from "../AboutPage/page_components/SocialLinks";

function ContactUs() {
  const initialFormState = {
    name: "",
    email: "",
    subject: "",
    message: "",
  };
  const [formData, setFormData] = useState(initialFormState);
  const [sentSuccessful, setsentSuccessful] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);

    let templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      to_name: "Christian",
      subject: formData.subject,
      message: formData.message,
      site: "coding",
    };

    emailjs
      .send("service_ifvt3ya", "contact_form", templateParams, "user_ibNdYEIIhE1QQOJprE8Mw")
      .then(
        (result) => {
          setFormData(initialFormState);
          setsentSuccessful(true);
        },
        (error) => {
          console.log(error.text);
        }
      );
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
      <Title variants={fade}>
        <Hide>
          <motion.h2 variants={titleAnim}>lets get in touch!</motion.h2>
          <motion.p variants={titleAnim}>
            I like to create things with fun, open-minded peoples, so feel free to drop me line
          </motion.p>
        </Hide>
      </Title>
      <FormContainer>
        {sentSuccessful && <p>Sent successfully. You'll hear from me soon!</p>}

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
                  rows="6"
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
      <Hide>
        <motion.div variants={titleAnim}>
          <SocialLinks />
        </motion.div>
      </Hide>
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

const Title = styled(motion.div)`
  max-width: 90%;
  text-align: center;
  margin: 1rem;
  color: #ccc;
  border-radius: 10px;
  padding: 1rem 2rem;
  background: rgba(20, 20, 20, 0.5);
  box-shadow: 15px 15px 0 rgba(20, 20, 20, 0.9);
  border: 2px solid #4769ff;

  h2,
  p {
    margin: 0;
    padding: 0.5rem 0;
  }
  h2 {
    font-size: 2rem;
  }
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
    background: rgba(20, 20, 20, 0.5);
    box-shadow: 15px 15px 0 rgba(20, 20, 20, 0.9);
    border: 2px solid #4769ff;

    border-radius: 5px;
    padding: 0.5rem;
    font-size: 1.25rem;
    color: white;
    font-family: inherit;
    letter-spacing: 0.5px;

    &:focus {
      outline-color: #4769ff;
      outline-style: solid;
      outline-width: medium;
      outline-offset: -5px;
    }
  }
  textarea {
    resize: none;
    overflow: auto;
    border-radius: 5px;
  }
  .form-btn {
    padding: 0.7rem;
    color: white;
    background: #4769ff;
    border-radius: 10px;
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
