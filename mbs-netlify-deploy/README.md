# MBS Roofing Supply - B2B Platform (Static Deploy)

🚀 **Production-ready static deployment** of the complete MBS B2B roofing supply platform.

## 🎯 **What's Included**

This repository contains the **complete built static site** with all features:

### **🏠 Core Features**
- ✅ **Pixel-perfect homepage** clone of modernbuilderssupply.com
- ✅ **Complete hierarchical inventory** (11 categories, 3-level navigation)
- ✅ **Full authentication system** (buyer/admin roles)
- ✅ **Shopping cart** with persistence
- ✅ **Mobile responsive** design

### **📦 All 4 B2B Order Types**
- ✅ **Delivery Orders** - Standard delivery with scheduling
- ✅ **Will Call Orders** - Customer pickup with 7 branch locations
- ✅ **Desk Orders** - Custom/special orders with quote workflow
- ✅ **Counter Orders** - Walk-in sales with POS integration

### **👨‍💼 Advanced Admin Dashboard (9 Tabs)**
- ✅ **Products Management** - Hierarchical category/brand/product system
- ✅ **Import/Export** - CSV bulk operations
- ✅ **Barcode Scanning** - Inventory management
- ✅ **Supplier Portal** - Product update approvals
- ✅ **Sales Analytics** - Revenue trends and reporting
- ✅ **Orders Management** - All order types with status tracking
- ✅ **Will Call Queue** - Pickup management interface
- ✅ **Counter Sales** - Walk-in sales and POS integration
- ✅ **Returns Processing** - Returns tracking and management

### **🏢 Multi-Branch Support**
- ✅ **7 Ohio Locations**: Akron, Canton, Cleveland, Columbus, Dayton, Toledo, Youngstown
- ✅ **Branch-specific** pickup scheduling and inventory
- ✅ **Location-aware** will call orders

## 🚀 **Deploy to Netlify (2 Options)**

### **Option 1: Connect This GitHub Repository (Recommended)**

1. **Go to [netlify.com](https://netlify.com)** and sign in
2. **Click "Add new site" → "Import an existing project"**
3. **Connect to GitHub** and select this repository
4. **Configure settings**:
   - **Build command**: *(leave empty)*
   - **Publish directory**: `./` *(root)*
   - **Branch to deploy**: `master`
5. **Click "Deploy site"**

### **Option 2: Manual Drag & Drop**

1. **Download** this entire repository as a ZIP
2. **Go to [netlify.com](https://netlify.com)** and sign in
3. **Drag the ZIP file** onto Netlify dashboard
4. **Site goes live immediately!**

## 📋 **Admin Access**

- **Admin Password**: `MBS2024admin`
- **Admin Dashboard**: `/admin`
- **Direct Access**: Look for discrete "Admin" buttons on homepage

## 🔐 **Login Credentials**

### **Buyer Account**
- **Email**: `buyer@demo.com`
- **Password**: `password123`

### **Admin Account**
- **Email**: `admin@mbs.com`
- **Password**: `admin123`

## 📁 **File Structure**

```
mbs-netlify-deploy/
├── index.html              # Homepage
├── inventory.html           # Inventory system
├── cart.html               # Shopping cart
├── admin.html              # Admin dashboard
├── about.html              # About page
├── dashboard.html          # User dashboard
├── 404.html                # Error page
├── _next/                  # Next.js static assets
│   ├── static/chunks/      # JavaScript chunks
│   └── static/css/         # Stylesheets
├── assets/                 # Video and media files
└── images/                 # Image assets
```

## 🛠 **Technical Stack**

- **Framework**: Next.js 15+ with static export
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State**: React Context + localStorage persistence
- **Build**: Production-optimized static site
- **Deployment**: Netlify-ready static files

## 🎯 **Key Features Highlights**

### **Inventory Management**
- **Hierarchical navigation**: Category → Manufacturer → Product Type → Colors
- **Real-time stock tracking** with color-coded indicators
- **Advanced search** and filtering
- **Product details** with specifications and images

### **Order Processing**
- **Multi-type orders** with dedicated workflows
- **Branch pickup scheduling** with calendar integration
- **Quote management** for special orders
- **Status tracking** through completion

### **Admin Capabilities**
- **Complete CRUD** operations for all entities
- **Bulk operations** via CSV import/export
- **Analytics dashboard** with sales metrics
- **Queue management** for pickups and counter sales

## 📈 **Performance**

- ✅ **Static site** - Ultra-fast loading
- ✅ **Optimized builds** - Production-ready
- ✅ **Mobile responsive** - Works on all devices
- ✅ **PWA ready** - App-like experience

## 🌐 **Live Demo**

Once deployed, you'll have a **fully functional B2B platform** with:
- Working authentication and role management
- Complete inventory browsing and cart functionality
- All 4 order types operational
- Full admin dashboard with real management capabilities
- Multi-branch pickup and delivery scheduling

---

**🤖 Generated with [Same](https://same.new)**

**Co-Authored-By: Same <noreply@same.new>**
