import { useState, type FormEvent } from "react"
import { useAuth } from "../contexts/AuthContext"
import type { Transaction } from "../types"
import { useUpdateTransaction } from "../hooks/useTransactions"

interface EditTransactionModalProps {
  transaction: Transaction
  onClose: () => void
}

export default function EditTransactionModal({ transaction, onClose }: EditTransactionModalProps) {
  const [amount, setAmount] = useState<number>(Number(transaction.amount))
  const [type, setType] = useState<'income' | 'expense'>(transaction.type)
  const [note, setNote] = useState<string>(transaction.note || "")
  const { userId } = useAuth()
  const updateTransaction = useUpdateTransaction()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!userId) return

    updateTransaction.mutate(
      { id: transaction.id, data: { amount, type, note, user_id: userId } },
      {
        onSuccess: () => onClose(),
        onError: (err: any) => console.error("Failed to update transaction:", err),
      }
    )
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Edit Transaction</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Amount:
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              required
            />
          </label>

          <label>
            Type:
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'income' | 'expense')}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </label>

          <label>
            Note:
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </label>

          <div className="buttons">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}
