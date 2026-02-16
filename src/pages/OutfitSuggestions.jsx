import { useEffect, useState } from "react";

export default function OutfitSuggestions({ items }) {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
    fetch(`http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=auto:ip`)
      .then((response) => response.json())
      .then((data) => setWeather(data))
      .catch((error) => console.error("Error fetching weather data:", error));
  }, []);

  if (!weather) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-xl bg-white p-6 text-sm text-gray-500 shadow-sm">Loading weather...</div>
      </div>
    );
  }

  const temp = weather.main.temp;

  const suggestedItems = items.filter((item) => {
    if (temp < 60) {
      return item.type === "jacket" || item.type === "sweater";
    } else if (temp >= 60 && temp < 80) {
      return item.type === "long-sleeve shirt" || item.type === "jeans";
    }
    return item.type === "t-shirt" || item.type === "shorts";
  });

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-xl bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
        <h2 className="text-2xl font-semibold text-gray-900">Outfit Suggestions</h2>
        <p className="mt-2 text-sm text-gray-600">Current temperature: {temp} F</p>

        <div className="mt-4 space-y-2">
          {suggestedItems.map((item) => (
            <p key={item.id} className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700">
              {item.item_name}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}