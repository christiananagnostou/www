import emailjs from 'emailjs-com'
import { motion } from 'framer-motion'
import Head from 'next/head'
import { useState } from 'react'
import styled from 'styled-components'
import { fade, pageAnimation, staggerFade } from '../components/animation'
import { Heading } from '../components/Shared/Heading'
import SocialLinks from '../components/SocialLinks'
import { BASE_URL } from '../lib/constants'
import { getContactStructuredData } from '../lib/structured/contact'

const PageTitle = 'Contact | Christian Anagnostou'
const PageDescription = 'Get in touch with Christian Anagnostou for inquiries, collaborations, or just to say hello.'
const PageUrl = `${BASE_URL}/contact`

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
        process.env.NEXT_PUBLIC_EMAILJS_USER_ID
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
        <title>{PageTitle}</title>
        <meta content={PageDescription} name="description" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <link href={PageUrl} rel="canonical" />
        <meta content="index, follow" name="robots" />
        <meta content="contact, Christian Anagnostou, portfolio, inquiries, collaboration" name="keywords" />

        {/* Open Graph */}
        <meta content="website" property="og:type" />
        <meta content={PageTitle} property="og:title" />
        <meta content={PageDescription} property="og:description" />
        <meta content={PageUrl} property="og:url" />

        {/* Twitter Card */}
        <meta content="summary_large_image" name="twitter:card" />
        <meta content={PageTitle} name="twitter:title" />
        <meta content={PageDescription} name="twitter:description" />

        {/* Structured Data */}
        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getContactStructuredData()) }}
          type="application/ld+json"
        />
      </Head>

      <ContactStyle animate="show" exit="exit" initial="hidden" variants={pageAnimation}>
        <Heading variants={fade}>
          <h1>Contact</h1>
          <p>
            I&apos;d love to hear from you! Whether you have a question, a collaboration idea, or simply want to say
            hello, please drop me a message using the form below.
          </p>
        </Heading>

        <StyledForm method="POST" variants={staggerFade} onSubmit={handleSubmit}>
          <motion.div variants={fade}>
            <FormGroup>
              <label htmlFor="name">
                Name <span>*</span>
              </label>
              <input className="form-input custom-focus" id="name" name="name" required type="text" />
            </FormGroup>
          </motion.div>
          <motion.div variants={fade}>
            <FormGroup>
              <label htmlFor="email">Email</label>
              <input className="form-input custom-focus" id="email" name="email" type="email" />
            </FormGroup>
          </motion.div>
          <motion.div variants={fade}>
            <FormGroup>
              <label htmlFor="subject">Subject</label>
              <input autoComplete="off" className="form-input custom-focus" id="subject" name="subject" type="text" />
            </FormGroup>
          </motion.div>
          <motion.div variants={fade}>
            <FormGroup>
              <label htmlFor="message">Message</label>
              <textarea className="form-input custom-focus" id="message" name="message" rows={6} />
            </FormGroup>
          </motion.div>
          <motion.div variants={fade}>
            <FormGroup>
              <button className="form-btn custom-focus" type="submit">
                SEND
              </button>
            </FormGroup>
          </motion.div>
        </StyledForm>

        <p className="success-message" style={{ opacity: sentSuccessful ? 1 : 0 }}>
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
    background: var(--dark-bg);
    border: 1px solid var(--accent);
    border-radius: var(--border-radius-sm);
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
    border-radius: var(--border-radius-sm);
  }
  .form-btn {
    padding: 1rem;
    color: var(--heading);
    background: var(--accent);
    border-radius: var(--border-radius-sm);
    border: none;
    margin-top: 1rem;
    cursor: pointer;
  }
`
