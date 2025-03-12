// "use strict"
// const {
//     db: { host, port, name },
//   } = require("../configs/config.mongodb");
// const mongoose = require('mongoose');
// const connectDB = `mongodb://localhost:27017/dev`;
// class Database {
//     constructor(){
//         this.connect();
//     }

//     connect(type = "mongodb"){
//         if(1 === 1){
//             mongoose.set('debug', true);
//             mongoose.set("debug", { color: true });
//         }
//         mongoose.connect(connectDB)
//     }
//     static getInstance(){
//         if(Database.instance){
//             Database.instance = new Database();
//         }
//         return Database.instance;
//     }
// }

// const instanceMongodb =  Database.getInstance();
// module.exports = instanceMongodb;

const mongoose = require('mongoose');

const DB_URI = 'mongodb+srv://baopro2206:22062002giabao@cluster0.kkoleaf.mongodb.net/';
const SliderModel = require('../models/slider_model');

class Database {
    constructor() {
        this.init();
    }

    async init() {
        await this.connect();
        // await this.seedData();
    }

    async connect() {
        try {
            await mongoose.connect(DB_URI);
            console.log(`✅ Connected to MongoDB at ${DB_URI}`);
            // await this.seedData();
        } catch (error) {
            console.error('Database connection error:', error);
        }
    }

    async seedData() {
        try {
            if (mongoose.connection.readyState !== 1) {
                console.error("MongoDB is not connected yet!");
                return;
            }

            await SliderModel.deleteMany({});
            console.log('Old data cleared');

            const sampleData = [
                { name: 'Slider 1', status: 'active', ordering: 1, category_id: new mongoose.Types.ObjectId(), imageUrl: 'https://example.com/slider1.jpg' },
                { name: 'Slider 2', status: 'inactive', ordering: 2, category_id: new mongoose.Types.ObjectId(), imageUrl: 'https://example.com/slider2.jpg' },
                { name: 'Slider 3', status: 'active', ordering: 3, category_id: new mongoose.Types.ObjectId(), imageUrl: 'https://example.com/slider3.jpg' }
            ];

            await SliderModel.insertMany(sampleData);
            console.log('Sample data inserted');
        } catch (error) {
            console.error('Error seeding data:', error);
        } finally {
            mongoose.connection.close();
        }
    }
}

new Database();