const mongoose = require('mongoose');
const User = require('./models/User');
const Department = require('./models/Department');
require('dotenv').config();

// Sample department data
const departments = [
    {
        name: 'Neurosurgeon',
        availableDay: 'Wednesday',
        totalSlots: 10,
        availableSlots: 10,
        nextAvailableDate: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    },
    {
        name: 'Neurophysician',
        availableDay: 'Friday',
        totalSlots: 20,
        availableSlots: 20,
        nextAvailableDate: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    },
    {
        name: 'Cardiology',
        availableDay: 'Tuesday',
        totalSlots: 70,
        availableSlots: 70,
        nextAvailableDate: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    },
    {
        name: 'Pediatric Cardiology',
        availableDay: 'Friday',
        totalSlots: 10,
        availableSlots: 10,
        nextAvailableDate: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }
];

// Admin user data
const adminUser = {
    email: 'tejaswi',
    password: 'bannu',
    role: 'admin'
};

// Seed function
async function seed() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hospital-appointments');

        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Department.deleteMany({});

        // Insert admin user
        const user = new User(adminUser);
        await user.save();

        // Insert departments
        await Department.insertMany(departments);

        console.log('Database seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seed();
