import { useEffect, useState } from 'react'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function DailyLog({ email, date, plan }) {
  const [log, setLog] = useState({ entries: [], totals: { calories: 0, protein: 0, carbs: 0, fat: 0 } })

  const fetchLog = async () => {
    if (!email || !date) return
    const res = await fetch(`${BACKEND}/api/log/${encodeURIComponent(email)}/${date}`)
    const data = await res.json()
    setLog(data)
  }

  useEffect(() => { fetchLog() }, [email, date])

  const addEntry = async (food) => {
    if (!email || !date) return
    const payload = {
      email,
      date,
      entry: {
        name: food.name,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat,
        quantity: 1,
        meal_type: 'breakfast',
      }
    }
    await fetch(`${BACKEND}/api/log/entry`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    await fetchLog()
  }

  const deleteEntry = async (index) => {
    await fetch(`${BACKEND}/api/log/entry`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, date, index }) })
    await fetchLog()
  }

  const progress = (value, target) => {
    if (!target || target === 0) return 0
    return Math.min(100, Math.round((value / target) * 100))
  }

  return (
    <section className="max-w-6xl mx-auto px-4 mt-6 grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <h2 className="font-semibold text-slate-800 mb-3">Today's log</h2>
        <div className="divide-y">
          {log.entries && log.entries.length > 0 ? (
            log.entries.map((e, idx) => (
              <div key={idx} className="flex items-center justify-between py-3">
                <div>
                  <div className="font-medium text-slate-800">{e.name}</div>
                  <div className="text-sm text-slate-600">{e.calories} kcal • P {e.protein}g • C {e.carbs}g • F {e.fat}g</div>
                </div>
                <button onClick={() => deleteEntry(idx)} className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded">Remove</button>
              </div>
            ))
          ) : (
            <p className="text-slate-600 py-6 text-center">No entries yet. Add items from the search panel.</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <h2 className="font-semibold text-slate-800 mb-3">Summary</h2>
        <Summary label="Calories" value={log?.totals?.calories || 0} unit="kcal" target={plan?.goal_calories} />
        <Summary label="Protein" value={log?.totals?.protein || 0} unit="g" target={plan?.protein_g} />
        <Summary label="Carbs" value={log?.totals?.carbs || 0} unit="g" target={plan?.carbs_g} />
        <Summary label="Fat" value={log?.totals?.fat || 0} unit="g" target={plan?.fat_g} />
      </div>
    </section>
  )
}

function Summary({ label, value, unit, target }) {
  const pct = Math.min(100, Math.round(((value || 0) / (target || 1)) * 100))
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm text-slate-700 mb-1">
        <span>{label}</span>
        <span>{Math.round(value)} {unit} / {Math.round(target || 0)} {unit}</span>
      </div>
      <div className="h-2 bg-slate-100 rounded">
        <div className="h-full bg-emerald-600 rounded" style={{ width: `${pct}%` }}></div>
      </div>
    </div>
  )
}
