const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const queueRoutes = require("./routes/queueRoutes");
const analyticsRoutes = require(
  "./routes/analyticsRoutes"
);

const doctorRoutes = require(
  "./routes/doctorRoutes"
);

const hospitalRoutes = require(
  "./routes/hospitalRoutes"
);

dotenv.config();
connectDB();

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

app.use("/api/queue", queueRoutes);

app.use(
  "/api/analytics",
  analyticsRoutes
);

app.use(
  "/api/doctors",
  doctorRoutes
);

app.use(
  "/api/hospitals",
  hospitalRoutes
);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    application: "QueueCure Pro",
    status: "Running",
    timestamp: new Date(),
  });
});

io.on("connection", (socket) => {
  console.log(`🔌 Client Connected: ${socket.id}`);

  socket.emit("connected", {
    success: true,
    message: "QueueCure Live Server Connected",
  });

  socket.on("disconnect", () => {
    console.log(
      `❌ Client Disconnected: ${socket.id}`
    );
  });
});

app.set("io", io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(
    `🚀 QueueCure Backend Running On Port ${PORT}`
  );
});