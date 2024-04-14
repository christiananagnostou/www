import emailjs from 'emailjs-com'
import { motion } from 'framer-motion'
import Head from 'next/head'
import { useState } from 'react'
import styled from 'styled-components'
import { fade, pageAnimation, staggerFade } from '../components/animation'
import SocialLinks from '../components/SocialLinks'
import PageTitle from '../components/Styles/PageTitle'

const Contact = () => {
  const [sentSuccessful, setSentSuccessful] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget as HTMLFormElement
    const formData = new FormData(form)
    const data = {
      to_name: 'Christian',
      from_name: formData.get('name'),
      from_email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message'),
      site: 'christiancodes.co',
    }

    if (!data.from_name) return // Ensuring name is not empty

    try {
      const res = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        data,
        process.env.NEXT_PUBLIC_EMAILJS_USER_ID!
      )
      if (res.status === 200) {
        form.reset() // Resetting the form fields
        setSentSuccessful(true)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <Head>
        <title>Contact</title>
        <meta name="description" content="Christian Anagnostou's Web Portfolio" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <ContactStyle variants={pageAnimation} initial="hidden" animate="show" exit="exit">
        <PageTitle
          titleLeft={sentSuccessful ? 'you are' : 'send me'}
          titleRight={sentSuccessful ? 'the goat' : 'an email'}
        />

        <StyledForm variants={staggerFade} onSubmit={handleSubmit} method="POST">
          <motion.div variants={fade}>
            <FormGroup>
              <label htmlFor="name">
                Name <span>*</span>
              </label>
              <input id="name" name="name" type="text" className="form-input custom-focus" required />
            </FormGroup>
          </motion.div>
          <motion.div variants={fade}>
            <FormGroup>
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" className="form-input custom-focus" />
            </FormGroup>
          </motion.div>
          <motion.div variants={fade}>
            <FormGroup>
              <label htmlFor="subject">Subject</label>
              <input id="subject" name="subject" type="text" className="form-input custom-focus" autoComplete="off" />
            </FormGroup>
          </motion.div>
          <motion.div variants={fade}>
            <FormGroup>
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" className="form-input custom-focus" rows={6}></textarea>
            </FormGroup>
          </motion.div>
          <motion.div variants={fade}>
            <FormGroup>
              <button type="submit" className="form-btn custom-focus">
                SEND
              </button>
            </FormGroup>
          </motion.div>
        </StyledForm>

        <p style={{ opacity: sentSuccessful ? 1 : 0 }} className="success-message">
          Sent successfully. You&apos;ll hear from me soon!
        </p>

        <motion.div variants={fade}>
          <SocialLinks />
        </motion.div>
      </ContactStyle>
    </>
  )
}

export default Contact

const ContactStyle = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;

  max-width: 500px;
  padding: 0 1rem;
  margin: 2rem auto;

  .success-message {
    transition: opacity 0.3s ease;
    text-align: center;
    width: 100%;
    margin-bottom: 2rem;
  }
`

const StyledForm = styled(motion.form)`
  width: 100%;
  margin-bottom: 2rem;
  margin-top: -1rem;
`

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
    background: var(--bg);
    border: 1px solid var(--accent);

    border-radius: 5px;
    padding: 0.5rem;
    font-size: 1.1rem;
    font-weight: 300;
    color: var(--heading);
    font-family: inherit;
    letter-spacing: 0.5px;
  }
  textarea {
    resize: vertical;
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
    cursor: pointer;
  }
`
