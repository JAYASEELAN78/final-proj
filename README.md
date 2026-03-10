# V.M.S GARMENTS App

A comprehensive, full-stack business management application for "V.M.S GARMENTS" built with React Vite (frontend) and Express.js/MongoDB (backend).

## 🚀 Features

- **🔐 Authentication**: Email/password login, Phone OTP verification, Social login buttons
- **📊 Dashboard**: Real-time stats, revenue charts, inventory overview, recent bills
- **🧾 Billing System**: Create bills, A4 format preview, print/PDF export, GST calculations
- **📦 Inventory Management**: Stock tracking, low stock alerts, category management
- **📈 Reports & Analytics**: Sales trends, top products, category performance, Excel export
- **⚙️ Settings**: Company info, bank details, tax configuration, theme customization

## 🎨 Theme Options

8 beautiful color themes with light/dark mode support:
- Royal Purple, Ocean Blue, Tropical Teal, Forest Green
- Sunset Orange, Bloom Pink, Rose Red, Deep Indigo

## 📁 Project Structure

```
vms-garments-app/
├── frontend/                 # React Vite Frontend
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── contexts/        # React contexts
│   │   ├── services/        # API services
│   │   ├── utils/           # Utility functions
│   │   └── types/           # TypeScript types
│   └── package.json
│
├── backend/                  # Express.js Backend
│   ├── src/
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Express middleware
│   │   └── index.js         # Server entry
│   └── package.json
│
└── README.md
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: http://localhost:5173

### Backend Setup

```bash
cd backend
npm install

# Create .env file with:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/vms-garments
# JWT_SECRET=your-secret-key

npm run dev
```

Backend runs at: http://localhost:5000

## 📱 Pages

| Page | Description |
|------|-------------|
| `/login` | Login page with social and OTP options |
| `/` | Dashboard with stats and charts |
| `/billing` | Bill management and creation |
| `/inventory` | Stock and product management |
| `/reports` | Analytics and reports |
| `/settings` | App configuration |

## 🔧 Tech Stack

### Frontend
- React 18 + Javascript 
- Vite
- React Router v6
- Recharts (charts)
- Lucide React (icons)
- Axios (HTTP client)

### Backend
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs

## 📄 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/send-otp` | Send OTP |
| GET | `/api/products` | Get all products |
| POST | `/api/bills` | Create bill |
| GET | `/api/reports/sales-trend` | Get sales data |
| GET | `/api/settings` | Get settings |

## 🎯 Demo Login

For testing without backend:
- Any email/password works (mock auth)
- Phone OTP: Use `123456` as OTP

## 📝 License

MIT License - V.M.S GARMENTS
