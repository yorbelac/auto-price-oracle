import React from 'react'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { HashRouter, Routes, Route, Navigate } from "react-router-dom"

const queryClient = new QueryClient()

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <div className="app">
          <h1>Auto Price Oracle</h1>
          <Routes>
            <Route path="/" element={<div>Home Page</div>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </HashRouter>
    </QueryClientProvider>
  )
}

export default App
