import * as React from "react";
import "leaflet/dist/leaflet.css";
import { Crosshair, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type LeafletModule = typeof import("leaflet");
type LeafletMap = import("leaflet").Map;
type LeafletMarker = import("leaflet").Marker;

type DemoPlace = {
  name: string;
  category: string;
  price: string;
  coords: [number, number];
};

// Demonstrative data only. Real places in Belem-PA used as illustrative
// examples; prices are samples and are not live offers.
const DEMO_PLACES: DemoPlace[] = [
  { name: "Ver-o-Peso", category: "Feira", price: "R$ 12,90", coords: [-1.452, -48.5044] },
  {
    name: "Mercado de São Brás",
    category: "Mercado",
    price: "R$ 24,50",
    coords: [-1.4505, -48.4717],
  },
  { name: "Feira da Pedreira", category: "Feira", price: "R$ 8,00", coords: [-1.4147, -48.475] },
  { name: "São José Liberto", category: "Loja", price: "R$ 45,00", coords: [-1.46, -48.504] },
  { name: "Mercado do Guamá", category: "Mercado", price: "R$ 15,90", coords: [-1.475, -48.458] },
  { name: "Ver-o-Rio", category: "Feira", price: "R$ 10,00", coords: [-1.442, -48.501] },
];

const BELEM_CENTER: [number, number] = [-1.4558, -48.4902];

export function MarketplaceMap({ className }: { className?: string }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const leafletRef = React.useRef<LeafletModule | null>(null);
  const mapRef = React.useRef<LeafletMap | null>(null);
  const userMarkerRef = React.useRef<LeafletMarker | null>(null);
  const [status, setStatus] = React.useState<string | null>(null);
  const [locating, setLocating] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;

    void (async () => {
      const L = await import("leaflet");
      if (cancelled || !containerRef.current) return;

      leafletRef.current = L;

      const map = L.map(containerRef.current, {
        center: BELEM_CENTER,
        zoom: 13,
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: true,
      });
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      const winePin = L.divIcon({
        className: "marketplace-map__pin",
        html: "",
        iconSize: [26, 34],
        iconAnchor: [13, 34],
        popupAnchor: [0, -30],
      });

      for (const place of DEMO_PLACES) {
        L.marker(place.coords, { icon: winePin, title: place.name })
          .addTo(map)
          .bindPopup(
            `<div class="marketplace-map__popup"><span class="marketplace-map__popup-name">${place.name}</span><span class="marketplace-map__popup-category">${place.category}</span><span class="marketplace-map__popup-price">${place.price}</span></div>`,
          );
      }
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      userMarkerRef.current = null;
    };
  }, []);

  const handleLocate = React.useCallback(() => {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      setStatus("Localização não está disponível neste dispositivo.");
      return;
    }

    setLocating(true);
    setStatus("Obtendo sua localização...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocating(false);
        const { latitude, longitude } = position.coords;
        const L = leafletRef.current;
        const map = mapRef.current;
        if (L && map) {
          userMarkerRef.current?.remove();
          const userIcon = L.divIcon({
            className: "marketplace-map__user-pin",
            html: "",
            iconSize: [18, 18],
            iconAnchor: [9, 9],
          });
          userMarkerRef.current = L.marker([latitude, longitude], {
            icon: userIcon,
            title: "Sua localização",
          }).addTo(map);
          map.setView([latitude, longitude], 15);
        }
        setStatus("Localização obtida.");
      },
      (error) => {
        setLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setStatus("Permissão de localização negada.");
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setStatus("Sua localização não pôde ser determinada.");
        } else {
          setStatus("Não foi possível obter sua localização.");
        }
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 },
    );
  }, []);

  return (
    <div
      className={cn(
        "relative isolate h-full min-h-[300px] overflow-hidden rounded-[20px]",
        className,
      )}
    >
      <div
        ref={containerRef}
        className="marketplace-map h-full w-full"
        aria-label="Mapa de locais próximos"
      />

      <span className="pointer-events-none absolute bottom-3 left-3 z-[1000] rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-[#8a6f6f] shadow-sm">
        Dados de exemplo
      </span>

      <button
        type="button"
        onClick={handleLocate}
        aria-label="Usar minha localização"
        title="Usar minha localização"
        className="absolute right-3 bottom-3 z-[1000] inline-flex size-10 items-center justify-center rounded-full border border-border bg-white text-primary shadow-[0_3px_12px_rgba(0,0,0,0.12)] transition hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {locating ? (
          <Loader2 className="size-5 animate-spin" aria-hidden="true" />
        ) : (
          <Crosshair className="size-5" aria-hidden="true" />
        )}
      </button>

      <p role="status" aria-live="polite" className="sr-only">
        {status ?? ""}
      </p>
    </div>
  );
}
