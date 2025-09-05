import InventoryPage from '@/components/InventoryPage'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function Inventory() {
  return (
    <ProtectedRoute allowedRoles={['buyer', 'supplier']}>
      <InventoryPage />
    </ProtectedRoute>
  )
}
