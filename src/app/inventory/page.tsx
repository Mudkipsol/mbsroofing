'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Eye,
  Package,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';

// Define categories in the specific order requested
const CATEGORIES = [
  { id: 'shingles', name: 'Shingles', hasSubcategories: true, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600' },
  { id: 'underlayment', name: 'Underlayment', hasSubcategories: false, image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600' },
  { id: 'hip-ridge', name: 'Hip and Ridge Cap', hasSubcategories: true, image: 'https://images.unsplash.com/photo-1632478023417-22e475dbc5bd?w=600' },
  { id: 'ice-water', name: 'Ice and Water', hasSubcategories: false, image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600' },
  { id: 'drip-edge', name: 'Drip Edge and Gutter Apron', hasSubcategories: false, image: 'https://images.unsplash.com/photo-1614564079675-2c8395264878?w=600' },
  { id: 'ventilation', name: 'Ventilation', hasSubcategories: false, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600' },
  { id: 'flashings', name: 'Flashings', hasSubcategories: false, image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600' },
  { id: 'accessories', name: 'Accessories', hasSubcategories: false, image: 'https://images.unsplash.com/photo-1632478023417-22e475dbc5bd?w=600' },
  { id: 'nails', name: 'Nails', hasSubcategories: false, image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600' },
  { id: 'paint-caulking', name: 'Paint and Caulking', hasSubcategories: false, image: 'https://images.unsplash.com/photo-1614564079675-2c8395264878?w=600' },
  { id: 'valley-metal', name: 'Valley Metal', hasSubcategories: false, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600' }
];

// Manufacturers for Shingles and Hip & Ridge
const MANUFACTURERS = {
  shingles: [
    { id: 'certainteed', name: 'CERTAINTEED', description: 'Shop all CertainTeed shingle products', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600' },
    { id: 'atlas', name: 'ATLAS', description: 'Shop all Atlas shingle products', image: 'https://images.unsplash.com/photo-1632478023417-22e475dbc5bd?w=600' }
  ],
  'hip-ridge': [
    { id: 'certainteed', name: 'CERTAINTEED', description: 'Shop all CertainTeed hip & ridge products', image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600' },
    { id: 'atlas', name: 'ATLAS', description: 'Shop all Atlas hip & ridge products', image: 'https://images.unsplash.com/photo-1614564079675-2c8395264878?w=600' }
  ]
};

// Product types by manufacturer
const PRODUCT_TYPES = {
  certainteed: [
    { id: 'landmark', name: 'CERTAINTEED LANDMARK', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600' },
    { id: 'landmark-pro', name: 'CERTAINTEED LANDMARK PRO', image: 'https://images.unsplash.com/photo-1632478023417-22e475dbc5bd?w=600' }
  ],
  atlas: [
    { id: 'prolam', name: 'ATLAS PROLAM', image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600' },
    { id: 'pinnacle', name: 'ATLAS PINNACLE', image: 'https://images.unsplash.com/photo-1614564079675-2c8395264878?w=600' }
  ]
};

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  stock: number;
  image: string;
  description: string;
  sku: string;
  category: string;
  manufacturer?: string;
  productType?: string;
  color?: string;
  specifications?: string;
}

export default function InventoryPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart, items: cartItems } = useCart();

  // Navigation state
  const [currentView, setCurrentView] = useState('categories'); // categories, manufacturers, productTypes, products
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedManufacturer, setSelectedManufacturer] = useState<string | null>(null);
  const [selectedProductType, setSelectedProductType] = useState<string | null>(null);
  const [breadcrumb, setBreadcrumb] = useState<string[]>(['Categories']);

  // Product and UI state
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editPassword, setEditPassword] = useState('');

  // Load products from localStorage or set defaults
  useEffect(() => {
    const savedProducts = localStorage.getItem('mbs-inventory');
    if (savedProducts) {
      const parsed = JSON.parse(savedProducts);
      setProducts(parsed);
      setFilteredProducts(parsed);
    } else {
      // Default sample products organized by hierarchy
      const defaultProducts: Product[] = [
        // CERTAINTEED LANDMARK Products (Color Options)
        {
          id: '1',
          name: 'CERTAINTEED LANDMARK - Charcoal Black',
          brand: 'CERTAINTEED',
          price: 125.99,
          stock: 450,
          image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
          description: 'Premium architectural shingles with superior protection in Charcoal Black',
          sku: 'CTL-CB-001',
          category: 'shingles',
          manufacturer: 'certainteed',
          productType: 'landmark',
          color: 'Charcoal Black',
          specifications: 'Class A fire rating, 130 mph wind warranty'
        },
        {
          id: '2',
          name: 'CERTAINTEED LANDMARK - Weathered Wood',
          brand: 'CERTAINTEED',
          price: 125.99,
          stock: 325,
          image: 'https://images.unsplash.com/photo-1632478023417-22e475dbc5bd?w=600',
          description: 'Premium architectural shingles with superior protection in Weathered Wood',
          sku: 'CTL-WW-001',
          category: 'shingles',
          manufacturer: 'certainteed',
          productType: 'landmark',
          color: 'Weathered Wood',
          specifications: 'Class A fire rating, 130 mph wind warranty'
        },
        {
          id: '3',
          name: 'CERTAINTEED LANDMARK - Driftwood',
          brand: 'CERTAINTEED',
          price: 125.99,
          stock: 275,
          image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600',
          description: 'Premium architectural shingles with superior protection in Driftwood',
          sku: 'CTL-DW-001',
          category: 'shingles',
          manufacturer: 'certainteed',
          productType: 'landmark',
          color: 'Driftwood',
          specifications: 'Class A fire rating, 130 mph wind warranty'
        },
        // CERTAINTEED LANDMARK PRO Products (Color Options)
        {
          id: '4',
          name: 'CERTAINTEED LANDMARK PRO - Charcoal Black',
          brand: 'CERTAINTEED',
          price: 145.99,
          stock: 200,
          image: 'https://images.unsplash.com/photo-1614564079675-2c8395264878?w=600',
          description: 'Professional grade architectural shingles in Charcoal Black',
          sku: 'CTLP-CB-001',
          category: 'shingles',
          manufacturer: 'certainteed',
          productType: 'landmark-pro',
          color: 'Charcoal Black',
          specifications: 'Class A fire rating, 150 mph wind warranty, Enhanced granule adhesion'
        },
        {
          id: '5',
          name: 'CERTAINTEED LANDMARK PRO - Weathered Wood',
          brand: 'CERTAINTEED',
          price: 145.99,
          stock: 150,
          image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
          description: 'Professional grade architectural shingles in Weathered Wood',
          sku: 'CTLP-WW-001',
          category: 'shingles',
          manufacturer: 'certainteed',
          productType: 'landmark-pro',
          color: 'Weathered Wood',
          specifications: 'Class A fire rating, 150 mph wind warranty, Enhanced granule adhesion'
        },
        // ATLAS PROLAM Products (Color Options)
        {
          id: '6',
          name: 'ATLAS PROLAM - Storm Gray',
          brand: 'ATLAS',
          price: 115.99,
          stock: 0,
          image: 'https://images.unsplash.com/photo-1632478023417-22e475dbc5bd?w=600',
          description: 'Durable laminated shingles for all climates in Storm Gray',
          sku: 'APL-SG-001',
          category: 'shingles',
          manufacturer: 'atlas',
          productType: 'prolam',
          color: 'Storm Gray',
          specifications: 'Scotchgard protection, HP42 technology'
        },
        {
          id: '7',
          name: 'ATLAS PROLAM - Weathered Wood',
          brand: 'ATLAS',
          price: 115.99,
          stock: 320,
          image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600',
          description: 'Durable laminated shingles for all climates in Weathered Wood',
          sku: 'APL-WW-001',
          category: 'shingles',
          manufacturer: 'atlas',
          productType: 'prolam',
          color: 'Weathered Wood',
          specifications: 'Scotchgard protection, HP42 technology'
        },
        // ATLAS PINNACLE Products (Color Options)
        {
          id: '8',
          name: 'ATLAS PINNACLE - Sunset Brick',
          brand: 'ATLAS',
          price: 135.99,
          stock: 180,
          image: 'https://images.unsplash.com/photo-1614564079675-2c8395264878?w=600',
          description: 'Premium impact-resistant shingles in Sunset Brick',
          sku: 'APN-SB-001',
          category: 'shingles',
          manufacturer: 'atlas',
          productType: 'pinnacle',
          color: 'Sunset Brick',
          specifications: 'Class 4 impact rating, SBS modified asphalt'
        },
        {
          id: '9',
          name: 'ATLAS PINNACLE - Storm Gray',
          brand: 'ATLAS',
          price: 135.99,
          stock: 220,
          image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
          description: 'Premium impact-resistant shingles in Storm Gray',
          sku: 'APN-SG-001',
          category: 'shingles',
          manufacturer: 'atlas',
          productType: 'pinnacle',
          color: 'Storm Gray',
          specifications: 'Class 4 impact rating, SBS modified asphalt'
        },
        // Underlayment Products (Direct category products)
        {
          id: '10',
          name: 'Synthetic Underlayment Roll',
          brand: 'Various',
          price: 89.99,
          stock: 150,
          image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600',
          description: 'High-performance synthetic underlayment',
          sku: 'UND-SYN-001',
          category: 'underlayment',
          specifications: '10 sq rolls, 180-day UV protection'
        },
        {
          id: '11',
          name: 'Felt Underlayment #30',
          brand: 'Various',
          price: 45.99,
          stock: 200,
          image: 'https://images.unsplash.com/photo-1632478023417-22e475dbc5bd?w=600',
          description: 'Traditional felt underlayment #30 grade',
          sku: 'UND-FELT-001',
          category: 'underlayment',
          specifications: '36" x 144 ft rolls, ASTM D226 Type II'
        }
      ];
      setProducts(defaultProducts);
      setFilteredProducts(defaultProducts);
      localStorage.setItem('mbs-inventory', JSON.stringify(defaultProducts));
    }
  }, []);

  // Handle navigation
  const handleCategoryClick = (category: typeof CATEGORIES[0]) => {
    setSelectedCategory(category.id);

    if (category.hasSubcategories) {
      setCurrentView('manufacturers');
      setBreadcrumb(['Categories', category.name]);
    } else {
      // Show products directly for categories without subcategories
      setCurrentView('products');
      setBreadcrumb(['Categories', category.name]);
      const categoryProducts = products.filter(p => p.category === category.id);
      setFilteredProducts(categoryProducts);
    }
  };

  const handleManufacturerClick = (manufacturer: { id: string; name: string; description: string; image: string }) => {
    setSelectedManufacturer(manufacturer.id);
    setCurrentView('productTypes');
    const categoryName = CATEGORIES.find(c => c.id === selectedCategory)?.name || '';
    setBreadcrumb(['Categories', categoryName, manufacturer.name]);
  };

  const handleProductTypeClick = (productType: { id: string; name: string; image: string }) => {
    setSelectedProductType(productType.id);
    setCurrentView('products');
    const categoryName = CATEGORIES.find(c => c.id === selectedCategory)?.name || '';
    const manufacturerName = MANUFACTURERS[selectedCategory as keyof typeof MANUFACTURERS]?.find(m => m.id === selectedManufacturer)?.name || '';
    setBreadcrumb(['Categories', categoryName, manufacturerName, productType.name]);

    // Filter products by category, manufacturer, and product type
    const typeProducts = products.filter(p =>
      p.category === selectedCategory &&
      p.manufacturer === selectedManufacturer &&
      p.productType === selectedProductType
    );
    setFilteredProducts(typeProducts);
  };

  const handleBackNavigation = () => {
    if (currentView === 'products' && selectedProductType) {
      setCurrentView('productTypes');
      setSelectedProductType(null);
      setBreadcrumb(breadcrumb.slice(0, -1));
    } else if (currentView === 'productTypes') {
      setCurrentView('manufacturers');
      setSelectedManufacturer(null);
      setBreadcrumb(breadcrumb.slice(0, -1));
    } else if (currentView === 'manufacturers') {
      setCurrentView('categories');
      setSelectedCategory(null);
      setBreadcrumb(['Categories']);
    } else if (currentView === 'products' && !selectedProductType) {
      setCurrentView('categories');
      setSelectedCategory(null);
      setBreadcrumb(['Categories']);
      setFilteredProducts(products);
    }
  };

  // Rest of the component logic remains the same...
  const handleQuantityChange = (productId: string, change: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 1) + change)
    }));
  };

  const handleAddToCart = (product: Product) => {
    const quantity = quantities[product.id] || 1;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    }, quantity);

    // Reset quantity for this product
    setQuantities(prev => ({
      ...prev,
      [product.id]: 1
    }));
  };

  const getCartQuantity = (productId: string) => {
    return cartItems.reduce((total, item) =>
      item.id === productId ? total + item.quantity : total, 0
    );
  };

  const getStockLevel = (stock: number) => {
    if (stock === 0) return { level: 'out', color: 'bg-red-500', text: 'Out of Stock' };
    if (stock < 50) return { level: 'low', color: 'bg-red-500', text: 'Low Stock' };
    if (stock < 100) return { level: 'medium', color: 'bg-yellow-500', text: 'Medium Stock' };
    return { level: 'high', color: 'bg-green-500', text: 'In Stock' };
  };

  const handleEditModeToggle = () => {
    if (!editMode && editPassword === 'MBS2024admin') {
      setEditMode(true);
    } else if (editMode) {
      setEditMode(false);
      setEditPassword('');
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header with Breadcrumb */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {currentView !== 'categories' && (
                  <Button variant="ghost" onClick={handleBackNavigation} className="p-2">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                )}
                <h1 className="text-3xl font-bold">Live Inventory</h1>
              </div>

              {/* Admin Edit Mode Toggle */}
              <div className="flex items-center gap-4">
                {!editMode ? (
                  <div className="flex items-center gap-2">
                    <Input
                      type="password"
                      placeholder="Admin password"
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                      className="w-32"
                    />
                    <Button onClick={handleEditModeToggle} size="sm">
                      Edit Mode
                    </Button>
                  </div>
                ) : (
                  <Button onClick={handleEditModeToggle} variant="destructive" size="sm">
                    Exit Edit Mode
                  </Button>
                )}
              </div>
            </div>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              {breadcrumb.map((crumb, index) => (
                <div key={index} className="flex items-center gap-2">
                  {index > 0 && <ChevronRight className="h-4 w-4" />}
                  <span className={index === breadcrumb.length - 1 ? 'font-semibold text-black' : ''}>
                    {crumb}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Search - only show when viewing products */}
          {currentView === 'products' && (
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          )}

          {/* Categories View */}
          {currentView === 'categories' && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {CATEGORIES.map((category) => (
                <Card
                  key={category.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
                  onClick={() => handleCategoryClick(category)}
                >
                  <div className="relative">
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Package className="h-8 w-8 mx-auto mb-2" />
                        <h3 className="text-lg font-bold">{category.name}</h3>
                        {category.hasSubcategories && (
                          <p className="text-sm mt-1 opacity-90">
                            Browse by manufacturer
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Manufacturers View */}
          {currentView === 'manufacturers' && selectedCategory && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MANUFACTURERS[selectedCategory as keyof typeof MANUFACTURERS]?.map((manufacturer) => (
                <Card
                  key={manufacturer.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
                  onClick={() => handleManufacturerClick(manufacturer)}
                >
                  <div className="relative">
                    <Image
                      src={manufacturer.image}
                      alt={manufacturer.name}
                      width={400}
                      height={200}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="text-center text-white">
                        <h3 className="text-2xl font-bold">{manufacturer.name}</h3>
                      </div>
                    </div>
                  </div>
                  <CardHeader>
                    <CardDescription className="text-center">
                      {manufacturer.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}

          {/* Product Types View */}
          {currentView === 'productTypes' && selectedManufacturer && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PRODUCT_TYPES[selectedManufacturer as keyof typeof PRODUCT_TYPES]?.map((productType) => (
                <Card
                  key={productType.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
                  onClick={() => handleProductTypeClick(productType)}
                >
                  <div className="relative">
                    <Image
                      src={productType.image}
                      alt={productType.name}
                      width={400}
                      height={200}
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <div className="text-center text-white">
                        <h3 className="text-xl font-bold">{productType.name}</h3>
                      </div>
                    </div>
                  </div>
                  <CardHeader>
                    <CardDescription className="text-center">
                      View available colors and options
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}

          {/* Products View */}
          {currentView === 'products' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts
                .filter(product =>
                  product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  product.sku.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((product) => {
                  const stockLevel = getStockLevel(product.stock);
                  const cartQuantity = getCartQuantity(product.id);
                  const currentQuantity = quantities[product.id] || 1;

                  return (
                    <Card key={product.id} className="overflow-hidden">
                      <div className="relative">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={300}
                          height={200}
                          className="w-full h-48 object-cover"
                        />
                        <div className={`absolute top-2 right-2 ${stockLevel.color} text-white text-xs px-2 py-1 rounded`}>
                          {stockLevel.text}
                        </div>
                        {cartQuantity > 0 && (
                          <Badge className="absolute top-2 left-2 bg-blue-600">
                            {cartQuantity} in cart
                          </Badge>
                        )}
                      </div>

                      <CardContent className="p-4">
                        <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">{product.brand}</p>
                        <p className="text-gray-500 text-sm mb-3">{product.description}</p>

                        <div className="flex items-center justify-between mb-3">
                          <span className="text-2xl font-bold text-green-600">${product.price}</span>
                          <span className="text-sm text-gray-500">SKU: {product.sku}</span>
                        </div>

                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm">Stock: {product.stock}</span>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>{product.name}</DialogTitle>
                              </DialogHeader>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  width={400}
                                  height={300}
                                  className="w-full h-64 object-cover rounded"
                                />
                                <div>
                                  <p className="text-lg font-semibold mb-2">${product.price}</p>
                                  <p className="text-gray-600 mb-2">{product.description}</p>
                                  <p className="text-sm text-gray-500 mb-2">SKU: {product.sku}</p>
                                  <p className="text-sm text-gray-500 mb-4">Stock: {product.stock} units</p>
                                  {product.specifications && (
                                    <div>
                                      <h4 className="font-semibold mb-2">Specifications:</h4>
                                      <p className="text-sm text-gray-600">{product.specifications}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>

                        {product.stock > 0 ? (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Quantity:</span>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleQuantityChange(product.id, -1)}
                                  disabled={currentQuantity <= 1}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-8 text-center">{currentQuantity}</span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleQuantityChange(product.id, 1)}
                                  disabled={currentQuantity >= product.stock}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            <Button
                              onClick={() => handleAddToCart(product)}
                              className="w-full"
                              disabled={currentQuantity > product.stock}
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Add to Cart
                            </Button>
                          </div>
                        ) : (
                          <Button disabled className="w-full">
                            Out of Stock
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          )}

          {currentView === 'products' && filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Products Found</h3>
              <p className="text-gray-500">Try adjusting your search or browse other categories.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
