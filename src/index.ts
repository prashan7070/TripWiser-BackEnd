import express from "express"
import cors from "cors"
import authRouter from "./routes/auth.routes"
import dotenv from "dotenv"
import mongoose from "mongoose"
import authRoutes from './routes/auth.routes';
import tripRoutes from './routes/trip.routes';
import weatherRoutes from './routes/weather.routes'; 
import mapRoutes from './routes/map.routes';        
import hotelRoutes from './routes/hotel.routes'; 
import userRoutes from './routes/user.routes';
dotenv.config()

const SERVER_PORT = process.env.SERVER_PORT
const MONGO_URI = process.env.MONGO_URI as string

const app = express()

app.use(express.json())
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"]
  })
)

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/user", userRoutes)
app.use("/api/v1/trip", tripRoutes)
app.use("/api/v1/weather", weatherRoutes) // New
app.use("/api/v1/map", mapRoutes)         // New
app.use("/api/v1/hotel", hotelRoutes) 

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("DB connected")
  })
  .catch((err) => {
    console.error(`DB connection fail: ${err}`)
    process.exit(1)
  })

app.listen(SERVER_PORT, () => {
  console.log(`Server is running on ${SERVER_PORT}`)
})
