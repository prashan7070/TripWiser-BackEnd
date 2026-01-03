import { Request, Response } from 'express';
import axios from 'axios';

const GEOAPIFY_KEY = process.env.GEOAPIFY_KEY;

export const hotelController = {
  getHotels: async (req: Request, res: Response) => {
    try {
      const { lat, lng } = req.query;

      if (!lat || !lng) {
        return res.status(400).json({ message: "Latitude and Longitude required" });
      }

      
      const url = `https://api.geoapify.com/v2/places`;

      const response = await axios.get(url, {
        params: {
          categories: 'accommodation.hotel,accommodation.hostel,accommodation.guest_house', 
          filter: `circle:${lng},${lat},5000`, 
          limit: 20, 
          apiKey: GEOAPIFY_KEY
        }
      });

      
      const hotels = response.data.features.map((place: any) => {
        const p = place.properties;
        return {
          name: p.name || p.address_line1 || "Unnamed Hotel", 
          hotelId: place.properties.place_id,
          // Calculate distance manually or just return the address line
          address: p.address_line2 || p.city, 
          distance: p.distance ? `${p.distance} m` : "Nearby",
          rating: p.rank ? p.rank.popularity : 0, // 'popularity' rank
          geoCode: {
            latitude: p.lat,
            longitude: p.lon
          }
        };
      });

      res.status(200).json(hotels);

    } catch (error) {
      console.error("Geoapify Error:", error);
      res.status(500).json({ message: "Failed to fetch real hotel data" });
    }
  }
};