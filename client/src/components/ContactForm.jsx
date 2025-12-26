import React, { useState } from 'react'

export default function ContactForm() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState(null)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })
  const handleSubmit = e => {
    e.preventDefault()
    setStatus('submitted')
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-2xl max-w-3xl border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input styling: border, padding, focus ring */}
        <input name="firstName" placeholder="First name" value={form.firstName} onChange={handleChange} className="border border-gray-300/70 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-shadow bg-white/70" required />
        <input name="lastName" placeholder="Last name" value={form.lastName} onChange={handleChange} className="border border-gray-300/70 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-shadow bg-white/70" required />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="border border-gray-300/70 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-shadow bg-white/70 md:col-span-2" type="email" required />
        <input name="phone" placeholder="Phone (Optional)" value={form.phone} onChange={handleChange} className="border border-gray-300/70 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-shadow bg-white/70 md:col-span-2" />
        <textarea name="message" placeholder="Your message..." value={form.message} onChange={handleChange} className="border border-gray-300/70 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-shadow bg-white/70 md:col-span-2" rows="5" required></textarea>
      </div>
      {/* Button styling: pronounced color, hover effect */}
      <button type="submit" className="mt-6 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-cyan-700 transition-all duration-200 shadow-lg active:scale-[0.98]">Send Message</button>
      {status === 'submitted' && <p className="mt-3 text-green-600 font-medium">✅ Message submitted (demo only)</p>}
    </form>
  )
}
