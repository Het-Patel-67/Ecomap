import React from 'react'

const cards = [
  { title: 'User-Friendly', desc: 'Clear visuals and maps for all users.', icon: '💡' },
  { title: 'Real-Time Data', desc: 'Live updates for pollution and weather.', icon: '⏱️' },
  { title: 'Community Focus', desc: 'Data accessible to NGOs & authorities.', icon: '🤝' },
  { title: 'Actionable Insights', desc: 'Eco-solutions to mitigate effects.', icon: '🌱' }
]

export default function WhyCards() {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 ">
      {cards.map(c => (
        // Use a light-colored border and shadow on hover for interaction
        <div key={c.title} className="bg-[#d0e1f8d1] border-t-4 border-blue-500 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="text-3xl mb-3">{c.icon}</div>
          <h3 className="font-bold text-lg mb-2 text-gray-800">{c.title}</h3>
          <p className="text-sm text-gray-600">{c.desc}</p>
        </div>
      ))}
    </div>
  )
}