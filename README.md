# ♟️ Swiss-System Chess Tournament Pairing System

This project is a smart pairing system for chess tournaments using the **Swiss system**.  
It helps organizers create fair matchups and keep the tournament running smoothly.

## Features
- 🏆 **Tie-breakers** – Supports **Buchholz** and **Sonneborn–Berger** scoring to decide rankings when players have the same points.
- ⚪⚫ **Color Balancing** – Makes sure players get a fair mix of White and Black pieces across rounds.
- 🚫 **No Repeat Opponents** – Players won’t face the same opponent twice.
- 🎯 **Fair Early Rounds** – Strong players are matched against mid-level players in the first rounds, so top players meet later.
- 🔄 **Error Handling** – Uses backtracking to fix pairing issues and avoid infinite loops.

## Why Swiss System?
- Players don’t get knocked out – everyone plays all rounds.
- Each round pairs players with similar scores.
- Works well for large tournaments with limited rounds.

## Example Flow
1. Players are registered with their ratings.
2. Round 1 pairs strong players with mid-strength players.
3. Later rounds pair players based on their scores.
4. Tie-breaker rules are applied for final standings.

## Use Cases
- School chess events
- Club tournaments
- Online chess competitions

---

📌 *This project is built for anyone who wants an easy way to manage fair and competitive chess tournaments.*

---

## 🚀 Features

- ✅ Pair players based on scores
- ✅ Avoid repeated opponents
- ✅ Maintain color balance (White/Black)
- ✅ Calculate **Buchholz** and **Sonneborn–Berger** tie-break scores
- ✅ Strong-vs-mid pairing in early rounds
- ✅ Backtracking and repair to prevent pairing deadlocks
- ✅ Easily extensible and customizable

---

## 🛠️ Tech Stack


Frontend: React.js, Tailwind CSS

Backend: Node.js, Express.js

Database: MongoDB

Other: Axios, CORS, dotenv

Deployment: Render (Backend), Vercel(Frontend)

---

## 📥 Installation & Setup

1️⃣ **Clone the repository**
```bash
git clone [https://github.com/SanketNatekar/pair.git]
cd pair
```

2️⃣ **Install dependencies**

Backend setup
```bash
cd server
npm install
```
Create a .env file in server/ with:
```bash
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```
Run the backend:
```bash
npm run dev
```
3️⃣ Frontend Setup
```bash
cd client
npm install
```
Create a .env file in client/ with:
```bash
VITE_API_BASE_URL=http://localhost:4000/api
```
Run the backend:
```bash
npm run dev
```

3️⃣ **Run the program**
```bash
npm run dev
```

---

---

## 📊 Tie-Breaker Calculations

- **Buchholz**: Sum of opponents' scores
- **Sonneborn–Berger**: Sum of opponents' scores weighted by results

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss your ideas.
