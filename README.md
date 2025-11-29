# 🏆 Gold Workshop Pro

A modern, feature-rich web application for comprehensive gold business management. Track melting processes, inventory, market transactions, orders, and generate detailed reports—all in one unified platform.

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Features in Detail](#-features-in-detail)
- [Component Architecture](#-component-architecture)
- [Usage Examples](#-usage-examples)
- [Configuration](#-configuration)
- [Scripts](#-scripts)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🏠 **Dashboard**
- Centralized statistics overview
- Key metrics at a glance
- Quick navigation to all modules

### 💰 **Gold Safe Management**
- Real-time inventory tracking
- Issue/return gold operations
- Purity level management
- Comprehensive transaction history
- Multi-format export

### 🔥 **Melting Process**
- Batch tracking and management
- Efficiency metrics calculation
- Purity conversion calculator
- Loss analysis and trends
- Historical data preservation

### 📊 **Market Transactions**
- Buy/sell operations
- Real-time market rate tracking
- Receive/send transaction management
- Transaction history with details
- Financial analytics

### 📦 **Order Management**
- Create and manage orders
- Update order status
- View detailed order information
- Track order history
- Order timeline

### 📈 **Reports & Analytics**
- Financial performance reports
- Trend analysis
- Custom date ranges
- Data visualization with charts
- Export to multiple formats

### 📄 **Invoice Management**
- Generate professional invoices
- Customizable templates
- Print and PDF export
- Invoice history tracking
- Payment tracking

### 👥 **Worker Management**
- Employee records
- Role-based access
- Activity tracking
- Performance metrics

### ⚙️ **Settings**
- Application preferences
- Theme customization
- Data management
- System configuration

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.5.4** - React framework with App Router & Turbopack
- **React 19.1.0** - UI library
- **TypeScript 5** - Static typing

### UI & Styling
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Headless components
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons

### State Management
- **Zustand 5.0.8** - Lightweight state store
- **Next-Themes** - Theme management

### Data & Utils
- **React Hook Form** - Form handling
- **Date-FNS** - Date utilities
- **Recharts** - Charts & graphs
- **UUID** - Unique identifiers

### Export & Reporting
- **jsPDF** - PDF generation
- **html2canvas** - Screenshot capture
- **React-to-Print** - Print functionality

### Notifications
- **Sonner** - Toast notifications

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/enzoha6ks/gold-workshop-pro-master.git
cd gold-workshop-pro-master-main

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

---

## 📁 Project Structure

```
gold-workshop-pro/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Dashboard
│   │   ├── gold-safe/          # Gold inventory management
│   │   ├── melting/            # Melting process tracking
│   │   ├── market/             # Market transactions
│   │   ├── orders/             # Order management
│   │   ├── reports/            # Reports & analytics
│   │   ├── Invoice/            # Invoice generation
│   │   ├── workers/            # Worker management
│   │   └── settings/           # Settings page
│   │
│   ├── components/             # Reusable components
│   │   ├── ui/                 # UI component library
│   │   ├── layout/             # Layout components
│   │   ├── dashboard/          # Dashboard components
│   │   ├── gold/               # Gold management components
│   │   ├── market/             # Market components
│   │   └── orders/             # Order components
│   │
│   ├── lib/                    # Utilities & helpers
│   │   ├── store.ts            # Zustand store
│   │   ├── utils.ts            # General utilities
│   │   ├── storage.ts          # LocalStorage helpers
│   │   └── gold-calculations.ts # Calculation utilities
│   │
│   └── contexts/               # React contexts
│       └── theme-provider.tsx  # Theme management
│
├── public/                     # Static assets
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── tailwind.config.js          # Tailwind config
├── next.config.ts              # Next.js config
└── README.md                   # This file
```

---

## 🎯 Features in Detail

### 💰 Gold Safe Management
Manage your gold inventory with precision:
- Track stock by purity level
- Record issue and return transactions
- Monitor inventory changes
- View transaction history
- Export transaction reports

### 🔥 Melting Process
Optimize your melting operations:
- Create and track melting batches
- Calculate efficiency metrics
- Convert between purity levels
- Monitor loss percentages
- Analyze trends over time
- Purity conversion calculator with alloy requirements

### 📊 Market Transactions
Handle market operations efficiently:
- Record buy/sell transactions
- Track market rates
- Send/receive operations
- View transaction details
- Financial analytics

### 📦 Order Management
Manage orders seamlessly:
- Create new orders
- Update order status
- Track order timeline
- View order details
- Order history

### 📈 Analytics & Reports
Generate insightful reports:
- Performance metrics
- Financial summaries
- Trend charts
- Custom date ranges
- Export capabilities

### 📄 Invoice Management
Professional invoice creation:
- Auto-generated invoice numbers
- Custom templates
- Print-ready format
- PDF export
- Invoice tracking

---

## 🏗️ Component Architecture

### UI Component System
Built with Radix UI + Tailwind CSS:

```typescript
// Example: Using a Card component
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>
```

### Dialog Components
Reusable modal dialogs:

```typescript
// Example: Dialog for new transaction
import { Dialog } from "@/components/ui/dialog"

<Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    {/* Form content */}
  </DialogContent>
</Dialog>
```

### Layout Components
Page structure:

```typescript
// Header with navigation
<Header />

// Sidebar navigation
<Sidebar />

// Main content area
<main className="flex-1">
  {children}
</main>
```

---

## 💻 Usage Examples

### Creating a New Gold Transaction

```typescript
// Use Zustand store to manage transactions
import { useGoldStore } from "@/lib/store"

const Component = () => {
  const { addTransaction } = useGoldStore()
  
  const handleSubmit = (data) => {
    addTransaction({
      type: "issue",
      weight: 100,
      purity: 999,
      date: new Date()
    })
  }
}
```

### Using the Melting Calculator

```typescript
// Calculate purity conversion
const calculatePurity = (weight: number, fromPurity: number, toPurity: number) => {
  const pureGold = (weight * fromPurity) / 1000
  const outputWeight = (pureGold * 1000) / toPurity
  return outputWeight
}
```

### Generating PDF Export

```typescript
import { useReactToPrint } from "react-to-print"

const ExportButton = () => {
  const printRef = useRef()
  const handlePrint = useReactToPrint({ content: () => printRef.current })
  
  return (
    <>
      <button onClick={handlePrint}>Export PDF</button>
      <div ref={printRef}>{/* Content to print */}</div>
    </>
  )
}
```

---

## ⚙️ Configuration

### Theme Customization

Modify `tailwind.config.js`:

```javascript
export default {
  theme: {
    extend: {
      colors: {
        // Custom colors
      }
    }
  }
}
```

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_APP_NAME=Gold Workshop Pro
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## 📝 Scripts

```bash
# Development
npm run dev              # Start with Turbopack
npm run build           # Build for production
npm start               # Start production server
npm run lint            # Run ESLint

# Type checking
npm run type-check      # (If configured)
```

---

## 🎨 Styling

### Tailwind CSS Classes

```tsx
// Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">

// Flexbox
<div className="flex items-center justify-between gap-4">

// Spacing
<div className="p-4 md:p-6 space-y-4">

// Colors
<div className="text-slate-900 bg-blue-50">
```

### Dark Mode

```tsx
// Theme provider in layout
<ThemeProvider attribute="class" defaultTheme="system">
  {children}
</ThemeProvider>

// Using theme in components
import { useTheme } from "next-themes"

const Component = () => {
  const { theme, setTheme } = useTheme()
}
```

---

## 🔒 Security Considerations

✅ **Implemented:**
- TypeScript for type safety
- Input validation
- Component isolation
- Secure state management
- Error handling

⚠️ **Recommended for Production:**
- Add authentication (NextAuth.js)
- Implement backend API
- Add rate limiting
- Use HTTPS
- Implement CSRF protection
- Add database encryption

---

## 🧪 Testing

To add tests, install Jest and React Testing Library:

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

---

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Radix UI](https://www.radix-ui.com/docs)
- [Zustand](https://github.com/pmndrs/zustand)

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style
- Use TypeScript
- Follow ESLint rules
- Keep components modular
- Maintain responsive design
- Add JSDoc comments

---

## 📦 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

---

## 🐛 Known Issues & Limitations

- **Data Storage:** Currently uses LocalStorage (suitable for demo/prototype)
- **Scalability:** No database backend yet
- **Authentication:** No user authentication system
- **Real-time:** No WebSocket/real-time updates
- **Mobile:** Responsive but not native mobile app

### Roadmap

- [ ] Backend API integration
- [ ] User authentication & authorization
- [ ] Database implementation
- [ ] Real-time updates
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Inventory forecasting
- [ ] Multi-user support

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💼 Author

**Enzo Ha6ks**  
Repository: [enzoha6ks/gold-workshop-pro-master](https://github.com/enzoha6ks/gold-workshop-pro-master)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Radix UI](https://www.radix-ui.com/) - Component library
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Zustand](https://github.com/pmndrs/zustand) - State management

---

## 📞 Support

For issues and questions:
- Open an [Issue](https://github.com/enzoha6ks/gold-workshop-pro-master/issues)
- Check existing documentation
- Review code comments

---

## ⭐ Show Your Support

If you find this project useful, please consider:
- ⭐ Giving it a star on GitHub
- 🍴 Forking the repository
- 📢 Sharing with others
- 💬 Providing feedback

---

**Made with ❤️ for gold business management**

Last Updated: November 30, 2025
