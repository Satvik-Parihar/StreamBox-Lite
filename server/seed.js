require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Show = require('./models/Show');

const MONGODB_URI = process.env.MONGO_URI;

const seedData = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('MongoDB connected for seeding...');

        // Clear existing data
        await User.deleteMany({});
        await Show.deleteMany({});
        console.log('Cleared existing data.');

        // Create Users (Passwords will be hashed by pre-save hook)
        await User.create([
            { email: 'free@user.com', password: 'password123', plan: 'FREE' },
            { email: 'standard@user.com', password: 'password123', plan: 'STANDARD' },
            { email: 'premium@user.com', password: 'password123', plan: 'PREMIUM' },
            { email: 'admin@user.com', password: 'password123', role: 'admin', plan: 'PREMIUM' },
        ]);
        console.log('Users created. Password for all is "password123".');

        // Create Shows (now movies)
        await Show.create([
            { 
                title: 'Inception', 
                duration: '2h 28min', 
                posterUrl: 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq27gApcjEa6AFqO4.jpg', 
                sdUrl: '/play/inception/sd', hdUrl: '/play/inception/hd', downloadUrl: '/download/inception' 
            },
            { 
                title: 'The Dark Knight', 
                duration: '2h 32min', 
                posterUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', 
                sdUrl: '/play/darkknight/sd', hdUrl: '/play/darkknight/hd', downloadUrl: '/download/darkknight' 
            },
            { 
                title: 'Interstellar', 
                duration: '2h 49min', 
                posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', 
                sdUrl: '/play/interstellar/sd', hdUrl: '/play/interstellar/hd', downloadUrl: '/download/interstellar' 
            },
            { 
                title: 'The Matrix', 
                duration: '2h 16min', 
                posterUrl: 'https://image.tmdb.org/t/p/w500/f89JxwLokLdE00kTe9Tz6r7xOJE.jpg', 
                sdUrl: '/play/matrix/sd', hdUrl: '/play/matrix/hd', downloadUrl: '/download/matrix' 
            },
            { 
                title: 'Oppenheimer', 
                duration: '3h 0m', 
                posterUrl: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg', 
                sdUrl: '/play/oppenheimer/sd', hdUrl: '/play/oppenheimer/hd', downloadUrl: '/download/oppenheimer' 
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