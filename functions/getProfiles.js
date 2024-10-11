// netlify/functions/getProfiles.js
const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI; // Use your MongoDB URI from the environment variables

exports.handler = async (event, context) => {
  console.log(uri);
  const client = new MongoClient(uri);
  console.log(client);
  console.log("In get profiles, about to get from mongo");
  try {
    console.log("Connecting");
    await client.connect();
    console.log("Before query");
    const database = client.db("statl-leaderboard"); // Replace with your actual database name
    console.log("Before collection");
    const collection = database.collection("leaderboard");

    console.log("getting profiles");
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
