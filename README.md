# Food Intelligence Lab 🔬 (fdl)

[![Vite](https://img.shields.io/badge/Vite-6.4.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)

An interactive, AI-powered food safety analytics platform for tracking, quantifying, and analyzing trace elements, heavy metals, and essential minerals across various food commodities worldwide.

Instead of relying on static data, the Food Intelligence Lab leverages **Google Gemini AI** (`gemini-flash-lite-latest`, `gemini-3.6-flash`) to dynamically generate scientifically realistic elemental profiles for any searched food item, comparing raw harvest samples against commercial branded products from the world's top producing countries.

---

## ✨ Key Platform Features

### 1. 🤖 Dynamic AI Elemental Profiling
* **Real-Time Data Synthesis**: Securely queries Google Gemini AI models through an Express.js backend with automated fallback (`gemini-flash-lite-latest`, `gemini-3.5-flash-lite`, `gemini-3.6-flash`) to generate sub-second elemental compositions.
* **Variable Elements**: Dynamically identifies and analyzes 4 to 15 relevant trace elements and heavy metals specific to the searched food commodity.
* **Geographic Accuracy**: Automatically determines the genuine top 7 producing countries for any queried item.

### 2. ⚛️ General Comparison Engine
* **Side-by-Side Brand vs. Raw Comparisons**: Detailed concentration matrix comparing toxic heavy metal risks (e.g., Lead, Cadmium, Arsenic, Chromium, Barium) vs. essential mineral retention.
* **Smart Item Selection**: Automatic collision resolution ensuring duplicate items cannot be selected against themselves.

### 3. 🌍 Global Safety Matrix & Provenance
* **Country-vs-Country Mapping**: Regional element distribution comparing food samples from top producing countries.
* **Data-Driven Origin Analysis**: Automated calculation of the safest, most compliant country source for each food commodity based on WHO/FAO guidelines.

### 4. 🧮 Personalized DDI & Disease Risk Engine
* **Dynamic DDI Recalculation**: Live recalculation of Daily Dietary Intake (DDI) scaling exposure for `mg/day` regulatory limits.
* **Associated Disease & Toxicity Warnings**: Displays clinical disease warnings (e.g. *Lead Poisoning & Encephalopathy*, *Arsenicosis*, *Itai-Itai Disease*, *Minamata Disease*, *Chromium Mucosal Ulceration*, *Hypokalemic Cardiac Arrhythmia*) when element concentrations exceed safe bounds.

### 5. 🔐 Secure Authentication & Admin Controls
* **Better-Auth Integration**: Robust authentication supporting Email/Password, Google OAuth, and GitHub OAuth.
* **PostgreSQL & Prisma**: Secure session and user management backed by a PostgreSQL database.
* **Admin Dashboard**: Role-based access control allowing administrators to manage users and monitor inquiries.

---

## 🛠️ Technology Stack

* **Frontend**: [React 18](https://reactjs.org/) + [Vite 6](https://vitejs.dev/)
* **Backend**: Node.js + Express.js + [Better-Auth](https://better-auth.com/) + Google Gemini AI REST API
* **Database**: PostgreSQL with [Prisma ORM](https://www.prisma.io/)
* **Styling**: [Tailwind CSS 3](https://tailwindcss.com/) + Custom Glassmorphism UI
* **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Quick Start & Installation

### Prerequisites
* [Node.js](https://nodejs.org/) (v16.0 or higher)
* PostgreSQL Database
* Google Gemini API Key

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Ariiee/food-intelligence-lab.git
cd fdl

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
```

### 2. Environment Variables
Create a single `.env` file in the **`fdl/`** directory:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@host/database"

# Authentication Secrets
BETTER_AUTH_SECRET="your_random_secret_string"

# OAuth Credentials (Optional)
GOOGLE_CLIENT_ID="your_google_oauth_client_id"
GOOGLE_CLIENT_SECRET="your_google_oauth_client_secret"
GITHUB_CLIENT_ID="your_github_oauth_client_id"
GITHUB_CLIENT_SECRET="your_github_oauth_client_secret"

# AI Integration
VITE_GEMINI_API_KEY="your_gemini_api_key_here"
```

### 3. Initialize the Database
Push the Prisma schema to your PostgreSQL database:
```bash
cd fdl/backend
npx prisma db push
```

### 4. Run Development Servers
Start both the backend API proxy and the frontend React app:

```bash
# Terminal 1: Start Backend (Port 3001)
cd fdl/backend
node server.js

# Terminal 2: Start Frontend (Port 3000)
cd fdl
npm run dev
```

---

## 📁 Project Structure

```text
fdl/
├── backend/
│   ├── auth.js                     # Better-Auth configuration & providers
│   ├── server.js                   # Express proxy, Admin routes, & Gemini API logic
│   └── prisma/                     
│       └── schema.prisma           # PostgreSQL Database Schema
├── src/
│   ├── components/                 # React UI Components (Hero, Modals, DDI, General Comparison)
│   ├── data/                       # Constants, master elements, and disease mappings
│   ├── utils/                      # Safety scoring algorithms, auth clients, and API utilities
│   ├── App.jsx                     # Root application routing and state
│   └── index.css                   # Tailwind and custom theme styles
├── .env                            # Unified environment configurations
├── package.json
├── tailwind.config.js
└── vite.config.js                  # Vite config (proxies /api to backend port 3001)
```

---

## 📬 Contact & Links

* **Author**: Arpita Sharma
* **Email**: `arpitasharma1267@gmail.com`
* **GitHub**: [https://github.com/Ariiee](https://github.com/Ariiee)
* **LinkedIn**: [https://www.linkedin.com/in/arpita-sharma-490a77269](https://www.linkedin.com/in/arpita-sharma-490a77269)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
