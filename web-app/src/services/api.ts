import type { Transaction, CreateTransactionRequest, UpdateTransactionRequest, User } from '../types'

const API_BASE = import.meta.env.VITE_BACKEND_URL

const request = async <T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_BASE}${endpoint}`, { headers, ...options })
  if (!res.ok) {
    const errorData = await res.json().catch(() => null)
    throw new Error(errorData?.message || 'Request failed')
  }
  return res.json() as Promise<T>
}

export const authAPI = () => ({
  register: (data: { username: string; email: string; password: string; initial_balance: number }) =>
    request<{ id: number; username: string; email: string; token: string }>(`/auth/register`, {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  
  login: (data: { username: string; password: string }) =>
    request<{ id: number; username: string; token: string }>(`/auth/login`, {
      method: 'POST',
      body: JSON.stringify(data)
    }),
})

export const userAPI = (token?: string | null) => ({
  getUser: (id: number) => request<User>(`/users/${id}`, {}, token),
  updateUser: (id: number, data: Partial<{ username: string; email: string }>) =>
    request<User>(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) }, token),
})

export const transactionsAPI = (token?: string | null) => ({
  getTransactions: (userId: number) => request<Transaction[]>(`/transactions?userId=${userId}`, {}, token),
  createTransaction: (data: CreateTransactionRequest) =>
    request<Transaction>(`/transactions`, { method: 'POST', body: JSON.stringify(data) }, token),
  updateTransaction: (id: number, data: UpdateTransactionRequest) =>
    request<Transaction>(`/transactions/${id}`, { method: 'PATCH', body: JSON.stringify(data) }, token),
})

