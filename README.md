# 🎓 Campus Pulse - College Club Central Hub

A centralized MERN-based web platform to unify all student clubs, events, announcements, and media content of a college under one digital roof. Built to reduce communication clutter and foster better engagement within the student community.

## 🚀 Features

- 📢 **Event Announcements:** Post and manage upcoming club events with images, RSVP options, and details.
- 📰 **News & Updates:** College-level announcements featured on the homepage.
- 🎥 **Media Gallery:** Upload and view videos, photos, podcasts, and event highlights.
- 📃 **Club Pages:** Each club gets a dedicated page with description, coordinator info, and activity log.
- 👥 **Student Engagement:** Students can follow clubs, comment on posts, and receive notifications.
- 🔍 **Smart Search & Filter:** Discover events and content by date, club, or category.

## 🌐 Live Demo

🚧 _Coming Soon_ (or add your deployed link here)

## 🛠️ Tech Stack

**Frontend:**  
- React.js  
- Tailwind CSS / Bootstrap (Optional for styling)  
- Axios  
- React Router  

**Backend:**  
- Node.js  
- Express.js  

**Database:**  
- MongoDB (with Mongoose ODM)

**Authentication:**  
- JWT (JSON Web Token)  
- Bcrypt.js (for password hashing)  

**Deployment:**  
- Render / Vercel / Netlify (Frontend)  
- Render / Railway / Heroku (Backend)  
- MongoDB Atlas (Database)

## 🔐 User Roles

- **Admin:** Can manage all clubs, moderate content, and post official announcements.
- **Club Coordinators:** Can manage their club page, post events, and upload media.
- **Students:** Can follow clubs, RSVP for events, and comment on posts.

## 📦 Installation

1. **Clone the repository:**

```bash
git clone https://github.com/Mohanmanuhs/Bit_Wizards.git
cd Bit_Wizards 
```

## Set up the backend:
```bash
cd backend
npm install
```

## Set up the frontend:
```bash
cd ../frontend
npm install
```

## Configure environment variables:
  Create a .env file in the server folder with:
  PORT=5000
  MONGO_URI=your_mongodb_connection_string
  JWT_SECRET=your_secret_key


## Run the development servers:
  # In /backend
    npm start
  # In /frontend
    npm start

## 🧪 Future Improvements
  📱 PWA Support for mobile-friendly experience
  🔔 Push Notifications
  📊 Analytics dashboard for club engagement
  🗓️ Integration with Google Calendar

## 🙌 Contributors
 - Dilson J Fernandes
 - Guru Kiran N
 - Mohan H S
 - Nandeesh J Aradya
