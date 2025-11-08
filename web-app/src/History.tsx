import { useMemo, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SideBar from "./components/SideBar"
import { useAuth } from './contexts/AuthContext'
import { useTransactions } from './hooks/useTransactions'
import EditTransactionModal from './components/EditTransactionModal'
import type { Transaction } from './types'

const History = () => {
  const { userId, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [editingTx, setEditingTx] = useState<Transaction | null>(null)

  useEffect(() => {
    if (!isAuthenticated) navigate('/login')
  }, [isAuthenticated, navigate])

  const { data: transactions, isLoading, error } = useTransactions(Number(userId))

  const sortedTransactions = useMemo(() => {
    if (!transactions) return []
    return [...transactions].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  }, [transactions])

  if (!isAuthenticated) return null

  return (
    <>
      <SideBar />
      <main>
        <h2>History</h2>
        {isLoading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
        {!isLoading && !error && (
          <section>
            {!sortedTransactions.length ? (
              <p>No transactions yet.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTransactions.map(t => (
                    <tr key={t.id}>
                      <td>{new Date(t.created_at).toLocaleDateString('uk-UA')}</td>
                      <td>{t.type === 'income' ? 'Income' : 'Expense'}</td>
                      <td className={t.type === 'income' ? 'income' : 'expense'}>
                        {t.type === 'income' ? '+' : '-'}${Number(t.amount).toFixed(2)}
                      </td>
                      <td><button onClick={() => setEditingTx(t)}>Edit</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        )}

        {editingTx && (
          <EditTransactionModal
            transaction={editingTx}
            onClose={() => setEditingTx(null)}
          />
        )}
      </main>
    </>
  )
}

export default History
