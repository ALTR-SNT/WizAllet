export interface User {
  id: number
  username: string
  email: string
  initial_balance: number
  created_at: string
}

export interface Transaction {
  id: number
  user_id: number
  type: 'income' | 'expense'
  amount: number
  note?: string
  created_at: string
}

export interface CreateTransactionRequest {
  amount: number
  note?: string
  type: 'income' | 'expense'
  user_id: number
}

export type UpdateTransactionRequest = Partial<CreateTransactionRequest>
