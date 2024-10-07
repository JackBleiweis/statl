// netlify/functions/getProfiles.js
const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI; // Use your MongoDB URI from the environment variables

exports.handler = async (event, context) => {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db("your_database_name"); // Replace with your actual database name
        const collection = database.collection("profiles");

        const profiles = await collection.find().toArray(); // Fetch all profiles

        return {
            statusCode: 200,
            body: JSON.stringify(profiles),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error.message }),
        };
    } finally {
        await client.close();
    }
};
