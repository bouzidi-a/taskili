const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const workRoutes = require("./routes/workRoutes");
const userRoutes = require("./routes/userRoutes");
const bidRoutes = require("./routes/bidRoutes");
const statsRoutes = require("./routes/statsRoutes");
const errorHandler = require("./middlewares/errorHandler");
const passport = require("./config/passport");

const app = express();

// --- Middlewares ---
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(passport.initialize());

// --- Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/works", workRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bids", bidRoutes);
app.use("/api/stats", statsRoutes);

// --- Global Error Handler ---
app.use(errorHandler);

module.exports = app;
