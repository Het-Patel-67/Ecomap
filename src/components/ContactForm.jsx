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
    <form onSubmit={handleSubmit} className="bg-[#d0e1f8d1] rounded-xl p-8 shadow-xl max-w-3xl border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input styling: border, padding, focus ring */}
        <input name="firstName" placeholder="First name" value={form.firstName} onChange={handleChange} className="border border-gray-300 rounded p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow" required />
        <input name="lastName" placeholder="Last name" value={form.lastName} onChange={handleChange} className="border border-gray-300 rounded p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow" required />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="border border-gray-300 rounded p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow md:col-span-2" type="email" required />
        <input name="phone" placeholder="Phone (Optional)" value={form.phone} onChange={handleChange} className="border border-gray-300 rounded p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow md:col-span-2" />
        <textarea name="message" placeholder="Your message..." value={form.message} onChange={handleChange} className="border border-gray-300 rounded p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow md:col-span-2" rows="5" required></textarea>
      </div>
      {/* Button styling: pronounced color, hover effect */}
      <button type="submit" className="mt-6 bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md">Send Message</button>
      {status === 'submitted' && <p className="mt-3 text-green-600 font-medium">✅ Message submitted (demo only)</p>}
    </form>
  )
}
