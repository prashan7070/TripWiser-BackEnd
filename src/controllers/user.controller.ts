import { Request, Response } from 'express';
import {User} from '../models/User';


interface MulterRequest extends Request {
  file?: Express.Multer.File;
  user?: { id: string };
}

export const userController = {

  // GET  USER PROFILE
  
  getMe: async (req: MulterRequest, res: Response) => {
    try {
      
      const user = await User.findById(req.user?.id).select('-password'); // Exclude password
      
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

      //Cloudinary Image Upload
      if (req.file) {
        updates.avatar = req.file.path; // Cloudinary URL
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.user?.id,
        { $set: updates },
        { new: true } // Return the updated document
      ).select('-password');

      res.status(200).json(updatedUser);

    } catch (error) {
      res.status(500).json({ message: "Error updating profile" });
    }
  }
};