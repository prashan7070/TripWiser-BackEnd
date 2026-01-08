import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"

// Routes Imports
import authRoutes from './routes/auth.routes';
import tripRoutes from './routes/trip.routes';
import weatherRoutes from './routes/weather.routes'; 
import mapRoutes from './routes/map.routes';        
import hotelRoutes from './routes/hotel.routes'; 
import userRoutes from './routes/user.routes';
import aiRoutes from "./routes/ai.routes"
import attractionRoutes from './routes/attraction.routes';


dotenv.config()

const SERVER_PORT = process.env.SERVER_PORT || 5000
const MONGO_URI = process.env.MONGO_URI as string

const app = express()

app.use(express.json())


app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
)

// Endpoints
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/user", userRoutes)
app.use("/api/v1/trip", tripRoutes)
app.use("/api/v1/weather", weatherRoutes) 
app.use("/api/v1/map", mapRoutes)         
app.use("/api/v1/hotel", hotelRoutes) 
app.use('/api/v1/ai', aiRoutes)
app.use("/api/v1/attraction", attractionRoutes);; 

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ DB connected")
  })
  .catch((err) => {
    console.error(` DB connection fail: ${err}`)
    process.exit(1)
  })

app.listen(SERVER_PORT, () => {
  console.log(`🚀 Server is running on ${SERVER_PORT}`)
})