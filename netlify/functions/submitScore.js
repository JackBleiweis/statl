// netlify/functions/submitScore.js
const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI; // Ensure you set this in Netlify environment variables
const client = new MongoClient(uri);

exports.handler = async (event) => {
    if (event.httpMethod === "POST") {
        const { name, score } = JSON.parse(event.body);

        try {
            await client.connect();
            const database = client.db("statl-leaderboard"); // Replace with your database name
            const profiles = database.collection("profiles"); // Collection where you want to save scores

            const newProfile = { name, score, date: new Date() };
            await profiles.insertOne(newProfile);

            return {
                statusCode: 200,
                body: JSON.stringify(newProfile),
            };
        } catch (error) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "Failed to submit score." }),
            };
        } finally {
            await client.close();
        }
    } else {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: "Method not allowed." }),
        };
    }
};
