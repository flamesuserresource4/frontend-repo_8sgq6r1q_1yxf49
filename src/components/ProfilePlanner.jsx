import { useEffect, useState } from 'react'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function ProfilePlanner({ email, onPlan }) {
  const [form, setForm] = useState({
    email: email || '',
    name: '',
    age: 30,
    gender: 'male',
    height_cm: 175,
    weight_kg: 70,
    activity_level: 'moderate',
    goal: 'maintain',
  })

  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setForm((f) => ({ ...f, email }))
  }, [email])

  const submit = async (e) => {
    e.preventDefault()
    if (!form.email) return
    setLoading(true)
    const res = await fetch(`${BACKEND}/api/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    setPlan(data)
    onPlan && onPlan(data)
    setLoading(false)
  }

  return (
    <section className="max-w-6xl mx-auto px-4 mt-6 grid md:grid-cols-2 gap-6">
      <form onSubmit={submit} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <h2 className="font-semibold text-slate-800 mb-3">Your profile</h2>
        <div className="grid grid-cols-2 gap-3">
          <input className="input" placeholder="Email" type="email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} required />
          <input className="input" placeholder="Name" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} />
          <input className="input" placeholder="Age" type="number" value={form.age} onChange={(e)=>setForm({...form,age:parseInt(e.target.value||0)})} />
          <select className="input" value={form.gender} onChange={(e)=>setForm({...form,gender:e.target.value})}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <input className="input" placeholder="Height (cm)" type="number" value={form.height_cm} onChange={(e)=>setForm({...form,height_cm:parseFloat(e.target.value||0)})} />
          <input className="input" placeholder="Weight (kg)" type="number" value={form.weight_kg} onChange={(e)=>setForm({...form,weight_kg:parseFloat(e.target.value||0)})} />
          <select className="input col-span-2" value={form.activity_level} onChange={(e)=>setForm({...form,activity_level:e.target.value})}>
            <option value="sedentary">Sedentary</option>
            <option value="light">Light</option>
            <option value="moderate">Moderate</option>
            <option value="active">Active</option>
            <option value="very_active">Very Active</option>
          </select>
          <select className="input col-span-2" value={form.goal} onChange={(e)=>setForm({...form,goal:e.target.value})}>
            <option value="lose">Lose</option>
            <option value="maintain">Maintain</option>
            <option value="gain">Gain</option>
          </select>
        </div>
        <button disabled={loading} className="mt-3 w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-md py-2">
          {loading ? 'Calculating...' : 'Save & Get Plan'}
        </button>
      </form>

      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <h2 className="font-semibold text-slate-800 mb-3">Daily targets</h2>
        {plan ? (
          <div className="grid grid-cols-2 gap-3 text-slate-700">
            <Stat label="Calories (goal)" value={`${plan.goal_calories} kcal`} />
            <Stat label="Maintenance" value={`${plan.maintenance_calories} kcal`} />
            <Stat label="Protein" value={`${plan.protein_g} g`} />
            <Stat label="Carbs" value={`${plan.carbs_g} g`} />
            <Stat label="Fat" value={`${plan.fat_g} g`} />
          </div>
        ) : (
          <p className="text-slate-600">Fill your profile and get your personalized daily targets.</p>
        )}
      </div>
    </section>
  )
}

function Stat({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <div className="text-xs uppercase text-slate-500">{label}</div>
      <div className="text-lg font-semibold text-slate-800">{value}</div>
    </div>
  )
}
