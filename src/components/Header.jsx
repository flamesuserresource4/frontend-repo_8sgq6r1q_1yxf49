import { useState } from 'react'

export default function Header({ onChangeEmail, onChangeDate, email, date }) {
  return (
    <header className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Nutri Guide</h1>
          <p className="text-sm text-slate-600">Personalized diet planner and calorie counter</p>
        </div>
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
          <input
            type="email"
            value={email}
            onChange={(e) => onChangeEmail(e.target.value)}
            placeholder="you@example.com"
            className="px-3 py-2 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => onChangeDate(e.target.value)}
            className="px-3 py-2 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>
    </header>
  )
}
