import React, { useState } from "react";
// Email connection
import emailjs from "emailjs-com";
// Animations
import { motion } from "framer-motion";
import { fade, pageAnimation, staggerFade } from "../../animation";
import styled from "styled-components";
import SocialLinks from "../SocialLinks";

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
      <StyledForm variants={staggerFade} id="contact-form" onSubmit={handleSubmit} method="POST">
        <Title variants={fade}>
          <motion.h2 variants={fade} className="title">
            <span>my dm's</span>
            <span className="bar"></span>
            <span>are open</span>
          </motion.h2>
        </Title>
        {sentSuccessful && <p>Sent successfully. You'll hear from me soon!</p>}

        <motion.div variants={fade}>
          <FormGroup>
            <label htmlFor="name">
              YOUR NAME <span>*</span>
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

        <motion.div variants={fade}>
          <FormGroup>
            <label htmlFor="inputEmail">
              EMAIL ADDRESS <span>*</span>
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

        <motion.div variants={fade}>
          <FormGroup>
            <label htmlFor="subject">SUBJECT</label>
            <input
              type="text"
              className="form-input"
              value={formData.subject}
              onChange={onSubjectChange}
            />
          </FormGroup>
        </motion.div>

        <motion.div variants={fade}>
          <FormGroup>
            <label htmlFor="message">MESSAGE</label>
            <textarea
              className="form-input"
              rows={6}
              cols={50}
              value={formData.message}
              onChange={onMessageChange}
            ></textarea>
          </FormGroup>
        </motion.div>

        <motion.div variants={fade}>
          <FormGroup>
            <button type="submit" className="form-btn">
              SEND
            </button>
          </FormGroup>
        </motion.div>
      </StyledForm>

      <motion.div variants={fade}>
        <SocialLinks />
      </motion.div>
    </ContactStyle>
  );
}

const ContactStyle = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;

  max-width: 500px;
  padding: 0 1rem;
  margin: 1.5rem auto;

  @media screen and (min-width: 768px) {
    margin: 5rem auto;
  }
`;

const Title = styled(motion.div)`
  .title {
    margin-bottom: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    @media screen and (min-width: 768px) {
      margin-bottom: 2rem;
    }

    span {
      font-weight: 200;
      font-size: 0.9rem;
      color: var(--text);
    }

    .bar {
      height: 0;
      flex: 1;
      margin: 0 1rem;
      border-bottom: 1px solid var(--accent);
    }
  }
`;

const StyledForm = styled(motion.form)`
  width: 100%;
`;

const FormGroup = styled.div`
  margin: auto;
  width: 100%;
  max-width: var(--max-w-screen);
  display: flex;
  flex-direction: column;

  label {
    color: var(--text);
    margin: 1rem 0 0.2rem;
  }
  .form-input {
    background: rgba(20, 20, 20, 0.5);
    border: 1px solid var(--accent);

    border-radius: 5px;
    padding: 0.5rem;
    font-size: 1.1rem;
    font-weight: 300;
    color: var(--heading);
    font-family: inherit;
    letter-spacing: 0.5px;

    &:focus {
      outline-color: var(--accent);
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
    padding: 1rem;
    color: var(--heading);
    background: var(--accent);
    border-radius: 5px;
    border: none;
    margin-top: 1rem;
    margin-bottom: 3rem;
    cursor: pointer;
  }
`;

export default ContactUs;
