if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const mongoose = require('mongoose');
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')
const Campground = require('../models/campground')
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken  })

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewURLParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected");
})

const sample = array => array[Math.floor(Math.random() * array.length)];

console.log("Creating Seeds...")

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const loc = `${cities[random1000].city}, ${cities[random1000].state}`
        const geoData = await geocoder.forwardGeocode({
            query: loc,
            limit: 1
        }).send()
        const camp = new Campground({
            author: '61f255604c6f13ff70f5e184',
            location: loc,
            geometry: geoData.body.features[0].geometry,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/dmgehum91/image/upload/v1644050400/YelpCamp/jfwyfpojg9vd8tyv47dn.jpg',
                    filename: 'YelpCamp/jfwyfpojg9vd8tyv47dn'
                },
                {
                    url: 'https://res.cloudinary.com/dmgehum91/image/upload/v1644050402/YelpCamp/pwoll8blw3puyfkqjqef.jpg',
                    filename: 'YelpCamp/pwoll8blw3puyfkqjqef'
                }],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis, exercitationem laudantium, porro delectus laborum nisi, ex fugiat voluptates adipisci deserunt quisquam commodi quo. Error eveniet iste ab alias ut eaque!',
            price
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})