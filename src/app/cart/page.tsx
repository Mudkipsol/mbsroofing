import CartPage from '@/components/CartPage'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function Cart() {
  return (
    <ProtectedRoute allowedRoles={['buyer']}>
      <CartPage />
    </ProtectedRoute>
  )
}
