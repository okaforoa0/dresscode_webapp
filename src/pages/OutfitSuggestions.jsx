import {useEffect, useState} from "react";

export default function OutfitSuggestions({ items }) {
    const [weather, setWeather] = useState(null);

    useEffect(() => {
        const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
        fetch(`http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=auto:ip`)
            .then(response => response.json())
            .then(data => setWeather(data))
            .catch(error => console.error("Error fetching weather data:", error));
    }, []);

    if (!weather) return <p>Loading weather...</p>;
    const temp = weather.main.temp;

    const suggestedItems = items.filter(item => {
        if (temp < 60) {
            return item.type === "jacket" || item.type === "sweater";
        } else if (temp >=60 && temp < 80) {
            return item.type === "long-sleeve shirt" || item.type === "jeans";
        } else {
            return item.type === "t-shirt" || item.type === "shorts";
        }
    });

    return (
        <div>
            <h2>Outfit Suggestions</h2>
            <p>Current temperature: {temp} °F</p>
            {suggestedItems.map(item => (
                <p key={item.id}>{item.item_name}</p>
            ))}
        </div>
    );
}