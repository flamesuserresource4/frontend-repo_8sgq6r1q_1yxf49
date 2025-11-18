import { useEffect, useState } from 'react'
import Header from './components/Header'
import ProfilePlanner from './components/ProfilePlanner'
import FoodSearch from './components/FoodSearch'
import DailyLog from './components/DailyLog'

function App() {
  const [email, setEmail] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0,10))
  const [plan, setPlan] = useState(null)

  const handleAddFromSearch = async (food) => {
    // Forward to DailyLog add via custom event
    window.dispatchEvent(new CustomEvent('add-food', { detail: food }))
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header email={email} date={date} onChangeEmail={setEmail} onChangeDate={setDate} />
      <ProfilePlanner email={email} onPlan={setPlan} />
      <FoodSearch onAdd={handleAddFromSearch} />
      {/* DailyLog contains its own controls and listens to add-food? We'll pass a direct handler instead. */}
      <DailyLog email={email} date={date} plan={plan} />
      <footer className="text-center text-sm text-slate-500 py-10">Built with ❤️ Nutri Guide</footer>
    </div>
  )
}

export default App
