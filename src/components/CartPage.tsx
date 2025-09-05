'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Trash2, Plus, Minus, Calendar as CalendarIcon, MapPin, Truck } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useCart } from '@/context/CartContext'
import Link from 'next/link'

interface CartItem {
  id: string
  name: string
  brand: string
  price: number
  quantity: number
  unit: string
}

interface DeliveryInfo {
  date: Date | undefined
  address: string
  city: string
  state: string
  zipCode: string
  contactName: string
  contactPhone: string
  notes: string
}

export default function CartPage() {
  const { items: cartItems, updateQuantity, removeFromCart, clearCart } = useCart()

  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
    date: undefined,
    address: '',
    city: '',
    state: '',
    zipCode: '',
    contactName: '',
    contactPhone: '',
    notes: ''
  })

  const [showDeliveryScheduling, setShowDeliveryScheduling] = useState(false)
  const [quantityInputs, setQuantityInputs] = useState<{[key: string]: string}>({})

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * 0.08 // 8% tax
  const deliveryFee = 75.00
  const total = subtotal + tax + deliveryFee

  const handleScheduleDelivery = () => {
    // TODO: Implement actual order submission
    console.log('Order submitted:', { cartItems, deliveryInfo, total })
    alert('Order submitted successfully! You will receive a confirmation email shortly.')
    clearCart()
    setShowDeliveryScheduling(false)
  }

  const handleQuantityInputChange = (itemId: string, value: string) => {
    setQuantityInputs(prev => ({ ...prev, [itemId]: value }))
  }

  const handleQuantityInputSubmit = (itemId: string) => {
    const newQuantity = parseInt(quantityInputs[itemId])
    if (!isNaN(newQuantity) && newQuantity > 0) {
      updateQuantity(itemId, newQuantity)
    }
    // Clear the input state for this item
    setQuantityInputs(prev => {
      const newState = { ...prev }
      delete newState[itemId]
      return newState
    })
  }

  const isDeliveryInfoComplete =
    deliveryInfo.date &&
    deliveryInfo.address &&
    deliveryInfo.city &&
    deliveryInfo.state &&
    deliveryInfo.zipCode &&
    deliveryInfo.contactName &&
    deliveryInfo.contactPhone

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <ShoppingCart className="w-8 h-8 mr-3" />
            Shopping Cart
          </h1>
          <p className="text-gray-600 mt-2">Review your order and schedule delivery</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {cartItems.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-600 mb-6">Add some products to get started</p>
              <Button className="mbs-red mbs-red-hover" asChild>
                <Link href="/inventory">Continue Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Order Items ({cartItems.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600">{item.brand}</p>
                        <p className="text-sm text-gray-500">${item.price.toFixed(2)} / {item.unit}</p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>

                          <Input
                            type="number"
                            min="1"
                            value={quantityInputs[item.id] !== undefined ? quantityInputs[item.id] : item.quantity}
                            onChange={(e) => handleQuantityInputChange(item.id, e.target.value)}
                            onBlur={() => handleQuantityInputSubmit(item.id)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleQuantityInputSubmit(item.id)
                              }
                            }}
                            className="w-16 text-center h-8"
                          />

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>

                        <div className="text-right min-w-[80px]">
                          <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Delivery Scheduling */}
              {showDeliveryScheduling && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Truck className="w-5 h-5 mr-2" />
                      Schedule Delivery
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Calendar */}
                    <div>
                      <Label className="text-base font-semibold mb-3 block">Select Delivery Date</Label>
                      <Calendar
                        mode="single"
                        selected={deliveryInfo.date}
                        onSelect={(date) => setDeliveryInfo(prev => ({ ...prev, date }))}
                        disabled={(date) => date < new Date() || date.getDay() === 0} // Disable past dates and Sundays
                        className="rounded-md border"
                      />
                    </div>

                    {/* Delivery Address */}
                    <div className="space-y-4">
                      <Label className="text-base font-semibold">Delivery Address</Label>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <Label htmlFor="address">Street Address</Label>
                          <Input
                            id="address"
                            placeholder="123 Main Street"
                            value={deliveryInfo.address}
                            onChange={(e) => setDeliveryInfo(prev => ({ ...prev, address: e.target.value }))}
                          />
                        </div>

                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            placeholder="Youngstown"
                            value={deliveryInfo.city}
                            onChange={(e) => setDeliveryInfo(prev => ({ ...prev, city: e.target.value }))}
                          />
                        </div>

                        <div>
                          <Label htmlFor="state">State</Label>
                          <Select value={deliveryInfo.state} onValueChange={(value) => setDeliveryInfo(prev => ({ ...prev, state: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="OH">Ohio</SelectItem>
                              <SelectItem value="PA">Pennsylvania</SelectItem>
                              <SelectItem value="WV">West Virginia</SelectItem>
                              <SelectItem value="KY">Kentucky</SelectItem>
                              <SelectItem value="IN">Indiana</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="zipCode">ZIP Code</Label>
                          <Input
                            id="zipCode"
                            placeholder="44503"
                            value={deliveryInfo.zipCode}
                            onChange={(e) => setDeliveryInfo(prev => ({ ...prev, zipCode: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4">
                      <Label className="text-base font-semibold">Contact Information</Label>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="contactName">Contact Name</Label>
                          <Input
                            id="contactName"
                            placeholder="John Smith"
                            value={deliveryInfo.contactName}
                            onChange={(e) => setDeliveryInfo(prev => ({ ...prev, contactName: e.target.value }))}
                          />
                        </div>

                        <div>
                          <Label htmlFor="contactPhone">Phone Number</Label>
                          <Input
                            id="contactPhone"
                            type="tel"
                            placeholder="(555) 123-4567"
                            value={deliveryInfo.contactPhone}
                            onChange={(e) => setDeliveryInfo(prev => ({ ...prev, contactPhone: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Delivery Notes */}
                    <div>
                      <Label htmlFor="notes">Special Instructions (Optional)</Label>
                      <Textarea
                        id="notes"
                        placeholder="Any special delivery instructions..."
                        value={deliveryInfo.notes}
                        onChange={(e) => setDeliveryInfo(prev => ({ ...prev, notes: e.target.value }))}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (8%):</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee:</span>
                      <span>${deliveryFee.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {!showDeliveryScheduling ? (
                      <Button
                        onClick={() => setShowDeliveryScheduling(true)}
                        className="w-full mbs-red mbs-red-hover"
                      >
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        Schedule Delivery
                      </Button>
                    ) : (
                      <Button
                        onClick={handleScheduleDelivery}
                        disabled={!isDeliveryInfoComplete}
                        className="w-full mbs-red mbs-red-hover"
                      >
                        <Truck className="w-4 h-4 mr-2" />
                        Confirm Order
                      </Button>
                    )}

                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/inventory">Continue Shopping</Link>
                    </Button>
                  </div>

                  {/* Order Status */}
                  <div className="pt-4 border-t">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Badge variant="outline" className="mr-2">
                          <MapPin className="w-3 h-3 mr-1" />
                          Delivery Area
                        </Badge>
                        <span className="text-sm text-gray-600">5-State Region</span>
                      </div>

                      {deliveryInfo.date && (
                        <div className="flex items-center">
                          <Badge className="mr-2 bg-green-500">
                            <CalendarIcon className="w-3 h-3 mr-1" />
                            Scheduled
                          </Badge>
                          <span className="text-sm text-gray-600">
                            {deliveryInfo.date.toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
    <Footer />
    </>
  )
}
