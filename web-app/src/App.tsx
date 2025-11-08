import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SideBar from "./components/SideBar"
import { useAuth } from './contexts/AuthContext'
import { useUser } from './hooks/useUser'
import { useTransactions } from './hooks/useTransactions'
import AddTransactionModal from './components/AddTransactionModal' 

function App() {
  const { userId, isAuthenticated} = useAuth()
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false) 
  
  useEffect(() => {
  if (!isAuthenticated) navigate('/login')
}, [isAuthenticated, navigate])


  const { data: user, isLoading: userLoading, error: userError } = useUser(userId!)
  const { data: transactions, isLoading: transactionsLoading } = useTransactions(userId!)

  const summary = useMemo(() => {
    if (!transactions) return { income: 0, expenses: 0 }
    
    const income = transactions
      .filter((t: any) => t.type === 'income')
      .reduce((sum: number, t: any) => sum + Number(t.amount), 0)
    
    const expenses = transactions
      .filter((t: any) => t.type === 'expense')
      .reduce((sum: number, t: any) => sum + Number(t.amount), 0)
    
    return { income, expenses }
  }, [transactions])

  if (!isAuthenticated) return null
  if (userLoading || transactionsLoading) return <p>Loading...</p>
  if (userError) return <p>Error loading data. Please try again.</p>

  return (
    <>
      <SideBar/>
      <main>
        <h2>Welcome to WizAllet</h2>
        <p>Your currently status</p>

        <div className="dashboard-content">
          <section>
            <p>Summary</p>
            <ul>
              <li>Balance: ${(Number(user?.initial_balance) + summary.income - summary.expenses).toFixed(2)}</li>
              <li>Income: ${summary.income.toFixed(2)}</li>
              <li>Expenses: ${summary.expenses.toFixed(2)}</li>
            </ul>  


            <button onClick={() => setIsModalOpen(true)}>
              + Add Transaction
            </button>
          </section>

          <section>
            <p>Diagram</p> 
            <img src="https://placehold.co/200x200" alt="Typical placeholder" />
          </section> 
        </div>

        {isModalOpen && (
          <AddTransactionModal onClose={() => setIsModalOpen(false)} />
        )}
      </main>
    </>
  )
}

export default App
