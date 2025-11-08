import { useState, type FormEvent } from "react"
import { useCreateTransaction } from "../hooks/useTransactions"
import { useAuth } from "../contexts/AuthContext"

interface AddTransactionModalProps {
  onClose: () => void
}

export default function AddTransactionModal({ onClose }: AddTransactionModalProps) {
  const [amount, setAmount] = useState('')
  const [type, setType] = useState<'income' | 'expense'>('income')
  const [note, setNote] = useState('')
  const [error, setError] = useState<string | null>(null)

  const { userId } = useAuth()
  const createTransaction = useCreateTransaction()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const parsedAmount = Number(amount)
    if (!userId) {
      setError("User not authenticated.")
      return
    }
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Enter a valid amount greater than 0.")
      return
    }

    try {
      await createTransaction.mutateAsync({
        amount: parsedAmount,
        type,
        note: note.trim(),
        user_id: userId,
      })
      onClose()
    } catch (err: any) {
      console.error(err)
      setError("Failed to add transaction.")
    }
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Add Transaction</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Amount:
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0.01"
              step="0.01"
              required
            />
          </label>

          <label>
            Note:
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional note"
            />
          </label>

          <label>
            Type:
            <select value={type} onChange={(e) => setType(e.target.value as 'income' | 'expense')}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </label>

          {error && <p className="error">{error}</p>}

          <div className="buttons">
            <button type="submit">Add</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}
