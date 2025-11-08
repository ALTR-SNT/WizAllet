import { useState, useEffect } from 'react'
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom'
import SideBar from "./components/SideBar"
import { useAuth } from './contexts/AuthContext'
import { useUser, useUpdateUser } from './hooks/useUser'

const Settings = () => {
  const { userId, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])
  
  const { data: user, isLoading } = useUser(userId!)
  const { mutate: updateUser, isPending, isSuccess, error } = useUpdateUser()

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const handleLoadUserData = () => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        username: user.username,
        email: user.email,
      }))
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (formData.username && (formData.username.length < 3 || formData.username.length > 30)) {
      errors.username = 'Username must be between 3 and 30 characters'
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format'
    }

    if (formData.newPassword) {
      if (formData.newPassword.length < 8) {
        errors.newPassword = 'Password must be at least 8 characters'
      }
      if (formData.newPassword !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match'
      }
      if (!formData.currentPassword) {
        errors.currentPassword = 'Current password is required to change password'
      }
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    const updateData: any = {}

    if (formData.username && formData.username !== user?.username) {
      updateData.username = formData.username
    }

    if (formData.email && formData.email !== user?.email) {
      updateData.email = formData.email
    }

    if (formData.newPassword) {
      updateData.password = formData.newPassword
      updateData.currentPassword = formData.currentPassword
    }

    if (Object.keys(updateData).length === 0) {
      setFormErrors({ general: 'No changes to save' })
      return
    }

    updateUser(
      { id: userId!, data: updateData },
      {
        onSuccess: () => {
          setFormData(prev => ({
            ...prev,
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          }))
          setFormErrors({})
        },
      }
    )
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  if (!isAuthenticated) {
    return null
  }

  if (isLoading) {
    return (
      <>
        <SideBar/>
        <main>
          <h2>Settings</h2>
          <p>Loading...</p>
        </main>
      </>
    )
  }

  return (
    <>
      <SideBar/>
      <main>
        <h2>Settings</h2>
        <p>Hello, {user?.username}!</p>
        
        <section>
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h3>Profile Information</h3>
              
              {!formData.username && !formData.email && (
                <button 
                  type="button" 
                  onClick={handleLoadUserData}
                  className="load-data-btn"
                >
                  Load current data
                </button>
              )}

              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                  placeholder="Enter new username"
                />
                {formErrors.username && (
                  <span className="error">{formErrors.username}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="Enter new email"
                />
                {formErrors.email && (
                  <span className="error">{formErrors.email}</span>
                )}
              </div>
            </div>

            <div className="form-section">
              <h3>Change Password</h3>
              
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  id="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={(e) => handleChange('currentPassword', e.target.value)}
                  placeholder="Enter current password"
                />
                {formErrors.currentPassword && (
                  <span className="error">{formErrors.currentPassword}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  id="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) => handleChange('newPassword', e.target.value)}
                  placeholder="Enter new password (min 8 characters)"
                />
                {formErrors.newPassword && (
                  <span className="error">{formErrors.newPassword}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  placeholder="Confirm new password"
                />
                {formErrors.confirmPassword && (
                  <span className="error">{formErrors.confirmPassword}</span>
                )}
              </div>
            </div>

            {formErrors.general && (
              <div className="error general-error">{formErrors.general}</div>
            )}
            
            {error && (
              <div className="error general-error">
                Failed to update: {error.message}
              </div>
            )}
            
            {isSuccess && (
              <div className="success">Settings updated successfully!</div>
            )}

            <div className="form-actions">
              <button 
                type="submit" 
                disabled={isPending}
                className="save-btn"
              >
                {isPending ? 'Saving...' : 'Save Changes'}
              </button>
              
              <button 
                type="button" 
                onClick={() => {
                  setFormData({
                    username: '',
                    email: '',
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                  })
                  setFormErrors({})
                }}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      </main>
    </>
  )
}

export default Settings