import React from 'react'
import { Leaf, Activity, Layers, BarChart3, Globe2, Sparkles } from 'lucide-react'

export default function LearnMore({ onBack }) {
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
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow">Learn More about Ecomap</h1>
            <p className="mt-3 text-white/90 max-w-2xl">Understand the mission, how the platform helps, and how we visualize environmental data to drive action.</p>
            <button onClick={onBack} className="mt-6 px-5 py-3 rounded-xl bg-white text-emerald-700 font-semibold hover:bg-emerald-50 active:scale-[0.98] transition-all shadow-md">Back to Home</button>
          </div>
          <div className="hidden md:flex items-center justify-center">
            <div className="h-28 w-28 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md shadow-lg">
              <Globe2 className="w-12 h-12" />
            </div>
          </div>
        </div>
      </section>

      {/* What is the project */}
      <section className="mt-10 grid md:grid-cols-3 gap-6">
        {[
          { icon: <Leaf className="w-6 h-6" />, title: 'What is Ecomap?', text: 'Ecomap is a visualization platform that maps air, water, and land pollution indicators, combining live feeds and historical archives into an intuitive interface.' },
          { icon: <Activity className="w-6 h-6" />, title: 'Why it helps', text: 'By surfacing trends and risks on a map, Ecomap helps communities, researchers, and policymakers make informed decisions and respond faster to environmental threats.' },
          { icon: <Layers className="w-6 h-6" />, title: 'How it visualizes', text: 'Layer-based maps display different pollution domains. Animations and gradients reflect intensity, while tooltips and filters offer granular insights.' },
        ].map((card, idx) => (
          <div key={idx} className="relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100 overflow-hidden">
            <div className="absolute -inset-0.5 bg-gradient-to-tr from-emerald-400 via-blue-400 to-cyan-400 opacity-10 blur-xl" aria-hidden="true"></div>
            <div className="relative">
              <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 shadow-sm">
                {card.icon}
              </div>
              <h3 className="mt-3 font-semibold text-gray-900">{card.title}</h3>
              <p className="mt-1 text-gray-600 text-sm leading-relaxed">{card.text}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Visualization explainer */}
      <section className="mt-10 grid md:grid-cols-2 gap-6 items-stretch">
        <div className="relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="absolute inset-0 pointer-events-none rounded-2xl shimmer opacity-30"></div>
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-600" /> Data Sources & Layers
          </h3>
          <ul className="mt-3 text-gray-600 text-sm space-y-2 list-disc list-inside">
            <li>Live sensors and curated open datasets for air, water, and land.</li>
            <li>Historical archives for year-over-year comparisons.</li>
            <li>Layer controls to toggle domains and refine land risk types.</li>
          </ul>
        </div>
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-6 shadow-lg overflow-hidden">
          <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-emerald-400/30 blur-3xl animate-float-slow" aria-hidden="true"></div>
          <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-cyan-400/30 blur-3xl animate-float-fast" aria-hidden="true"></div>
          <div className="relative">
            <h3 className="font-semibold flex items-center gap-2"><Sparkles className="w-5 h-5" /> Visual Language</h3>
            <p className="mt-2 text-white/85 text-sm">Gradients and motion communicate intensity and change. Larger radii and brighter hues indicate stronger signals, while subtle animations hint at live updates.</p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {['Low', 'Medium', 'High'].map((label, i) => (
                <div key={label} className="rounded-xl p-4 text-center shadow-inner border border-white/10" style={{
                  background: i===0 ? 'linear-gradient(135deg, rgba(16,185,129,0.25), rgba(34,211,238,0.15))' : i===1 ? 'linear-gradient(135deg, rgba(16,185,129,0.5), rgba(34,211,238,0.35))' : 'linear-gradient(135deg, rgba(16,185,129,0.8), rgba(34,211,238,0.6))'
                }}>
                  <span className="text-sm">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}


