import { Request, Response } from 'express';
import axios from 'axios';
import { getCache, setCache } from '../utils/cache';

const GEOAPIFY_KEY = process.env.GEOAPIFY_KEY;

export const attractionController = {
  getAttractions: async (req: Request, res: Response) => {
    try {
      const { lat, lng } = req.query;

      if (!lat || !lng) {
        return res.status(400).json({ message: "Latitude and Longitude required" });
      }

      const cacheKey = `attractions_${lat}_${lng}`;
      const cachedActivities = getCache(cacheKey);
      if (cachedActivities) {
        return res.status(200).json(cachedActivities);
      }

      const url = `https://api.geoapify.com/v2/places`;

      const response = await axios.get(url, {
        params: {
          categories: 'tourism.sights,natural,entertainment.culture,building.historic',
          filter: `circle:${lng},${lat},5000`, // 5km radius
          limit: 15, 
          apiKey: GEOAPIFY_KEY
        }
      });

      const activities = response.data.features.map((place: any) => {
        return place.properties.name || place.properties.address_line1;
      }).filter((name: string) => name); 

      const uniqueActivities = [...new Set(activities)];

      setCache(cacheKey, uniqueActivities, 3600);
      res.status(200).json(uniqueActivities);

    } catch (error) {
      console.error("Attractions API Failed:", error);
      res.status(200).json([]);
    }
  }
};