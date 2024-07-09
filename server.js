// const express = require("express");
// const app = express();
// const port = process.env.PORT || 3000;
// const fs = require("fs");
// const dataPath = "./data.json";

// // Middleware to parse JSON
// app.use(express.json());

// // Import the JSON data
// let data = require(dataPath);

// // Function to get email and coupon_code from request
// const getEmailAndCouponCode = (req) => {
//   const email = req.body.email || req.headers.email;
//   const coupon_code = req.body.coupon_code || req.headers.coupon_code;
//   return { email, coupon_code };
// };

// // API endpoint to get coupon code by email
// app.get("/api/coupon", (req, res) => {
//   const email = req.query.email;
//   if (!email) {
//     return res.status(400).json({ error: "Email query parameter is required" });
//   }

//   const user = data.users.find((user) => user.email === email);
//   if (user) {
//     res.json({ coupon_code: user.coupon_code, data: user });
//   } else {
//     res.status(404).json({ error: "User not found" });
//   }
// });

// // API endpoint to add a new user
// app.post("/api/coupon", (req, res) => {
//   const { email, coupon_code } = getEmailAndCouponCode(req);
//   if (!email || !coupon_code) {
//     return res
//       .status(400)
//       .json({ error: "Email and coupon code are required" });
//   }

//   const existingUser = data.users.find((user) => user.email === email);
//   if (existingUser) {
//     return res.status(400).json({ error: "User already exists" });
//   }

//   data.users.push({ email, coupon_code });
//   fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

//   res.status(201).json({ message: "User added successfully", data: data });
// });

// // API endpoint to update an existing user's coupon code
// app.put("/api/coupon", (req, res) => {
//   const { email, coupon_code } = getEmailAndCouponCode(req);
//   if (!email || !coupon_code) {
//     return res
//       .status(400)
//       .json({ error: "Email and coupon code are required" });
//   }

//   const user = data.users.find((user) => user.email === email);
//   if (user) {
//     user.coupon_code = coupon_code;
//     fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

//     res.json({ message: "Coupon code updated successfully" });
//   } else {
//     res.status(404).json({ error: "User not found" });
//   }
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });

const express = require("express");
const fs = require("fs");
const app = express();
const port = process.env.PORT || 3000;
const dataPath = "./data.json";

// Middleware to parse JSON
app.use(express.json());

// Import the JSON data
let data = require(dataPath);

// Function to get email from request
const getEmailFromRequest = (req) => req.body.email || req.headers.email;

// API endpoint to get coupon code by email
app.get("/api/coupon", (req, res) => {
  const { email } = req.query;
  if (!email)
    return res.status(400).json({ error: "Email query parameter is required" });

  const user = data.users.find((user) => user.email === email);
  if (user) {
    res.json({ coupon_code: user.coupon_code, data: user });
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// API endpoint to add a new user
app.post("/api/coupon", (req, res) => {
  const { email, coupon_code } = req.body;
  if (!email || !coupon_code)
    return res
      .status(400)
      .json({ error: "Email and coupon code are required" });

  if (data.users.some((user) => user.email === email)) {
    return res.status(400).json({ error: "User already exists" });
  }

  const newUser = { ...req.body };
  data.users.push(newUser);
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

  res.status(201).json({ message: "User added successfully", data: newUser });
});

// API endpoint to update an existing user's data
app.put("/api/coupon", (req, res) => {
  const email = getEmailFromRequest(req);
  if (!email) return res.status(400).json({ error: "Email is required" });

  const userIndex = data.users.findIndex((user) => user.email === email);
  if (userIndex !== -1) {
    data.users[userIndex] = { ...data.users[userIndex], ...req.body };
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

    res.json({
      message: "User data updated successfully",
      data: data.users[userIndex],
    });
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
