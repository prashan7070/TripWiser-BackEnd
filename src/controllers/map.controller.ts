import { Request, Response } from 'express';
import axios from 'axios';

export const mapController = {
  searchLocation: async (req: Request, res: Response) => {
    try {
      const { query } = req.query;

      if (!query) {
        return res.status(400).json({ message: "Search query required" });
      }

      const response = await axios.get('https://us1.locationiq.com/v1/search', {
        params: {
          key: process.env.LOCATIONIQ_KEY,
          q: query,
          format: 'json',
          limit: 1, //top result
          countrycodes: 'lk'
        }
      });

      if (response.data && response.data.length > 0) {
        const place = response.data[0];
        res.status(200).json({
          lat: parseFloat(place.lat),
          lng: parseFloat(place.lon),
          displayName: place.display_name
        });
      } else {
        res.status(404).json({ message: "Location not found" });
      }

    } catch (error) {
      console.error("Map API Error:", error);
      res.status(500).json({ message: "Failed to fetch location" });
    }
  }
};