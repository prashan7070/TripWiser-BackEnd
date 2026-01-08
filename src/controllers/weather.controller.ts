import { Request, Response } from 'express';
import axios from 'axios';

export const weatherController = {
  getWeather: async (req: Request, res: Response) => {
    try {
      const { lat, lng, date } = req.query;

      if (!lat || !lng) {
        return res.status(400).json({ message: "Coordinates required" });
      }

      //Calculate how far away the trip is
      const targetDate = date ? new Date(date as string) : new Date();
      const today = new Date();
      const diffTime = targetDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Helper to identify rain/storm codes from OpenWeather
      const isBadWeather = (id: number) => id >= 200 && id <= 531;

      
      // Date is within 5 days (Use Real API)
      
      if (diffDays <= 5 && diffDays >= -1) {
        // Use 5-Day Forecast API
        const response = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
          params: {
            lat,
            lon: lng,
            units: 'metric',
            appid: process.env.OPENWEATHER_KEY
          }
        });

        // The API returns data every 3 hours. We try to find the entry for 12:00 PM on the target date.
        // If not found (e.g. today), we take the first available item.
        const targetDateString = targetDate.toISOString().split('T')[0];
        
        const forecast = response.data.list.find((item: any) => 
          item.dt_txt.includes(targetDateString) && item.dt_txt.includes("12:00:00")
        ) || response.data.list[0];

        const weatherId = forecast.weather[0].id;

        res.status(200).json({
          temp: Math.round(forecast.main.temp),
          condition: forecast.weather[0].main,
          description: forecast.weather[0].description,
          icon: forecast.weather[0].icon,
          humidity: forecast.main.humidity,
          windSpeed: forecast.wind.speed,
          dataType: "LIVE_ACCURATE",
          warning: isBadWeather(weatherId) ? `⚠️ Rain predicted for ${targetDateString}.` : null
        });
      } 
      
      
      //Seasonal Logic
     
      else {
        const month = targetDate.getMonth(); // 0 = Jan, 11 = Dec
        let warning = null;
        let condition = "Likely Sunny";
        let icon = "01d"; // Clear sky icon

        // Sri Lanka Monsoon Logic
        // West/South (Longitude < 80.8): Rainy May-Sept
        // East/North (Longitude > 80.8): Rainy Oct-Jan
        const isWestSide = Number(lng) < 80.8;

        if (isWestSide) {
          if (month >= 4 && month <= 8) { // May - Sept
            warning = "⚠️ Southwest Monsoon season. Expect rain.";
            condition = "Monsoon Season";
            icon = "10d"; // Rain icon
          }
        } else {
          if (month >= 9 || month === 0) { // Oct - Jan
            warning = "⚠️ Northeast Monsoon season. Expect rain.";
            condition = "Monsoon Season";
            icon = "10d";
          }
        }

        res.status(200).json({
          temp: 29, 
          condition: condition,
          description: "seasonal average",
          icon: icon,
          humidity: 75,
          windSpeed: 10,
          dataType: "SEASONAL_AVERAGE",
          warning: warning
        });
      }

    } catch (error) {
      console.error("Weather API Error:", error);
      res.status(500).json({ message: "Failed to fetch weather data" });
    }
  }
};