import React from 'react'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { HashRouter, Routes, Route, Navigate } from "react-router-dom"
import { Provider } from 'react-redux'
import { store } from './store'
import Index from './pages/Index'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './components/ProtectedRoute'
import { Toaster } from "@/components/ui/sonner"

const queryClient = new QueryClient()

const App = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <HashRouter>
          <div className="min-h-screen">
            <Routes>
              <Route path="/" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <Toaster />
        </HashRouter>
      </QueryClientProvider>
    </Provider>
  )
}

export default App
