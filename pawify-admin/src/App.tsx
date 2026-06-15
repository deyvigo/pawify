import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage } from '@/pages/LoginPage'
import { Layout } from '@/components/layout/Layout'
import { PrivateRoute } from '@/components/PrivateRoute'
import { ProfilePage } from '@/pages/ProfilePage'
import { ProductsPage } from '@/pages/ProductsPage'
import { OrdersPage } from '@/pages/OrdersPage'
import { ClaimsPage } from './pages/ClaimsPage'
import { ShippmentPage } from './pages/ShippmentPage'
import { AdminsPage } from './pages/AdminsPage'
import { BuyersPage } from './pages/BuyersPage'
import { StompProvider } from '@/context/stomp-context'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/" element={<Navigate to="/products" replace />} />

        <Route
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/deliveries" element={<ShippmentPage />} />
          <Route
            path="/claims"
            element={
              <StompProvider>
                <ClaimsPage />
              </StompProvider>
            }
          />
          <Route path="/admins" element={<AdminsPage />} />
          <Route path="/buyers" element={<BuyersPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
