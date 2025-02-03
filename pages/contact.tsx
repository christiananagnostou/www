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
        <title>{PageTitle}</title>
        <meta name="description" content={PageDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={PageUrl} />
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content="contact, Christian Anagnostou, portfolio, inquiries, collaboration" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={PageTitle} />
        <meta property="og:description" content={PageDescription} />
        <meta property="og:url" content={PageUrl} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={PageTitle} />
        <meta name="twitter:description" content={PageDescription} />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getContactStructuredData()) }}
        />
      </Head>

      <ContactStyle variants={pageAnimation} initial="hidden" animate="show" exit="exit">
        <Heading variants={fade}>
          <h1>Contact</h1>
          <p>
            I&apos;d love to hear from you! Whether you have a question, a collaboration idea, or simply want to say
            hello, please drop me a message using the form below.
          </p>
        </Heading>

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
    background: var(--dark-bg);
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
