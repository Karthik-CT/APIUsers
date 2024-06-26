const express = require("express");
const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// Import the JSON data
const data = require("./data.json");

// API endpoint to get coupon code by email
app.get("/api/coupon", (req, res) => {
  const email = req.query.email;
  if (!email) {
    return res.status(400).json({ error: "Email query parameter is required" });
  }

  const user = data.users.find((user) => user.email === email);

  if (user) {
    res.json({ coupon_code: user.coupon_code });
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
