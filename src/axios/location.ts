import axios from "axios";

export default async function handler(req, res) {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude || latitude === "0" || longitude === "0") {
    return res.status(400).json({ error: "Invalid coordinates" });
  }

  try {
    const response = await axios.get(process.env.NEXT_PUBLIC_KOREA_API_URL, {
      params: {
        ServiceKey: process.env.NEXT_PUBLIC_KOREA_SERVICE_KEY,
        mapX: longitude,
        mapY: latitude,
        radius: 1000,
        MobileOS: "ETC",
        MobileApp: "AppTest",
        _type: "json",
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching data from API:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
}
