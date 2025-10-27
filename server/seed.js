require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Show = require('./models/Show');

const MONGODB_URI = process.env.MONGO_URI;

// Free, sample videos
const VIDEO_SD = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
const VIDEO_HD = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4';

const seedData = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('MongoDB connected for seeding...');

        // Clear existing data
        await User.deleteMany({});
        await Show.deleteMany({});
        console.log('Cleared existing data.');

        // Create Users
        await User.create([
            { email: 'free@user.com', password: 'password123', plan: 'FREE' },
            { email: 'standard@user.com', password: 'password123', plan: 'STANDARD' },
            { email: 'premium@user.com', password: 'password123', plan: 'PREMIUM' },
            { email: 'admin@user.com', password: 'password123', role: 'admin', plan: 'PREMIUM' },
        ]);
        console.log('Users created. Password for all is "password123".');

        // Create Movies
        await Show.create([
            { 
                title: 'Inception', 
                duration: '2h 28min', 
                posterUrl: 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq27gApcjEa6AFqO4.jpg', 
                sdUrl: VIDEO_SD, hdUrl: VIDEO_HD, downloadUrl: VIDEO_HD
            },
            { 
                title: 'The Dark Knight', 
                duration: '2h 32min', 
                posterUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', 
                sdUrl: VIDEO_SD, hdUrl: VIDEO_HD, downloadUrl: VIDEO_HD
            },
            { 
                title: 'Interstellar', 
                duration: '2h 49min', 
                posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', 
                sdUrl: VIDEO_SD, hdUrl: VIDEO_HD, downloadUrl: VIDEO_HD
            },
            { 
                title: 'The Matrix', 
                duration: '2h 16min', 
                posterUrl: 'https://image.tmdb.org/t/p/w500/f89JxwLokLdE00kTe9Tz6r7xOJE.jpg', 
                sdUrl: VIDEO_SD, hdUrl: VIDEO_HD, downloadUrl: VIDEO_HD
            },
            { 
                title: 'Oppenheimer', 
                duration: '3h 0m', 
                posterUrl: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg', 
                sdUrl: VIDEO_SD, hdUrl: VIDEO_HD, downloadUrl: VIDEO_HD 
            },
        ]);
        console.log('Movies created.');

        console.log('Database seeded successfully!');
        mongoose.connection.close();
        process.exit(0);

    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

seedData();