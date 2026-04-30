import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TbHanger } from "react-icons/tb";

const API_URL = process.env.REACT_APP_API_URL || "http://184.73.245.154:5000";

function resolveImageUrl(value) {
  if (!value) return "";
  if (/^https?:\/\//i.test(value) || value.startsWith("blob:") || value.startsWith("data:")) {
    return value;
  }
  return `${API_URL}${value.startsWith("/") ? value : `/${value}`}`;
}

function LoadingCard({ className = "" }) {
  return (
    <div className={`animate-pulse rounded-[1.5rem] border border-earth-sand/30 bg-earth-card/80 p-5 ${className}`}>
      <div className="h-3 w-24 rounded-full bg-earth-sand/50" />
      <div className="mt-4 h-8 w-3/4 rounded-full bg-earth-sand/40" />
      <div className="mt-4 space-y-3">
        <div className="h-20 rounded-2xl bg-earth-bg" />
        <div className="h-20 rounded-2xl bg-earth-bg" />
      </div>
    </div>
  );
}

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

function WrappedItemCard({ title, item, footer }) {
  const [hasImageError, setHasImageError] = useState(false);

  if (!item) {
    return (
      <div className="rounded-[1.75rem] border border-earth-sand/30 bg-earth-card/80 p-6 shadow-sm backdrop-blur-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-earth-moss">
          {title}
        </p>
        <p className="mt-4 text-sm text-earth-stone">Not enough wear data yet.</p>
      </div>
    );
  }

  const imageUrl = resolveImageUrl(item.image_url || item.Image_URL || "");

  return (
    <div className="rounded-[1.75rem] border border-earth-sand/30 bg-earth-card/85 p-6 shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-earth-moss">
        {title}
      </p>

      <div className="mt-5 overflow-hidden rounded-[1.25rem] bg-earth-bg">
        {imageUrl && !hasImageError ? (
          <img
            src={imageUrl}
            alt={item.item_name || title}
            className="h-48 w-full object-cover"
            onError={() => {
              setHasImageError(true);
            }}
          />
        ) : (
          <div className="flex h-48 flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_top,_rgba(154,170,138,0.18),_transparent_55%),linear-gradient(180deg,_rgba(243,239,232,0.95),_rgba(233,225,211,0.95))] px-6 text-center">
            <div className="rounded-full bg-earth-card/80 p-3 shadow-sm">
              <TbHanger className="text-3xl text-earth-moss" />
            </div>
            <div>
              <p className="text-sm font-semibold text-earth-text">No image available</p>
              <p className="mt-1 text-xs text-earth-stone">
                This stat card does not have an image yet.
              </p>
            </div>
          </div>
        )}
      </div>

      <h3 className="mt-5 text-2xl font-semibold tracking-tight text-earth-text">{item.item_name}</h3>
      <p className="mt-1 text-sm text-earth-stone">
        {[item.color, item.type].filter(Boolean).join(" - ")}
      </p>
      {footer && <p className="mt-4 text-sm font-medium text-earth-pine">{footer}</p>}
    </div>
  );
}

export default function OutfitSuggestions({ items }) {
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState("");
  const [wrappedStats, setWrappedStats] = useState(null);
  const [wrappedError, setWrappedError] = useState("");
  const [isWrappedLoading, setIsWrappedLoading] = useState(true);

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

  useEffect(() => {
    const authData = localStorage.getItem("dresscodeAuth");
    const token = authData ? JSON.parse(authData)?.token : "";

    if (!token) {
      setWrappedError("Sign in again to load your Closet Wrapped stats.");
      setIsWrappedLoading(false);
      return;
    }

    fetch(`${API_URL}/closet-wrapped`, {
      headers: {
        Authorization: token,
      },
    })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.setItem(
              "dresscodeAuthNotice",
              "Your session expired. Please sign in again to load Closet Wrapped."
            );
            localStorage.removeItem("dresscodeAuth");
            throw new Error("Session expired. Sign in again to continue.");
          }
          throw new Error(data?.error || "Unable to load Closet Wrapped.");
        }

        setWrappedStats(data);
        setWrappedError("");
      })
      .catch((error) => {
        console.error("Error fetching closet wrapped:", error);
        setWrappedError(error.message || "Unable to load Closet Wrapped.");
      })
      .finally(() => {
        setIsWrappedLoading(false);
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
        <div className="rounded-xl bg-earth-card p-6 shadow-sm">
          <div className="animate-pulse">
            <div className="h-4 w-40 rounded-full bg-earth-sand/40" />
            <div className="mt-4 grid gap-6 lg:grid-cols-3">
              <LoadingCard />
              <LoadingCard />
              <LoadingCard />
            </div>
          </div>
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
          <div className="mt-5 rounded-xl bg-earth-bg p-5 text-sm text-earth-stone">
            <p>
              Add a couple more clothing items to start getting better outfit combinations. Right
              now, tops, bottoms, dresses, and shoes will help the suggestions feel smarter.
            </p>
            <div className="mt-4">
              <Link
                to="/closet"
                className="inline-flex rounded-lg bg-earth-moss px-4 py-2 text-sm font-semibold text-earth-card transition-all duration-200 hover:-translate-y-1 hover:bg-earth-sage hover:shadow-md"
              >
                Add More Items
              </Link>
            </div>
          </div>
        ) : outfits.length === 0 ? (
          <div className="mt-5 rounded-xl bg-earth-bg p-5 text-sm text-earth-stone">
            <p>
              I found clothing in your closet, but not enough matching pieces to build a complete
              outfit for this weather yet. Try adding more tops, bottoms, dresses, or outerwear.
            </p>
            <div className="mt-4">
              <Link
                to="/closet"
                className="inline-flex rounded-lg bg-earth-moss px-4 py-2 text-sm font-semibold text-earth-card transition-all duration-200 hover:-translate-y-1 hover:bg-earth-sage hover:shadow-md"
              >
                Go to Closet
              </Link>
            </div>
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

      <div className="relative mt-6 overflow-hidden rounded-[2rem] border border-earth-sand/30 bg-[radial-gradient(circle_at_top_left,_rgba(203,187,165,0.35),_transparent_30%),linear-gradient(135deg,_rgba(111,127,104,0.95),_rgba(63,58,52,0.98))] p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md sm:p-8">
        <div className="pointer-events-none absolute -right-10 top-8 h-40 w-40 rounded-full bg-earth-sand/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-48 w-48 rounded-full bg-earth-card/10 blur-3xl" />

        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-earth-card/70">
              Closet Wrapped
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-earth-card sm:text-4xl">
              Your Wardrobe Status
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-earth-card/75">
              A quick snapshot of what you wear the most, what deserves more love, and your current favorites.
            </p>
          </div>
          <p className="rounded-full border border-earth-card/15 bg-earth-card/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-earth-card/80 backdrop-blur-sm">
            Based on scan history
          </p>
        </div>

        {isWrappedLoading ? (
          <div className="relative mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr]">
            <LoadingCard className="border-earth-card/15 bg-earth-card/10" />
            <LoadingCard className="border-earth-card/15 bg-earth-card/10" />
            <LoadingCard className="border-earth-card/15 bg-earth-card/10" />
          </div>
        ) : wrappedError ? (
          <div className="relative mt-6 rounded-[1.5rem] border border-earth-card/10 bg-earth-card/10 p-5 backdrop-blur-sm">
            <p className="text-sm text-earth-card/80">{wrappedError}</p>
            {wrappedError.toLowerCase().includes("sign in") && (
              <div className="mt-4">
                <Link
                  to="/auth"
                  className="inline-flex rounded-lg bg-earth-card px-4 py-2 text-sm font-semibold text-earth-text transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                >
                  Sign In Again
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="relative mt-8 space-y-6">
            <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr]">
              <div className="rounded-[1.75rem] border border-earth-card/15 bg-earth-card/12 p-6 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-earth-card/65">
                  Total Wears
                </p>
                <p className="mt-3 text-5xl font-semibold tracking-tight text-earth-card sm:text-6xl">
                  {wrappedStats?.total_wears ?? 0}
                </p>
                <p className="mt-3 text-sm text-earth-card/70">
                  Total times your items were checked out from the closet.
                </p>
              </div>

              <div className="rounded-[1.75rem] border border-earth-card/15 bg-earth-card/10 p-6 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-earth-card/65">
                  Top Type
                </p>
                <p className="mt-4 text-2xl font-semibold tracking-tight text-earth-card">
                  {wrappedStats?.most_worn_type?.type || "No data yet"}
                </p>
                {wrappedStats?.most_worn_type?.wear_count != null && (
                  <p className="mt-2 text-sm text-earth-card/75">
                    {wrappedStats.most_worn_type.wear_count} wears
                  </p>
                )}
              </div>

              <div className="rounded-[1.75rem] border border-earth-card/15 bg-earth-card/10 p-6 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-earth-card/65">
                  Top Color
                </p>
                <p className="mt-4 text-2xl font-semibold tracking-tight text-earth-card">
                  {wrappedStats?.most_worn_color?.color || "No data yet"}
                </p>
                {wrappedStats?.most_worn_color?.wear_count != null && (
                  <p className="mt-2 text-sm text-earth-card/75">
                    {wrappedStats.most_worn_color.wear_count} wears
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <WrappedItemCard
                title="Most Worn"
                item={wrappedStats?.most_worn_item}
                footer={
                  wrappedStats?.most_worn_item?.wear_count != null
                    ? `${wrappedStats.most_worn_item.wear_count} wears`
                    : ""
                }
              />

              <WrappedItemCard
                title="Least Worn"
                item={wrappedStats?.least_worn_item}
                footer={
                  wrappedStats?.least_worn_item?.wear_count != null
                    ? `${wrappedStats.least_worn_item.wear_count} wears`
                    : ""
                }
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-[1.75rem] border border-earth-card/15 bg-earth-card/10 p-6 backdrop-blur-sm shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-earth-card/70">
                  Current Favorites
                </p>
                <div className="mt-4 space-y-3">
                  {wrappedStats?.current_favorites?.length ? (
                    wrappedStats.current_favorites.map((item) => (
                      <div key={item.id} className="rounded-[1.25rem] bg-earth-card/80 p-4">
                        <p className="font-medium text-earth-text">{item.item_name}</p>
                        <p className="mt-1 text-sm text-earth-stone">
                          {[item.color, item.type].filter(Boolean).join(" - ")}
                        </p>
                        <p className="mt-2 text-sm font-medium text-earth-pine">
                          {item.recent_wear_count} recent wears
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-earth-card/75">No recent favorites yet.</p>
                  )}
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-earth-card/15 bg-earth-card/10 p-6 backdrop-blur-sm shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-earth-card/70">
                  Revisit These
                </p>
                <div className="mt-4 space-y-3">
                  {wrappedStats?.look_again_items?.length ? (
                    wrappedStats.look_again_items.map((item) => (
                      <div key={item.id} className="rounded-[1.25rem] bg-earth-card/80 p-4">
                        <p className="font-medium text-earth-text">{item.item_name}</p>
                        <p className="mt-1 text-sm text-earth-stone">
                          {[item.color, item.type].filter(Boolean).join(" - ")}
                        </p>
                        <p className="mt-2 text-sm font-medium text-earth-pine">
                          {item.wear_count === 0
                            ? "Never worn yet"
                            : `Worn ${item.wear_count} time${item.wear_count === 1 ? "" : "s"}`}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-earth-card/75">Nothing to revisit right now.</p>
                  )}
                </div>
              </div>
            </div>

            {!wrappedStats?.total_wears && !wrappedStats?.current_favorites?.length && !wrappedStats?.look_again_items?.length && (
              <div className="rounded-[1.5rem] border border-earth-card/15 bg-earth-card/10 p-5 text-earth-card/80 backdrop-blur-sm">
                <p className="text-sm">
                  Start wearing and scanning items to build your Closet Wrapped story.
                </p>
                <div className="mt-4">
                  <Link
                    to="/closet"
                    className="inline-flex rounded-lg bg-earth-card px-4 py-2 text-sm font-semibold text-earth-text transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                  >
                    Go to Closet
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
