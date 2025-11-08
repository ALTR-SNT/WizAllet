import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

export const useUser = (userId: number) => {
  const { getToken } = useAuth()
  const token = getToken()

  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => userAPI(token).getUser(userId),
    enabled: !!userId,
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  const { getToken } = useAuth()
  const token = getToken()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      userAPI(token).updateUser(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] })
    },
  })
}
