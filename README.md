# 🚀 TripWiser - Intelligent Travel Backend

The backend service for **TripWiser**, a smart travel planning application. This API handles user authentication, AI itinerary generation, real-time data fetching (Weather, Maps, Hotels), and manages the MongoDB database.

Built with **Node.js**, **Express**, **TypeScript**, and **MongoDB**.

---

## 🌟 Key Features

*   **🔐 Secure Authentication:**
    *   JWT-based Auth (Access & Refresh Tokens).
    *   Google OAuth integration.
    *   Password Hashing (Bcrypt) & Reset Password flow (Nodemailer).
*   **🧠 AI Powered:**
    *   Generates custom trip itineraries using **Google Gemini 1.5 Flash**.
    *   Weather-aware logic to warn users about monsoon seasons.
*   **🌍 Real-Time Travel Data:**
    *   **Weather:** Live forecasts via OpenWeatherMap.
    *   **Maps:** Geocoding & Location Search via LocationIQ.
    *   **Stays & Fun:** Hotel & Attraction search via Geoapify.
*   **☁️ Cloud Storage:**
    *   Image uploads (Profile pics & Trip covers) using **Cloudinary**.
*   **🗄️ Robust Database:**
    *   Complex MongoDB schema for Multi-stop trips and User profiles.

---

## 🛠️ Tech Stack

| Category | Technologies |
| :--- | :--- |
| **Runtime** | [Node.js](https://nodejs.org/) |
| **Framework** | [Express.js](https://expressjs.com/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Database** | [MongoDB Atlas](https://www.mongodb.com/atlas) + Mongoose |
| **AI Model** | [Google Gemini](https://ai.google.dev/) |
| **Storage** | [Cloudinary](https://cloudinary.com/) |
| **Auth** | JSON Web Tokens (JWT) |
| **Email** | Nodemailer + Mailgen |

---

## ⚙️ Environment Variables

To run this server, create a `.env` file in the root of the `server` directory and add the following variables:

```env
# --- SERVER & DB ---
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/tripwiser?retryWrites=true&w=majority
```
---

###  AUTHENTICATION 
```
#### JWT_SECRET=your_super_secret_access_key
#### JWT_REFRESH_SECRET=your_super_secret_refresh_key
#### CLIENT_URL=http://localhost:5173
```

---


###  CLOUDINARY (Image Uploads) 

```
#### CLOUDINARY_CLOUD_NAME=your_cloud_name
#### CLOUDINARY_API_KEY=your_api_key
#### CLOUDINARY_API_SECRET=your_api_secret
```
---


### AI & EXTERNAL API
```
#### GEMINI_API_KEY=your_google_gemini_key
#### OPENWEATHER_KEY=your_openweather_key
#### LOCATIONIQ_KEY=your_locationiq_key
#### GEOAPIFY_KEY=your_geoapify_key
#### AMADEUS_CLIENT_ID=your_amadeus_id
#### AMADEUS_CLIENT_SECRET=your_amadeus_secret
```

---


### EMAIL SERVICE (Mailtrap/Gmail) 

```
#### EMAIL_HOST=sandbox.smtp.mailtrap.io
#### EMAIL_PORT=2525
#### EMAIL_USER=your_mailtrap_user
#### EMAIL_PASS=your_mailtrap_password
```

---


#  📦 Installation & Setup

1. Clone the Repository
code
```Bash
git clone https://github.com/yourusername/tripwiser-backend.git
cd tripwiser-backend
```

## 2. Install Dependencies
code
```Bash
npm install
```

## 3. Run Development Server
This uses nodemon and ts-node for hot-reloading.
code
```Bash
npm run dev
```

### The server should start on: http://localhost:5000
