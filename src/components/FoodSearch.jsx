import { useEffect, useState } from 'react'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function FoodSearch({ onAdd }) {
  const [foods, setFoods] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [custom, setCustom] = useState({ name: '', calories: 0, protein: 0, carbs: 0, fat: 0, serving: '1 serving' })

  const search = async () => {
    setLoading(true)
    const res = await fetch(`${BACKEND}/api/foods?q=${encodeURIComponent(query)}`)
    const data = await res.json()
    setFoods(data)
    setLoading(false)
  }

  const addCustom = async () => {
    const res = await fetch(`${BACKEND}/api/foods`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...custom, source: 'user' }),
    })
    const data = await res.json()
    setCustom({ name: '', calories: 0, protein: 0, carbs: 0, fat: 0, serving: '1 serving' })
    await search()
  }

  return (
    <section className="max-w-6xl mx-auto px-4 mt-6 grid lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm lg:col-span-2">
        <h2 className="font-semibold text-slate-800 mb-3">Search foods</h2>
        <div className="flex gap-2 mb-3">
          <input
            value={query}
            onChange={(e)=>setQuery(e.target.value)}
            placeholder="e.g., chicken breast, rice, apple"
            className="flex-1 px-3 py-2 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button onClick={search} className="px-4 py-2 bg-slate-800 text-white rounded-md">{loading ? 'Searching...' : 'Search'}</button>
        </div>
        <div className="divide-y">
          {foods.map((f, idx) => (
            <div key={f._id || idx} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-medium text-slate-800">{f.name}</div>
                <div className="text-sm text-slate-600">{f.calories} kcal • P {f.protein}g • C {f.carbs}g • F {f.fat}g</div>
              </div>
              <button onClick={() => onAdd(f)} className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded">Add</button>
            </div>
          ))}
          {foods.length === 0 && !loading && (
            <p className="text-slate-600 py-6 text-center">No results yet. Try a search or add a custom food.</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <h2 className="font-semibold text-slate-800 mb-3">Add custom food</h2>
        <div className="grid grid-cols-2 gap-3">
          <input className="input col-span-2" placeholder="Name" value={custom.name} onChange={(e)=>setCustom({...custom,name:e.target.value})} />
          <input className="input" type="number" placeholder="Calories" value={custom.calories} onChange={(e)=>setCustom({...custom,calories:parseFloat(e.target.value||0)})} />
          <input className="input" type="number" placeholder="Protein" value={custom.protein} onChange={(e)=>setCustom({...custom,protein:parseFloat(e.target.value||0)})} />
          <input className="input" type="number" placeholder="Carbs" value={custom.carbs} onChange={(e)=>setCustom({...custom,carbs:parseFloat(e.target.value||0)})} />
          <input className="input" type="number" placeholder="Fat" value={custom.fat} onChange={(e)=>setCustom({...custom,fat:parseFloat(e.target.value||0)})} />
          <input className="input col-span-2" placeholder="Serving" value={custom.serving} onChange={(e)=>setCustom({...custom,serving:e.target.value})} />
        </div>
        <button onClick={addCustom} className="mt-3 w-full bg-slate-800 text-white rounded-md py-2">Save</button>
      </div>
    </section>
  )
}
