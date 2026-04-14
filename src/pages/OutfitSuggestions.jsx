import { useEffect, useState } from "react";

function normalizeType(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function categorizeItem(item) {
  const type = normalizeType(item.type);

  if (
    type.includes("jacket") ||
    type.includes("coat") ||
    type.includes("hoodie") ||
    type.includes("sweater") ||
    type.includes("cardigan") ||
    type.includes("blazer") ||
    type.includes("pullover")
  ) {
    return "outerwear";
  }

  if (
    type.includes("t-shirt") ||
    type.includes("t shirt") ||
    type.includes("tee") ||
    type.includes("shirt") ||
    type.includes("blouse") ||
    type.includes("top") ||
    type.includes("long sleeve") ||
    type.includes("long-sleeve") ||
    type.includes("tank") ||
    type.includes("cami") ||
    type.includes("polo")
  ) {
    return "tops";
  }

  if (
    type.includes("jeans") ||
    type.includes("pants") ||
    type.includes("shorts") ||
    type.includes("skirt") ||
    type.includes("leggings") ||
    type.includes("trousers") ||
    type.includes("jogger") ||
    type.includes("sweatpant")
  ) {
    return "bottoms";
  }

  if (
    type.includes("dress") ||
    type.includes("jumpsuit") ||
    type.includes("romper") ||
    type.includes("set")
  ) {
    return "onePiece";
  }

  if (
    type.includes("shoe") ||
    type.includes("sneaker") ||
    type.includes("boot") ||
    type.includes("heel") ||
    type.includes("loafer") ||
    type.includes("sandal") ||
    type.includes("flat")
  ) {
    return "shoes";
  }

  return "other";
}

function buildInventory(items) {
  return items.reduce(
    (acc, item) => {
      const bucket = categorizeItem(item);
      acc[bucket].push(item);
      return acc;
    },
    { tops: [], bottoms: [], outerwear: [], onePiece: [], shoes: [], other: [] }
  );
}

function pickFirstMatching(items, matcher) {
  return items.find((item) => matcher(normalizeType(item.type)));
}

function describeWeather(temp, conditionText) {
  const condition = String(conditionText || "").toLowerCase();

  if (condition.includes("rain") || condition.includes("drizzle")) {
    return "Wet weather today, so a protective layer makes sense.";
  }

  if (condition.includes("wind")) {
    return "It looks breezy, so an extra layer will help.";
  }

  if (temp < 55) {
    return "Cool temperatures call for warmer layers.";
  }

  if (temp < 72) {
    return "Mild weather is good for balanced layers.";
  }

  return "Warmer weather favors lighter, breathable pieces.";
}

function generateOutfits(inventory, temp, conditionText) {
  const condition = String(conditionText || "").toLowerCase();
  const isRainy = condition.includes("rain") || condition.includes("drizzle");
  const isWindy = condition.includes("wind");
  const isCold = temp < 55;
  const isMild = temp >= 55 && temp < 72;
  const isWarm = temp >= 72;

  const coldTop =
    pickFirstMatching(
      inventory.tops,
      (type) => type.includes("long sleeve") || type.includes("shirt")
    ) || inventory.tops[0];
  const warmTop =
    pickFirstMatching(
      inventory.tops,
      (type) => type.includes("t-shirt") || type.includes("tee") || type.includes("top")
    ) || inventory.tops[0];

  const jeansLike =
    pickFirstMatching(
      inventory.bottoms,
      (type) => type.includes("jeans") || type.includes("pants") || type.includes("trousers")
    ) || inventory.bottoms[0];
  const shortsLike =
    pickFirstMatching(
      inventory.bottoms,
      (type) => type.includes("shorts") || type.includes("skirt")
    ) || inventory.bottoms[0];

  const heavyLayer =
    pickFirstMatching(
      inventory.outerwear,
      (type) => type.includes("jacket") || type.includes("coat")
    ) || inventory.outerwear[0];
  const lightLayer =
    pickFirstMatching(
      inventory.outerwear,
      (type) => type.includes("hoodie") || type.includes("sweater") || type.includes("cardigan")
    ) || inventory.outerwear[0];

  const closedShoes =
    pickFirstMatching(
      inventory.shoes,
      (type) =>
        type.includes("boot") ||
        type.includes("shoe") ||
        type.includes("sneaker") ||
        type.includes("loafer")
    ) || inventory.shoes[0];
  const lightShoes =
    pickFirstMatching(
      inventory.shoes,
      (type) => type.includes("sandal") || type.includes("shoe") || type.includes("sneaker")
    ) || inventory.shoes[0];

  const onePiece = inventory.onePiece[0];
  const flexibleTop = coldTop || warmTop || inventory.other[0];
  const flexibleBottom = jeansLike || shortsLike || inventory.other[1] || inventory.other[0];

  const plans = [
    {
      title: onePiece
        ? isCold
          ? "Layered One-Piece Look"
          : "Easy One-Piece Look"
        : isCold
          ? "Warm Layered Outfit"
          : isMild
            ? "Balanced Everyday Outfit"
            : "Lightweight Warm-Weather Outfit",
      top: onePiece || (isWarm ? warmTop : coldTop || warmTop),
      bottom: onePiece ? null : isWarm ? shortsLike || jeansLike : jeansLike || shortsLike,
      outerwear: isCold ? heavyLayer || lightLayer : isMild || isWindy ? lightLayer : null,
      shoes: isRainy ? closedShoes : isWarm ? lightShoes || closedShoes : closedShoes || lightShoes,
      reason: describeWeather(temp, conditionText),
    },
    {
      title: isRainy ? "Rain-Ready Outfit" : onePiece ? "Alternate One-Piece Option" : "Alternate Outfit",
      top: onePiece || coldTop || warmTop,
      bottom: onePiece ? null : jeansLike || shortsLike,
      outerwear: isRainy ? heavyLayer || lightLayer : lightLayer,
      shoes: closedShoes,
      reason: isRainy
        ? "Rain in the forecast makes closed shoes and a layer the safer pick."
        : "A second option with slightly more structure for the day.",
    },
    {
      title: onePiece ? "Backup One-Piece Option" : "Easy Backup Option",
      top: onePiece || warmTop || coldTop,
      bottom: onePiece ? null : shortsLike || jeansLike,
      outerwear: isCold ? heavyLayer : null,
      shoes: lightShoes || closedShoes,
      reason: "Useful fallback built from what is already available in your closet.",
    },
    {
      title: "Closest Match From Your Closet",
      top: flexibleTop,
      bottom: flexibleBottom && flexibleBottom.id !== flexibleTop?.id ? flexibleBottom : null,
      outerwear: isCold || isWindy ? heavyLayer || lightLayer : null,
      shoes: closedShoes || lightShoes,
      reason: "Built from the pieces currently available, even if your closet categories are still limited.",
    },
  ];

  return plans
    .filter((plan) => plan.top && (plan.bottom || inventory.onePiece.includes(plan.top)))
    .map((plan) => ({
      ...plan,
      pieces: [plan.top, plan.bottom, plan.outerwear, plan.shoes].filter(Boolean),
    }))
    .filter(
      (plan, index, allPlans) =>
        allPlans.findIndex(
          (candidate) =>
            candidate.pieces.map((piece) => piece.id).join("-") ===
            plan.pieces.map((piece) => piece.id).join("-")
        ) === index
    )
    .slice(0, 3);
}

function SuggestionPiece({ label, item }) {
  return (
    <div className="min-h-[5.75rem] rounded-xl bg-earth-bg p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-earth-stone">
        {label}
      </p>
      <p className="mt-1 text-base font-medium text-earth-text">{item.item_name}</p>
      <p className="mt-1 text-sm text-earth-stone">
        {item.color || "-"}
        {item.type ? ` - ${item.type}` : ""}
      </p>
    </div>
  );
}

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

  const availableItems = items.filter((item) => !item.is_checked_out);
  const inventory = buildInventory(availableItems);
  const temp = weather?.current?.temp_f ?? 70;
  const conditionText = weather?.current?.condition?.text;
  const outfits = generateOutfits(inventory, temp, conditionText);
  const hasCoreItems =
    (inventory.tops.length > 0 && inventory.bottoms.length > 0) ||
    inventory.onePiece.length > 0 ||
    availableItems.length >= 2;

  function renderOutfitCard(outfit) {
    const isOnePieceLook = inventory.onePiece.some(
      (item) => String(item.id) === String(outfit.top?.id)
    );

    return (
      <div className="rounded-[1.5rem] border border-earth-sand/40 bg-earth-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-earth-moss">
          Suggested Look
        </p>
        <h3 className="mt-2 text-xl font-semibold text-earth-text">{outfit.title}</h3>
        <p className="mt-3 min-h-[4.5rem] text-sm leading-6 text-earth-stone">{outfit.reason}</p>

        <div className="mt-5 grid gap-3">
          <SuggestionPiece label={isOnePieceLook ? "Main Piece" : "Top"} item={outfit.top} />
          {outfit.bottom && <SuggestionPiece label="Bottom" item={outfit.bottom} />}
          {outfit.outerwear && <SuggestionPiece label="Layer" item={outfit.outerwear} />}
          {outfit.shoes && <SuggestionPiece label="Shoes" item={outfit.shoes} />}
        </div>
      </div>
    );
  }

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
        <div className="rounded-xl bg-earth-card p-6 text-sm text-earth-stone shadow-sm">
          Loading weather...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-xl bg-earth-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-earth-text">Outfit Suggestions</h2>
            <p className="mt-2 text-sm text-earth-stone">
              Current temperature: {Math.round(temp)} F
              {conditionText ? ` (${conditionText})` : ""}
            </p>
          </div>
          <p className="rounded-full bg-earth-bg px-3 py-1 text-xs font-semibold uppercase tracking-wide text-earth-moss">
            Based on available closet items
          </p>
        </div>

        {!hasCoreItems ? (
          <div className="mt-5 rounded-xl bg-earth-bg p-4 text-sm text-earth-stone">
            Add a couple more clothing items to start getting better outfit combinations. Right
            now, tops, bottoms, dresses, and shoes will help the suggestions feel smarter.
          </div>
        ) : outfits.length === 0 ? (
          <div className="mt-5 rounded-xl bg-earth-bg p-4 text-sm text-earth-stone">
            I found clothing in your closet, but not enough matching pieces to build a complete
            outfit for this weather yet. Try adding more tops, bottoms, dresses, or outerwear.
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between rounded-xl bg-earth-bg p-4 shadow-sm">
              <div>
                <h3 className="text-lg font-semibold text-earth-text">Outfit Cards</h3>
                <p className="text-sm text-earth-stone">
                  On mobile, scroll sideways through outfit ideas. On desktop, compare all looks at once.
                </p>
              </div>
              <p className="hidden rounded-full bg-earth-card px-3 py-1 text-xs font-semibold uppercase tracking-wide text-earth-moss sm:block">
                Card view
              </p>
            </div>

            <div className="sm:hidden">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-earth-bg to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-earth-bg to-transparent" />

                <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[6vw] pb-2 scrollbar-earth">
                  {outfits.map((outfit) => (
                    <div
                      key={outfit.title}
                      className="w-[88vw] max-w-sm flex-none snap-center"
                    >
                      {renderOutfitCard(outfit)}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-xl bg-earth-bg px-4 py-3 text-sm text-earth-stone shadow-sm">
                <p>Scroll to browse outfit ideas</p>
                <p className="font-semibold text-earth-moss">{outfits.length} looks</p>
              </div>
            </div>

            <div className="hidden gap-6 sm:grid lg:grid-cols-3">
              {outfits.map((outfit) => (
                <div key={outfit.title}>{renderOutfitCard(outfit)}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
