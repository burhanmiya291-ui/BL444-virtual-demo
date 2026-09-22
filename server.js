const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const users = new Map();

function getUser(username) {
  return users.get(String(username).trim().toLowerCase());
}

app.post("/api/register", (req, res) => {
  const username = String(req.body.username || "").trim();
  if (!username) return res.status(400).json({ error: "Username required" });

  const key = username.toLowerCase();
  if (!users.has(key)) {
    users.set(key, {
      username,
      balance: 1000,
      games: [],
      createdAt: new Date().toISOString()
    });
  }
  const u = users.get(key);
  res.json({ username: u.username, balance: u.balance, games: u.games });
});

app.get("/api/user/:username", (req, res) => {
  const u = getUser(req.params.username);
  if (!u) return res.status(404).json({ error: "User not found" });
  res.json({ username: u.username, balance: u.balance, games: u.games });
});

app.post("/api/game", (req, res) => {
  const username = String(req.body.username || "").trim();
  const game = String(req.body.game || "").trim();
  const bet = Number(req.body.bet);

  const u = getUser(username);
  if (!u) return res.status(404).json({ error: "User not found" });
  if (!Number.isFinite(bet) || bet <= 0) return res.status(400).json({ error: "Invalid virtual coin bet" });
  if (bet > u.balance) return res.status(400).json({ error: "Not enough virtual coins" });

  let result = "";
  let payout = 0;

  if (game === "coin") {
    const side = Math.random() < 0.5 ? "Heads" : "Tails";
    result = side;
    payout = side === "Heads" ? bet * 2 : 0;
  } else if (game === "roulette") {
    const n = Math.floor(Math.random() * 37);
    result = String(n);
    payout = n === 0 ? bet * 2 : bet * 2;
  } else if (game === "slot") {
    const symbols = ["🍒", "🍋", "🔔", "⭐", "7️⃣"];
    const a = symbols[Math.floor(Math.random() * symbols.length)];
    const b = symbols[Math.floor(Math.random() * symbols.length)];
    const c = symbols[Math.floor(Math.random() * symbols.length)];
    result = `${a} ${b} ${c}`;
    payout = (a === b && b === c) ? bet * 5 : 0;
  } else {
    return res.status(400).json({ error: "Unknown game" });
  }

  u.balance = u.balance - bet + payout;
  u.games.unshift({
    game, bet, payout, result,
    at: new Date().toISOString()
  });
  u.games = u.games.slice(0, 50);

  res.json({ username: u.username, balance: u.balance, result, payout, games: u.games });
});

app.get("/api/admin/users", (req, res) => {
  res.json([...users.values()].map(u => ({
    username: u.username,
    balance: u.balance,
    games: u.games.length,
    createdAt: u.createdAt
  })));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => console.log(`BL444 Virtual Demo running on port ${PORT}`));
