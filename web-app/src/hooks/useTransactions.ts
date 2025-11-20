import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { transactionsAPI } from '../services/api'
import type { Transaction, CreateTransactionRequest, UpdateTransactionRequest } from '../types'
import { useAuth } from '../contexts/AuthContext'

export const useTransactions = (
  userId: number | null,
  options: { enabled?: boolean } = {}
) => {
  const { getToken } = useAuth()

  return useQuery<Transaction[]>({
    queryKey: ['transactions', userId],
    queryFn: () => {
      if (!userId) return []
      return transactionsAPI(getToken()).getTransactions(userId)
    },
    enabled: !!userId && (options.enabled ?? true),
  })
}

export const useCreateTransaction = () => {
  const queryClient = useQueryClient()
  const { getToken } = useAuth()

  return useMutation<Transaction, Error, CreateTransactionRequest>({
    mutationFn: (data) => transactionsAPI(getToken()).createTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })
}

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient()
  const { getToken } = useAuth()

  return useMutation<Transaction, Error, { id: number; data: UpdateTransactionRequest }>({
    mutationFn: ({ id, data }) => transactionsAPI(getToken()).updateTransaction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
  })
}
