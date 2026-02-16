import { useEffect, useState } from "react";

export default function OutfitSuggestions({ items }) {
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState("");

  useEffect(() => {
    const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

    if (!API_KEY) {
      setWeatherError("Missing weather API key. Set REACT_APP_WEATHER_API_KEY in .env.");
      return;
    }

    fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=auto:ip`)
      .then((response) => response.json())
      .then((data) => {
        if (data?.error) {
          setWeatherError(data.error.message || "Unable to fetch weather data.");
          return;
        }
        setWeather(data);
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
        setWeatherError("Unable to fetch weather data right now.");
      });
  }, []);

  if (weatherError) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-xl bg-earth-card p-6 text-sm text-earth-stone shadow-sm">
          {weatherError}
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-xl bg-earth-card p-6 text-sm text-earth-stone shadow-sm">Loading weather...</div>
      </div>
    );
  }

  const temp = weather?.current?.temp_f;
  const conditionText = weather?.current?.condition?.text;

  const suggestedItems = items.filter((item) => {
    const type = String(item.type || "").trim().toLowerCase();

    if (temp < 60) {
      return (
        type.includes("jacket") ||
        type.includes("coat") ||
        type.includes("hoodie") ||
        type.includes("sweater")
      );
    } else if (temp >= 60 && temp < 80) {
      return (
        type.includes("long-sleeve") ||
        type.includes("long sleeve") ||
        type.includes("jeans") ||
        type.includes("pants")
      );
    }
    return (
      type.includes("t-shirt") ||
      type.includes("t shirt") ||
      type.includes("tee") ||
      type.includes("shorts")
    );
  });

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-xl bg-earth-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
        <h2 className="text-2xl font-semibold text-earth-text">Outfit Suggestions</h2>
        <p className="mt-2 text-sm text-earth-stone">
          Current temperature: {Math.round(temp)} F
          {conditionText ? ` (${conditionText})` : ""}
        </p>

        {suggestedItems.length === 0 ? (
          <p className="mt-4 rounded-lg bg-earth-bg px-3 py-2 text-sm text-earth-stone">
            No matching items found for this weather. Try adding type labels like
            jacket, hoodie, jeans, t-shirt, or shorts.
          </p>
        ) : (
          <div className="mt-4 space-y-2">
            {suggestedItems.map((item) => (
              <p key={item.id} className="rounded-lg bg-earth-bg px-3 py-2 text-sm text-earth-text">
                {item.item_name}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
