import { Request, Response } from 'express';
import axios from 'axios';

export const weatherController = {
  getWeather: async (req: Request, res: Response) => {
    try {
      const { lat, lng } = req.query;

      if (!lat || !lng) {
        return res.status(400).json({ message: "Latitude and Longitude required" });
      }

      const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
        params: {
          lat,
          lon: lng,
          units: 'metric',
          appid: process.env.OPENWEATHER_KEY
        }
      });

      const data = response.data;
      
      // Send  data to frontend
      res.status(200).json({
        temp: Math.round(data.main.temp),
        condition: data.weather[0].main,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed
      });

    } catch (error) {
      console.error("Weather API Error:", error);
      res.status(500).json({ message: "Failed to fetch weather data" });
    }
  }
};