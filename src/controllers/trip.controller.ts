import { Request, Response } from 'express';
import Trip from '../models/Trip';

// Multer file
interface MulterRequest extends Request {
  file?: Express.Multer.File;
  user?: { sub: string };
}

export const tripController = {

  // CREATE TRIP
  createTrip: async (req: MulterRequest, res: Response) => {
    try {
      
      let { title, startDate, endDate, budget, travelStyle, stops, notes, isAiGenerated } = req.body;

      
      if (typeof stops === 'string') {
        stops = JSON.parse(stops);
      }

      
      let coverImage = "";
      if (req.file) {
        coverImage = req.file.path; 
      }

      
      const newTrip = new Trip({
        userId: req.user?.sub,
        title,
        startDate,
        endDate,
        budget: Number(budget), 
        travelStyle,
        stops,
        notes,
        coverImage, // Cloudinary URL
        isAiGenerated: isAiGenerated === 'true' || isAiGenerated === true,
        status: 'active'
      });

      const savedTrip = await newTrip.save();
      res.status(201).json(savedTrip);

    } catch (error: any) {
      console.error("Trip Create Error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // GET ALL TRIPS
  getUserTrips: async (req: MulterRequest, res: Response) => {
    try {
      const trips = await Trip.find({ userId: req.user?.sub }).sort({ startDate: 1 });
      res.status(200).json(trips);
    } catch (error) {
      res.status(500).json({ message: "Error fetching trips" });
    }
  },

  // GET SINGLE TRIP
  getTripById: async (req: MulterRequest, res: Response) => {
    try {
      const trip = await Trip.findById(req.params.id);
      if (!trip) return res.status(404).json({ message: "Trip not found" });
      if (trip.userId.toString() !== req.user?.sub) return res.status(403).json({ message: "Unauthorized" });
      
      res.status(200).json(trip);
    } catch (error) {
      res.status(500).json({ message: "Error fetching trip" });
    }
  },

  // DELETE TRIP
  deleteTrip: async (req: MulterRequest, res: Response) => {
    try {
      const deleted = await Trip.findOneAndDelete({ _id: req.params.id, userId: req.user?.sub });
      if (!deleted) return res.status(404).json({ message: "Trip not found" });
      res.status(200).json({ message: "Trip deleted" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting trip" });
    }
  }
};
