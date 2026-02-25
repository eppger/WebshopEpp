import { useForm } from 'react-hook-form'
import { useState, useRef } from 'react'
import { Button, Form } from 'react-bootstrap'
import emailjs from '@emailjs/browser'

const EMAILJS_SERVICE_ID = 'service_7mrcqz4'
const EMAILJS_TEMPLATE_ID = 'template_2pvrt5u'
const EMAILJS_PUBLIC_KEY = 'q97RWkC39YsVC3nYW'

function ContactUs() {
  const [submitted, setSubmitted] = useState(false)
  const [sendError, setSendError] = useState(false)
  const formRef = useRef()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: { name: '', email: '', subject: '', message: '' }
  })

  const messageValue = watch('message', '')

  const onSubmit = async (data, e) => {
    setSendError(false)
    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current,
        { publicKey: EMAILJS_PUBLIC_KEY }
      )
      setSubmitted(true)
      reset()
    } catch (error) {
      console.error('EmailJS error:', error)
      setSendError(true)
    }
  }

  return (
    <div className="page-wrapper">
      <div className="d-flex gap-5 align-items-start flex-wrap flex-lg-nowrap">

        {/* Vasak pool — tekst + illustratsioon */}
        <div style={{ flex: 1, minWidth: '260px' }}>
          <h2 className="page-title mb-2">Get in touch</h2>
          <p style={{ color: '#6b7280', fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '28px' }}>
            Have a question, feedback, or just want to say hello?
            We'd love to hear from you. Our team usually responds within one business day.
          </p>

          {/* Info kaardid */}
          <div className="d-flex flex-column gap-3">
            {[
              { icon: '📍', label: 'Visit us', value: 'Karja 17, Haapsalu' },
              { icon: '📞', label: 'Call us', value: '+372 5678 9012' },
              { icon: '✉️', label: 'Email us', value: 'hello@webshop.ee' },
              { icon: '🕐', label: 'Working hours', value: 'Mon–Fri, 9:00–18:00' },
            ].map(item => (
              <div key={item.label} className="d-flex align-items-center gap-3">
                <div style={{
                  width: '42px', height: '42px',
                  borderRadius: '10px',
                  backgroundColor: '#eff6ff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.1rem', flexShrink: 0
                }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#111', fontWeight: '500' }}>
                    {item.value}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Illustratsioon */}
          <div style={{ marginTop: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '7rem', lineHeight: 1, marginBottom: '12px' }}>💌</div>
            <p style={{ color: '#9ca3af', fontSize: '0.85rem', fontStyle: 'italic' }}>
              "Every message matters to us."
            </p>
          </div>
        </div>

        {/* Parem pool — vorm */}
        <div style={{ width: '480px', flexShrink: 0 }}>
          <div className="section-card">

            {submitted ? (
              <div className="text-center py-4">
                <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🎉</div>
                <h5 style={{ fontWeight: '700', color: '#111', marginBottom: '8px' }}>
                  Message sent!
                </h5>
                <p style={{ color: '#6b7280', marginBottom: '24px' }}>
                  Thank you for reaching out. We'll get back to you soon.
                </p>
                <Button variant="outline-primary" size="sm" onClick={() => setSubmitted(false)}>
                  Send another message
                </Button>
              </div>
            ) : (
              <>
                <h5 style={{ fontWeight: '700', color: '#111', marginBottom: '4px' }}>
                  Send us a message
                </h5>
                <p style={{ color: '#6b7280', fontSize: '0.88rem', marginBottom: '24px' }}>
                  Fill in the form below and we'll be in touch.
                </p>

                {sendError && (
                  <div className="alert alert-danger mb-3" role="alert">
                    ❌ Sending failed. Please try again later.
                  </div>
                )}

                <Form ref={formRef} onSubmit={handleSubmit(onSubmit)} noValidate>

                  {/* Nimi + Email kõrvuti */}
                  <div className="d-flex gap-3 flex-wrap">
                    <Form.Group style={{ flex: 1, minWidth: '180px' }} className="mb-3">
                      <Form.Label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>
                        Your name <span style={{ color: '#ef4444' }}>*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Jane Doe"
                        isInvalid={!!errors.name}
                        {...register('name', {
                          required: 'Name is required',
                          minLength: { value: 2, message: 'At least 2 characters' }
                        })}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.name?.message}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group style={{ flex: 1, minWidth: '180px' }} className="mb-3">
                      <Form.Label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>
                        Email address <span style={{ color: '#ef4444' }}>*</span>
                      </Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="jane@example.com"
                        isInvalid={!!errors.email}
                        {...register('email', {
                          required: 'Email is required',
                          pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' }
                        })}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>

                  {/* Teema */}
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>
                      Subject <span style={{ color: '#ef4444' }}>*</span>
                    </Form.Label>
                    <Form.Select
                      isInvalid={!!errors.subject}
                      {...register('subject', { required: 'Please select a subject' })}
                    >
                      <option value="">Select a topic...</option>
                      <option value="order">Order inquiry</option>
                      <option value="return">Return / refund</option>
                      <option value="product">Product question</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.subject?.message}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Sõnum */}
                  <Form.Group className="mb-4">
                    <div className="d-flex justify-content-between">
                      <Form.Label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>
                        Message <span style={{ color: '#ef4444' }}>*</span>
                      </Form.Label>
                      <span style={{ fontSize: '0.78rem', color: messageValue.length > 450 ? '#ef4444' : '#9ca3af' }}>
                        {messageValue.length}/500
                      </span>
                    </div>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      placeholder="Tell us how we can help you..."
                      isInvalid={!!errors.message}
                      style={{ resize: 'none' }}
                      {...register('message', {
                        required: 'Message is required',
                        minLength: { value: 10, message: 'At least 10 characters' },
                        maxLength: { value: 500, message: 'Max 500 characters' }
                      })}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.message?.message}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Nupud */}
                  <div className="d-flex gap-2 justify-content-end">
                    <Button
                      variant="outline-secondary"
                      type="button"
                      onClick={() => reset()}
                    >
                      Clear
                    </Button>
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={isSubmitting}
                      style={{ minWidth: '130px' }}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Sending...
                        </>
                      ) : (
                        '✉️ Send message'
                      )}
                    </Button>
                  </div>

                </Form>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default ContactUs