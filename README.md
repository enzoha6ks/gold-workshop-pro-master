# Gold Workshop Pro 🏆

A comprehensive web application for managing gold business operations including inventory tracking, melting processes, market transactions, order management, and detailed reporting.

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

## ✨ Features

### Core Modules (8 Pages)
- **📊 Dashboard** - Real-time statistics and quick access
- **🔐 Gold Safe** - Complete inventory management
- **🔥 Melting** - Process tracking and efficiency monitoring
- **📈 Market** - Buy/sell transactions with market rates
- **📦 Orders** - Full order lifecycle management
- **📉 Reports** - Advanced analytics and visualization
- **🧾 Invoice** - Professional invoice generation with PDF export
- **⚙️ Settings** - Configuration and worker management

### Key Features
✅ Real-time data persistence with LocalStorage  
✅ Responsive design for desktop and mobile  
✅ Dark mode support  
✅ PDF generation and printing  
✅ Data visualization with charts  
✅ Form validation and error handling  
✅ 100% TypeScript type safety  
✅ WCAG compliant accessible UI  

---

## 📦 Installation

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager
- Git

### Step 1: Clone Repository
```bash
git clone https://github.com/enzoha6ks/gold-workshop-pro-master.git
cd gold-workshop-pro-master
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Start Development Server
```bash
npm run dev
```

Application will be available at: **http://localhost:3000**

---

## 🚀 Getting Started

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create optimized production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint code quality check |

### Quick Setup (60 seconds)

```bash
# 1. Clone
git clone https://github.com/enzoha6ks/gold-workshop-pro-master.git

# 2. Install
cd gold-workshop-pro-master
npm install

# 3. Run
npm run dev

# 4. Open browser
# http://localhost:3000
```

---

## 📁 Project Structure

```
src/
├── app/                          # 8 Main Feature Pages
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Dashboard
│   ├── gold-safe/page.tsx       # Inventory
│   ├── melting/page.tsx         # Melting process
│   ├── market/page.tsx          # Market transactions
│   ├── orders/page.tsx          # Orders
│   ├── reports/page.tsx         # Reports & analytics
│   ├── Invoice/page.tsx         # Invoice generation
│   ├── settings/page.tsx        # Configuration
│   └── globals.css              # Global styles
│
├── components/                   # 30+ Reusable Components
│   ├── ui/                      # 18 Base UI Components
│   ├── layout/                  # Header, Sidebar, Mobile Nav
│   ├── gold/                    # Gold management components
│   ├── market/                  # Market components
│   ├── orders/                  # Order components
│   └── dashboard/               # Dashboard components
│
├── lib/                         # Utility Functions
│   ├── store.ts                 # Zustand state management
│   ├── storage.ts               # LocalStorage helpers
│   ├── utils.ts                 # General utilities
│   └── gold-calculations.ts     # Gold calculations
│
└── contexts/                    # React Contexts
    └── theme-provider.tsx       # Dark mode provider
```

---

## 🛠️ Tech Stack

### Core Framework
- **Next.js 15.5.4** - React framework with App Router & Turbopack
- **React 19.1.0** - UI library
- **TypeScript 5** - Full type safety

### UI & Styling
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Framer Motion 12.23.22** - Smooth animations
- **Lucide React 0.545.0** - Icon library
- **Next Themes** - Dark mode support

### State & Data
- **Zustand 5.0.8** - Lightweight state management
- **LocalStorage** - Browser data persistence
- **React Hook Form** - Form handling
- **Date-FNS** - Date utilities
- **UUID 13.0.0** - Unique ID generation

### Reporting & Export
- **Recharts 3.2.1** - Data visualization
- **jsPDF 3.0.3** - PDF generation
- **html2canvas 1.4.1** - Canvas rendering
- **React-to-Print 3.2.0** - Print functionality

### Development Tools
- **ESLint 9** - Code linting
- **Turbopack** - Fast bundler

---

## 🎯 Key Modules

### 1. Dashboard
Main hub with real-time statistics and quick metrics overview.

### 2. Gold Safe
Complete inventory management:
- View stock by purity
- Issue/return transactions
- Update stock purity
- Transaction history

### 3. Melting
Process tracking for gold melting:
- Batch tracking
- Efficiency monitoring
- Purity conversion calculator
- Cost calculations

### 4. Market
Buy/sell transaction management:
- Send/receive operations
- Real-time rates
- Transaction details
- Historical data

### 5. Orders
Order lifecycle management:
- Create orders
- Track status
- Update details
- View history

### 6. Reports
Advanced analytics:
- Charts and graphs
- Trend analysis
- Performance metrics
- Export reports

### 7. Invoice
Professional invoice generation:
- Auto-generated numbers
- PDF export
- Print-ready format
- Invoice tracking

### 8. Settings
Configuration management:
- App preferences
- Worker management
- Theme settings
- Data management

---

## 🗄️ Data Storage

### LocalStorage Structure
```javascript
{
  "gold-transactions": [...],      // Gold inventory transactions
  "melting-batches": [...],        // Melting process data
  "market-transactions": [...],    // Market buy/sell data
  "orders": [...],                 // Order records
  "workers": [...],                // Worker information
  "app-settings": {}               // App preferences
}
```

### Future: Backend Integration
Application is ready for backend API integration with planned support for:
- Database persistence
- User authentication
- Real-time synchronization
- Multi-user support

---

## 🎨 Responsive Design

- **Desktop** (≥1024px) - Full sidebar navigation
- **Tablet** (768-1023px) - Adaptive layout
- **Mobile** (<768px) - Mobile-optimized navigation

---

## 🏗️ Component Architecture

### UI Component System
18 base components built with Radix UI + Tailwind CSS:
```
Button, Card, Dialog, Input, Label, Badge, Tabs, Table,
Select, Switch, Slider, Avatar, Progress, Separator,
Sheet, Menubar, Sonner, and more...
```

### Layout Components
- Header with navigation
- Sidebar with active state
- Mobile navigation drawer

### Feature Components
Specialized components for each module:
- TransactionsTable, Dialogs, Forms, etc.

---

## 🔒 Security & Best Practices

### Implemented
✅ TypeScript for type safety  
✅ Input validation on forms  
✅ XSS protection via React  
✅ Component isolation  
✅ Error boundaries  

### Recommended for Production
- Add authentication system
- Implement backend API
- Use HTTPS
- Add rate limiting
- Implement CSRF protection
- Enable database encryption

---

## 📊 Project Statistics

| Metric | Value |
|--------|-------|
| Framework | Next.js 15.5.4 |
| Language | TypeScript 5 |
| Components | 30+ |
| Pages | 8 |
| Type Coverage | 100% |
| Dependencies | 25+ |

---

## 🚀 Production Deployment

### Option 1: Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### Option 2: Docker
```bash
docker build -t gold-workshop .
docker run -p 3000:3000 gold-workshop
```

### Option 3: Custom Server
```bash
npm run build
npm start
```

---

## 🐛 Troubleshooting

### Port 3000 already in use
```bash
npm run dev -- -p 3001
```

### Dependencies not installing
```bash
npm cache clean --force
rm -r node_modules package-lock.json
npm install
```

### TypeScript errors
```bash
npm run build
```

### Styling not applying
```bash
npm run dev
# Wait for Turbopack compilation
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open Pull Request

### Code Standards
- Follow TypeScript best practices
- Use meaningful names
- Add comments for complex logic
- Test your changes

---

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zustand](https://github.com/pmndrs/zustand)
- [Radix UI](https://www.radix-ui.com/docs)

---

## 🗺️ Roadmap

### Phase 1 ✅ (Current)
- ✅ Core UI and routing
- ✅ LocalStorage persistence
- ✅ 8 feature modules
- ✅ Dark mode support

### Phase 2 📋 (Upcoming)
- 🔄 Backend API integration
- 🔄 User authentication
- 🔄 Database implementation
- 🔄 Real-time updates

### Phase 3 🎯 (Future)
- 📊 Advanced analytics
- 🔐 Role-based access
- 📱 Mobile app (React Native)
- 🌐 Multi-language support

---

## 📝 License

MIT License - see [LICENSE](LICENSE) for details

---

## 👤 Author

**Enzo Ha6ks**  
GitHub: [@enzoha6ks](https://github.com/enzoha6ks)  
Repository: [gold-workshop-pro-master](https://github.com/enzoha6ks/gold-workshop-pro-master)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Radix UI](https://www.radix-ui.com/) - Components
- [Zustand](https://github.com/pmndrs/zustand) - State management

---

## 📞 Support

For issues, questions, or suggestions:
- **GitHub Issues** - Report bugs and request features
- **GitHub Discussions** - Ask questions and share ideas
- **Pull Requests** - Contribute improvements

---

⭐ If you find this project useful, please consider giving it a star on GitHub!

---

**Status:** ✅ Active Development  
**Version:** 0.1.0  
**Last Updated:** November 30, 2025
