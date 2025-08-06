import jwt from "jsonwebtoken";
import axios from "axios";

export const getMeetingDetails = async (meetingId, apiKey, apiSecret) => {
    try {
        const token = jwt.sign(
            {
                iss: apiKey,
                exp: Math.floor(Date.now() / 1000) + 60 * 5,
            },
            apiSecret
        );

        const response = await axios.get(
            `https://api.zoom.us/v2/meetings/${meetingId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data;
    } catch (err) {
        console.error("Zoom API Error:", err?.response?.data || err.message);
        return null;
    }
};
