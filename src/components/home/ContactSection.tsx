import { useId, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import doctor from '@/data/doctor.json'
import { Button } from '@/components/ui/Button'
import { InstagramIcon } from '@/components/ui/InstagramIcon'
import { Switch } from '@/components/ui/Switch'
import { useToast } from '@/lib/hooks/useToast'
import { useLocale } from '@/lib/hooks/useLocale'

type ContactMethod = 'phone' | 'email'

type FormState = {
  name: string
  phone: string
  email: string
  message: string
}

const initialForm: FormState = { name: '', phone: '', email: '', message: '' }

export function ContactSection() {
  const { t } = useTranslation('contact')
  const { t: th } = useTranslation('home')
  const locale = useLocale()
  const { push } = useToast()

  const [method, setMethod] = useState<ContactMethod>('phone')
  const [form, setForm] = useState<FormState>(initialForm)
  const [submitting, setSubmitting] = useState(false)

  const switchOptions = [
    { value: 'phone', label: t('form.switchToPhone') },
    { value: 'email', label: t('form.switchToEmail') },
  ] as const

  const validate = (): string | null => {
    if (!form.name.trim()) return t('form.validation.nameRequired')
    if (method === 'phone' && !form.phone.trim())
      return t('form.validation.phoneRequired')
    if (method === 'email' && !form.email.trim())
      return t('form.validation.emailRequired')
    if (!form.message.trim()) return t('form.validation.messageRequired')
    return null
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const error = validate()
    if (error) {
      push(error, 'error')
      return
    }
    setSubmitting(true)
    window.setTimeout(() => {
      setSubmitting(false)
      setForm(initialForm)
      push(t('form.successToast'), 'success')
    }, 900)
  }

  const whatsappNumber = doctor.whatsapp.replace(/[^\d]/g, '')
  const whatsappMessage =
    doctor.whatsappMessage[locale] ?? doctor.whatsappMessage.tr ?? ''
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`
  const mapsUrl = `https://www.google.com/maps?q=${doctor.coordinates.lat},${doctor.coordinates.lng}`
  const mapsEmbed = `https://www.google.com/maps?q=${doctor.coordinates.lat},${doctor.coordinates.lng}&hl=${locale}&z=15&output=embed`

  return (
    <section id="contact" className="bg-trust-50/40 py-20 md:py-28">
      <div className="container-page">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold text-trust-700 md:text-4xl">
            {th('contact.heading')}
          </h2>
          <p className="mt-4 text-trust-700/70">{th('contact.lede')}</p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex h-full flex-col rounded-3xl bg-white p-6 ring-1 ring-trust-100 md:p-8"
          >
            <h3 className="font-display text-xl font-semibold text-trust-700">
              {t('form.title')}
            </h3>
            <p className="mt-2 text-sm text-trust-700/70">{t('form.lede')}</p>

            <div className="mt-6">
              <span className="block text-sm font-medium text-trust-700">
                {t('form.preferredContact')}
              </span>
              <Switch
                className="mt-2"
                value={method}
                onChange={(v) => setMethod(v as ContactMethod)}
                ariaLabel={t('form.preferredContact')}
                options={switchOptions}
              />
            </div>

            <div className="mt-5 flex flex-1 flex-col gap-4">
              <Field
                label={t('form.name.label')}
                placeholder={t('form.name.placeholder')}
                value={form.name}
                onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                type="text"
                required
              />
              {method === 'phone' ? (
                <Field
                  label={t('form.phone.label')}
                  placeholder={t('form.phone.placeholder')}
                  value={form.phone}
                  onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
                  type="tel"
                  required
                />
              ) : (
                <Field
                  label={t('form.email.label')}
                  placeholder={t('form.email.placeholder')}
                  value={form.email}
                  onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                  type="email"
                  required
                />
              )}
              <FieldTextarea
                label={t('form.message.label')}
                placeholder={t('form.message.placeholder')}
                value={form.message}
                onChange={(v) => setForm((f) => ({ ...f, message: v }))}
              />
            </div>

            <div className="mt-6 flex justify-end">
              <Button type="submit" disabled={submitting}>
                {submitting ? t('form.submitting') : t('form.submit')}
              </Button>
            </div>
          </form>

          <div className="flex flex-col gap-4">
            <div className="rounded-3xl bg-white p-6 ring-1 ring-trust-100 md:p-8">
              <h3 className="font-display text-lg font-semibold text-trust-700">
                {t('addressLabel')}
              </h3>
              <div className="mt-3 flex items-start gap-3 text-sm text-trust-800/85">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0 text-trust-600"
                  aria-hidden
                />
                <span>
                  {doctor.address.street}
                  <br />
                  {doctor.address.postalCode} {doctor.address.city}
                  <br />
                  {doctor.address.country}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-trust-600" aria-hidden />
                <a
                  href={`tel:${doctor.phone}`}
                  className="text-trust-700 hover:underline"
                >
                  {doctor.phoneDisplay}
                </a>
              </div>
              <div className="mt-2 flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-trust-600" aria-hidden />
                <a
                  href={`mailto:${doctor.email}`}
                  className="text-trust-700 hover:underline"
                >
                  {doctor.email}
                </a>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href={doctor.social.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-trust-50 px-4 py-2 text-sm font-medium text-trust-700 transition-colors hover:bg-trust-100"
                >
                  <InstagramIcon className="h-4 w-4" />
                  {t('social.instagramLabel')}
                </a>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1fbf5a]"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden />
                  {t('social.whatsappLabel')}
                </a>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-trust-100">
              <iframe
                src={mapsEmbed}
                title={`${doctor.address.city}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-56 w-full border-0 sm:h-64 md:h-72 lg:h-96"
              />
              <div className="border-t border-trust-100 px-5 py-3 text-right text-xs">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-trust-700 hover:underline"
                >
                  {t('openInMaps')} ↗
                </a>
              </div>
            </div>

            <div className="rounded-3xl bg-trust-700 p-6 text-paper md:p-8">
              <h3 className="font-display text-lg font-semibold">
                {t('international.title')}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-paper/80">
                {t('international.body')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

type FieldProps = {
  label: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  type: string
  required?: boolean
}

function Field({ label, placeholder, value, onChange, type, required }: FieldProps) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-trust-700">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="mt-1.5 w-full rounded-xl border border-trust-200 bg-paper px-4 py-2.5 text-sm text-trust-900 placeholder:text-trust-700/40 focus-visible:border-trust-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-trust-500/20"
      />
    </div>
  )
}

type FieldTextareaProps = Omit<FieldProps, 'type' | 'required'>

function FieldTextarea({ label, placeholder, value, onChange }: FieldTextareaProps) {
  const id = useId()
  return (
    <div className="flex flex-1 flex-col">
      <label htmlFor={id} className="block text-sm font-medium text-trust-700">
        {label}
      </label>
      <textarea
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="mt-1.5 w-full flex-1 resize-none rounded-xl border border-trust-200 bg-paper px-4 py-2.5 text-sm text-trust-900 placeholder:text-trust-700/40 focus-visible:border-trust-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-trust-500/20"
      />
    </div>
  )
}
