import { Request, Response } from "express";
import { User } from "../models/User";
import bcrypt from "bcryptjs";
import { signAccessToken, signRefreshToken } from "../utils/tokens";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import axios from 'axios';
dotenv.config();

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

export const register = async (req: Request, res: Response) => {
  try {
    const { firstname, lastname, email, password, role } = req.body;

    // Validation
    if (!firstname || !lastname || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (role !== "USER") { 
      return res.status(400).json({ message: "Invalid role" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      role: role, 
    });

    await newUser.save();

    res.status(201).json({
      message: "User Registered Successfully",
      user: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err: any) {
    console.error("Register Error:", err);
    res.status(500).json({ message: err?.message || "Server Error" });
  }
};


export const login = async (req: Request, res: Response) => {
  try {
    console.log("Login attempt:", req.body.email);

    const { email, password } = req.body;

    //Find User
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

   
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3. Generate Tokens
    const accessToken = signAccessToken(existingUser);
    const refreshToken = signRefreshToken(existingUser);

  
    res.status(200).json({
      message: "Login successful",
      user: {
        _id: existingUser._id,
        firstname: existingUser.firstname,
        lastname: existingUser.lastname,
        email: existingUser.email,
        role: existingUser.role,
        avatar: existingUser.avatar || "" 
      },
      accessToken,
      refreshToken
    });

  } catch (err: any) {
    console.error("Login Error:", err);
    res.status(500).json({ message: err?.message || "Server Error" });
  }
};


export const handleRefreshToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Token required" });
    }

    const payload: any = jwt.verify(token, JWT_REFRESH_SECRET);
    
    // payload.sub contains the User ID
    const user = await User.findById(payload.sub);
    
    if (!user) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const accessToken = signAccessToken(user);
    res.status(200).json({ accessToken });

  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

export const googleLogin = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({ message: "Google Token required" });
      }
      
      const googleResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const { email, given_name, family_name, picture, sub } = googleResponse.data;

     
      let user = await User.findOne({ email });

      if (!user) {
        
        const randomPassword = Math.random().toString(36).slice(-8) + "Aa1@";
        const hashedPassword = await bcrypt.hash(randomPassword, 10);

        user = new User({
          firstname: given_name,
          lastname: family_name || "User",
          email: email,
          password: hashedPassword,
          role: "USER", 
          avatar: picture, 
          googleId: sub
        });

        await user.save();
      }

      const accessToken = signAccessToken(user);
      const refreshToken = signRefreshToken(user);

      res.status(200).json({
        message: "Google Login successful",
        user: {
          _id: user._id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          role: user.role,
          avatar: user.avatar
        },
        accessToken,
        refreshToken
      });

    } catch (error: any) {
      console.error("Google Auth Error:", error.response?.data || error.message);
      res.status(401).json({ message: "Invalid Google Token" });
    }
  
};



