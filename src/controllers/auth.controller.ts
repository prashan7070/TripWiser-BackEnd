import { Request, Response } from "express"
import { IUser, Role , User } from "../models/User"
import bcrypt from "bcryptjs"
import { signAccessToken, signRefreshToken } from "../utils/tokens"
import { AuthRequest } from "../middleware/auth"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { json } from "stream/consumers"
dotenv.config()


const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string

export const register = async(req:Request , res:Response)=>{
    try{

        const {firstname , lastname , email , password , role} = req.body

    if (!firstname || !lastname || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" })
    }

    if (role !== Role.USER) {
      return res.status(400).json({ message: "Invalid role" })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "Email alrady registered" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      roles: role,
    })

    await newUser.save()

    res.status(201).json({

        message:"User Registered Successfully",

        data: {
        id: newUser._id,
        email: newUser.email,
        roles: newUser.role,
        
      }

    })


    }catch(err:any){

        res.status(500).json({message:err?.message})

    }
}



export const login = async(req:Request , res:Response)=>{

    try{

        const {email , password} = req.body

        const existingUser = await User.findOne({email})

        if(!existingUser){
            return res.status(401).json({message:"Invalid credentials"})
        }

        const accessToken = signAccessToken(existingUser)
        const refreshToken = signRefreshToken(existingUser)

        res.status(200).json({
            message: "success",
            data:{
                email:existingUser.email,
                role:existingUser.role,
                accessToken,
                refreshToken
            }
        })
        
    }catch(err:any){
        res.status(500).json({message:err?.message})
    }



}




export const handleRefreshToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.body
    if (!token) {
      return res.status(400).json({ message: "Token required" })
    }
    // import jwt from "jsonwebtoken"
    const payload = jwt.verify(token, JWT_REFRESH_SECRET)
    // payload.sub - userID
    const user = await User.findById(payload.sub)
    if (!user) {
      return res.status(403).json({ message: "Invalid refresh token" })
    }
    const accessToken = signAccessToken(user)
    res.status(200).json({ accessToken })
  } catch (err) {
    res.status(403).json({ message: "Invalid or expire token" })
  }
}
