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
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
      const userId = process.env.NEXT_PUBLIC_EMAILJS_USER_ID

      if (!serviceId || !templateId) {
        console.error('Missing EmailJS configuration')
        return
      }

      const res = await emailjs.send(serviceId, templateId, data, userId)
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
  margin: 2rem auto;
  padding: 0 1rem;

  .success-message {
    width: 100%;
    margin-bottom: 2rem;
    text-align: center;
    transition: opacity 0.3s ease;
  }
`

const StyledForm = styled(motion.form)`
  width: 100%;
  margin-top: -1rem;
  margin-bottom: 2rem;
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: var(--max-w-screen);
  margin: auto;

  label {
    margin: 1rem 0 0.2rem;
    color: var(--text);
  }
  .form-input {
    padding: 0.5rem;
    border: 1px solid var(--accent);
    border-radius: var(--border-radius-sm);
    background: var(--dark-bg);
    font-weight: 300;
    font-size: 1.1rem;
    font-family: inherit;
    color: var(--heading);
    letter-spacing: 0.5px;
  }
  textarea {
    border-radius: var(--border-radius-sm);
    overflow: auto;
    resize: vertical;
  }
  .form-btn {
    margin-top: 1rem;
    padding: 1rem;
    border: none;
    border-radius: var(--border-radius-sm);
    background: var(--accent);
    color: var(--heading);
    cursor: pointer;
  }
`
