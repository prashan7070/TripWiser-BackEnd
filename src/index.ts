import express from "express"
import cors from "cors"
import helmet from "helmet"
import dotenv from "dotenv"
import mongoose from "mongoose"
import dns from "dns"

dns.setDefaultResultOrder("ipv4first")

// Routes Imports
import authRoutes from './routes/auth.routes';
import tripRoutes from './routes/trip.routes';
import weatherRoutes from './routes/weather.routes'; 
import mapRoutes from './routes/map.routes';        
import hotelRoutes from './routes/hotel.routes'; 
import userRoutes from './routes/user.routes';
import aiRoutes from "./routes/ai.routes"
import attractionRoutes from './routes/attraction.routes';
import { errorHandler } from './middleware/errorHandler';
import { setupSwagger } from './config/swagger';
import { globalRateLimiter, authRateLimiter } from './middleware/rateLimiter';

dotenv.config()

const SERVER_PORT = process.env.SERVER_PORT || 5000
const MONGO_URI = process.env.MONGO_URI as string
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173"

const app = express()

// Security Middleware & Rate Limiting
app.use(helmet())
app.use(express.json())
app.use('/api', globalRateLimiter)

// Configured CORS
const allowedOrigins = [CLIENT_URL, "http://localhost:5173", "http://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
)

// Swagger Documentation UI
setupSwagger(app);

// Endpoints
app.use("/api/v1/auth", authRateLimiter, authRoutes)
app.use("/api/v1/user", userRoutes)
app.use("/api/v1/trip", tripRoutes)
app.use("/api/v1/weather", weatherRoutes) 
app.use("/api/v1/map", mapRoutes)         
app.use("/api/v1/hotel", hotelRoutes) 
app.use('/api/v1/ai', aiRoutes)
app.use("/api/v1/attraction", attractionRoutes);

// Global Error Handler Middleware
app.use(errorHandler); 

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ DB connected successfully to Cloud Atlas")
  })
  .catch((err) => {
    console.warn(`⚠️ Primary DB connection failed: ${err.message || err}`);
    console.log("🔄 Attempting fallback to local MongoDB...");
    mongoose
      .connect("mongodb://127.0.0.1:27017/tripWiser")
      .then(() => console.log("✅ DB connected to local MongoDB"))
      .catch((localErr) => {
        console.error(`❌ Local DB connection fail: ${localErr.message || localErr}`);
      });
  })

app.listen(SERVER_PORT, () => {
  console.log(`🚀 Server is running on ${SERVER_PORT}`)
})