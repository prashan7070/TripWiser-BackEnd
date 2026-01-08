import { Request, Response } from 'express';
import {User} from '../models/User';
import { uploadToCloudinary } from '../config/cloudinary';

interface MulterRequest extends Request {
  file?: Express.Multer.File;
  user?: { sub: string };
}

export const userController = {

  // GET  USER PROFILE
  
  getMe: async (req: MulterRequest, res: Response) => {
    try {

     console.log("Fetching profile for user ID:", req.user?.sub);
      
      const user = await User.findById(req.user?.sub).select('-password'); 
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Error fetching profile" });
    }
  },

  //UPDATE USER PROFILE
  updateUser: async (req: MulterRequest, res: Response) => {
    try {
      const { firstname, lastname } = req.body;
      const updates: any = {};

      if (firstname) updates.firstname = firstname;
      if (lastname) updates.lastname = lastname;

    //   //Cloudinary Image Upload
    //   if (req.file) {
    //     updates.avatar = req.file.path; // Cloudinary URL
    //   }


      if (req.file) {
        console.log("Uploading avatar...");
        try {
          const result = await uploadToCloudinary(req.file.buffer, 'tripwiser-avatars');
          updates.avatar = result.secure_url; // Save the new URL
          console.log("Avatar updated:", updates.avatar);
        } catch (uploadError) {
          console.error("Avatar Upload Failed:", uploadError);
          return res.status(500).json({ message: "Image upload failed" });
        }
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.user?.sub,
        { $set: updates },
        { new: true } // Return the updated document
      ).select('-password');

      res.status(200).json(updatedUser);

    } catch (error) {
      res.status(500).json({ message: "Error updating profile" });
    }
  }
};