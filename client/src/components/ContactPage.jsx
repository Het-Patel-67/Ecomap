import React from 'react'
import { Mail, Phone, MapPin, Users, Sparkles } from 'lucide-react'
import ContactForm from './ContactForm'

export default function ContactPage({ onBack }) {
  return (
    <div className="relative">
      {/* Background accents */}
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-emerald-300/30 blur-3xl animate-float-slow" aria-hidden="true"></div>
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-cyan-300/30 blur-3xl animate-float-fast" aria-hidden="true"></div>

      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-cyan-600 text-white p-10 md:p-14 shadow-xl">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,white,transparent_35%),radial-gradient(circle_at_80%_30%,white,transparent_35%),radial-gradient(circle_at_50%_80%,white,transparent_35%)]"></div>
        <div className="relative flex items-start md:items-center justify-between gap-6 flex-col md:flex-row">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow">Contact Us</h1>
            <p className="mt-3 text-white/90 max-w-2xl">We would love to hear from you. Send a message or reach out via the details below.</p>
            <button onClick={onBack} className="mt-6 px-5 py-3 rounded-xl bg-white text-emerald-700 font-semibold hover:bg-emerald-50 active:scale-[0.98] transition-all shadow-md">Back to Home</button>
          </div>
          <div className="hidden md:flex items-center justify-center">
            <div className="h-28 w-28 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md shadow-lg">
              <Sparkles className="w-12 h-12" />
            </div>
          </div>
        </div>
      </section>

      {/* Developer info (mock) */}
      <section className="mt-10 grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2"><Users className="w-5 h-5 text-emerald-600" /> About the Developer</h3>
          <p className="mt-2 text-gray-600 text-sm leading-relaxed">
            Developed by <strong>Enivronmental Management Team</strong>. Replace this section with your bio, mission, and a brief note about why you created Ecomap.
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2"><Mail className="w-5 h-5 text-emerald-600" /> Email</h3>
          <p className="mt-2 text-gray-600 text-sm">ecopmap@gmail.com</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2"><Phone className="w-5 h-5 text-emerald-600" /> Phone</h3>
          <p className="mt-2 text-gray-600 text-sm">+1212173314</p>
        </div>
      </section>

      {/* Contact form */}
      <section className="mt-10">
        <ContactForm />
      </section>
    </div>
  )
}


