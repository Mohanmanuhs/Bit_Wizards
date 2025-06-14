const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
/* app.use('/api/users', require('./routes/userRoutes')); */
app.use('/api/clubs', require('./routes/clubRoutes'));
/*app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/engagements', require('./routes/engagementRoutes'));

// Error middleware
const { errorHandler } = require('./middleware/errorMiddleware');
app.use(errorHandler);
 */
module.exports = app;
