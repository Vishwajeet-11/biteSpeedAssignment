// app.js (or server.js)

import express from 'express';
import userRoutes from './routes/userRoute.js';

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Use user routes
app.use('/api/users', userRoutes);

// Additional app setup and middleware
// ...

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
