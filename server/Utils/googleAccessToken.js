const axios = require("axios");

const getGoogleAccessToken = async (authCode) => {
  try {
    const response = await axios.post("https://oauth2.googleapis.com/token", {
      code: authCode,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: "authorization_code",
    });

    return response.data; // Returns access_token and id_token
  } catch (error) {
    console.error("Error getting Google access token:", error.response.data);
    throw new Error("Failed to get access token from Google");
  }
};

module.exports = getGoogleAccessToken;