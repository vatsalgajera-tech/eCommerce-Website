# Shree Vastra – Setup Guide

## 🚀 Quick Start (5 Minutes)

### Step 1 — Get MongoDB Atlas URI (FREE)

1. Open → **https://cloud.mongodb.com**
2. Sign up / Log in (Google login works)
3. Click **"Build a Database"** → Choose **FREE (M0)** → Provider: AWS → Region: Mumbai → **Create**
4. Username: `shreevastra` | Password: something strong → **Create User**
5. Network Access → **"Allow Access from Anywhere"** (0.0.0.0/0) → Confirm
6. Go to cluster → **Connect** → **Drivers** → Copy the URI

   Your URI looks like:
   ```
   mongodb+srv://shreevastra:<password>@cluster0.abc12.mongodb.net/shreevastra?retryWrites=true&w=majority
   ```

7. Open `server/.env` and replace `MONGO_URI=` with your URI

---

### Step 2 — Start the Servers

**Terminal 1 (Backend):**
```bash
cd C:\ShreeVastra\server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd C:\ShreeVastra\client
npm run dev
```

---

### Step 3 — Seed the Database

After MongoDB connects, run this once:
```bash
cd C:\ShreeVastra\server
npm run seed
```

This creates:
- ✅ 10 sample products across all categories
- ✅ Admin account: admin@shreevastra.com / Admin@ShreeVastra@123

---

### Step 4 — Open the App

- 🌐 Frontend: http://localhost:5173
- 🔧 Backend API: http://localhost:5000/api/health
- 👩‍💼 Admin Panel: http://localhost:5173/admin (login first)

---

## 📋 Business Details Configured

| Field | Value |
|-------|-------|
| Phone | +91 97231 40922 |
| Email | support.shreevastra@gmail.com |
| Location | Rajkot, Gujarat, India |
| WhatsApp | wa.me/919723140922 |

---

## 🔑 Environment Variables (server/.env)

```env
MONGO_URI=mongodb+srv://shreevastra:<password>@cluster0.xxx.mongodb.net/shreevastra?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
JWT_SECRET=ShreeVastra_Super_Secret_JWT_Key_2024_XyZ#9!
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

> Razorpay and Cloudinary can be added later

---

## 🐛 Common Errors & Fixes

| Error | Fix |
|-------|-----|
| `buffering timed out` | MongoDB URI is wrong or not set |
| `ECONNREFUSED` | Backend server not running |
| `ENOTFOUND` | Wrong cluster hostname in URI |
| Network Access denied | Add 0.0.0.0/0 in Atlas Network Access |

---

## 📦 Deploy to Production

**Frontend → Vercel:**
```bash
cd client && npm run build
# Deploy dist/ folder to Vercel
```

**Backend → Render:**
- Connect GitHub repo
- Root: `server/`
- Build: `npm install`
- Start: `node index.js`
- Add all env vars in Render dashboard
