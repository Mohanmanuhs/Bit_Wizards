const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();

const corsOptions = {
  origin: 'http://localhost:5173', // Your frontend origin
  credentials: true, // Allow credentials (cookies)
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};




// Middleware
app.use(cors(corsOptions));


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}))

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/clubs', require('./routes/clubRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));


app.use('/api/engagements', require('./routes/engagementRoutes'));

// Error middleware
/*const { errorHandler } = require('./middleware/errorMiddleware');
app.use(errorHandler); */

module.exports = app;
