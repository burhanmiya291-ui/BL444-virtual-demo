# BL444 Virtual Online Demo

এই project-টি একটি online, server-backed **Virtual Coin Demo**।

## চালানো
1. Node.js 18+ ইনস্টল করুন।
2. terminal-এ project folder-এ যান।
3. `npm install`
4. `npm start`
5. browser-এ `http://localhost:3000`

## Online করতে
Render/Railway/অন্য Node.js hosting-এ deploy করা যাবে। Production-এ database, authentication, rate limiting এবং persistent storage যোগ করা উচিত।

## গুরুত্বপূর্ণ
এটি virtual coins-এর demo। Real-money gambling, deposits, cash betting বা withdrawals নেই।
বর্তমান starter version-এর user data RAM-এ থাকে; server restart হলে data হারাবে। হাজারো concurrent user-এর production deployment-এর জন্য PostgreSQL/Redis ও scalable hosting দরকার।
