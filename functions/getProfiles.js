// netlify/functions/getProfiles.js
const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI; // Use your MongoDB URI from the environment variables

exports.handler = async (event, context) => {
  const client = new MongoClient(uri);
  console.log("In get profiles, about to get from mongo");
  try {
    await client.connect();
    const database = client.db("statl-leaderboard"); // Replace with your actual database name
    const collection = database.collection("leaderboard");

    const profiles = await collection.find().toArray(); // Fetch all profiles
    console.log("Here we're trying to get the leaderboard");
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
