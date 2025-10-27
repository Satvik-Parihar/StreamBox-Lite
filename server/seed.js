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

        // Create Movies with LOCAL poster URLs
        await Show.create([
            {
                title: 'Fight Club',
                duration: '2h 19min',
                posterUrl: '/posters/fight_club.jpg', // <-- LOCAL PATH
                sdUrl: VIDEO_SD, hdUrl: VIDEO_HD, downloadUrl: VIDEO_HD
            },
            {
                title: 'The Dark Knight',
                duration: '2h 32min',
                posterUrl: '/posters/dark_knight.jpg', // <-- LOCAL PATH
                sdUrl: VIDEO_SD, hdUrl: VIDEO_HD, downloadUrl: VIDEO_HD
            },
            {
                title: 'Interstellar',
                duration: '2h 49min',
                posterUrl: '/posters/interstellar.jpg', // <-- LOCAL PATH
                sdUrl: VIDEO_SD, hdUrl: VIDEO_HD, downloadUrl: VIDEO_HD
            },
            {
                title: 'Pulp Fiction',
                duration: '2h 34min',
                posterUrl: '/posters/pulp_fiction.jpg', // <-- LOCAL PATH
                sdUrl: VIDEO_SD, hdUrl: VIDEO_HD, downloadUrl: VIDEO_HD
            },
            {
                title: 'Oppenheimer',
                duration: '3h 0m',
                posterUrl: '/posters/oppenheimer.jpg', // <-- LOCAL PATH
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