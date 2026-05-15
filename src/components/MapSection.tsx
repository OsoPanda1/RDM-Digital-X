import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useApi } from "@/hooks/useApi";

interface TwinNode {
  id: string;
  modelType: string;
  sourceId: string;
  name: string;
  lat: number;
  lng: number;
  tags: string[];
  immersionLevel: number;
  popularityScore: number;
  telemetry: {
    crowdLevel?: number;
    weather?: string;
    openStatus?: boolean;
    flowIndex?: number;
    avgStayMinutes?: number;
    queueMinutes?: number;
  };
  properties: {
    type?: string;
    immersion?: string;
    narrative?: string;
  };
}

interface TwinsResponse {
  count: number;
  twins: TwinNode[];
}

const typeColors: Record<string, string> = {
  HISTORIC: "#71d9ff",
  MUSEUM: "#f7c873",
  MINE: "#f7c873",
  RELIGIOUS: "#b79aff",
  VIEWPOINT: "#74e3c7",
  NATURE: "#66d4b2",
  FOOD: "#f8a16f",
  LODGING: "#e39cca",
  HANDCRAFTS: "#c5a3ff",
  ACTIVITY: "#6cc8f8",
  BAR: "#f6a47c",
  CULTURE: "#9eb3ff",
};

const typeLabels: Record<string, string> = {
  HISTORIC: "Histórico",
  MUSEUM: "Museo",
  MINE: "Mina",
  RELIGIOUS: "Religioso",
  VIEWPOINT: "Mirador",
  NATURE: "Naturaleza",
  FOOD: "Gastronomía",
  LODGING: "Hospedaje",
  HANDCRAFTS: "Artesanías",
  ACTIVITY: "Actividad",
  BAR: "Bar",
  CULTURE: "Cultura",
};

function crowdBadge(level: number): string {
  if (level > 0.7) return '<span style="color:#f58ca6;font-size:10px;">● Alta ocupación</span>';
  if (level > 0.4) return '<span style="color:#f2c27d;font-size:10px;">● Moderado</span>';
  return '<span style="color:#7ad6b8;font-size:10px;">● Tranquilo</span>';
}

function immersionBadge(level: string): string {
  const colors: Record<string, string> = { L1: "#9ca3af", L2: "#7cccf3", L3: "#f2c27d" };
  return `<span style="color:${colors[level] ?? "#9ca3af"};font-size:10px;font-family:'IBM Plex Mono',monospace;">Inmersión ${level}</span>`;
}

// Fallback twins when API is unavailable
const fallbackTwins: TwinNode[] = [
  { id: "twin-centro", modelType: "PLACE_TWIN", sourceId: "centro-historico", name: "Centro Histórico", lat: 20.1407, lng: -98.6725, tags: ["HISTORIA"], immersionLevel: 0.7, popularityScore: 0.9, telemetry: { crowdLevel: 0.45, openStatus: true }, properties: { type: "HISTORIC", immersion: "L2" } },
  { id: "twin-mina", modelType: "PLACE_TWIN", sourceId: "mina-acosta", name: "Mina de Acosta", lat: 20.1448, lng: -98.6653, tags: ["MUSEO"], immersionLevel: 0.9, popularityScore: 0.95, telemetry: { crowdLevel: 0.3, openStatus: true }, properties: { type: "MUSEUM", immersion: "L3" } },
  { id: "twin-panteon", modelType: "PLACE_TWIN", sourceId: "panteon-ingles", name: "Panteón Inglés", lat: 20.1397, lng: -98.6769, tags: ["HISTORIA"], immersionLevel: 0.8, popularityScore: 0.85, telemetry: { crowdLevel: 0.15, openStatus: true }, properties: { type: "HISTORIC", immersion: "L2" } },
  { id: "twin-cristo", modelType: "PLACE_TWIN", sourceId: "cristo-rey", name: "Cristo Rey", lat: 20.1460, lng: -98.6690, tags: ["MIRADOR"], immersionLevel: 0.7, popularityScore: 0.8, telemetry: { crowdLevel: 0.25, openStatus: true }, properties: { type: "VIEWPOINT", immersion: "L2" } },
  { id: "twin-bosque", modelType: "PLACE_TWIN", sourceId: "bosque-pinos", name: "Bosque de Pinos", lat: 20.1556, lng: -98.6856, tags: ["NATURALEZA"], immersionLevel: 0.6, popularityScore: 0.65, telemetry: { crowdLevel: 0.08, openStatus: true }, properties: { type: "NATURE", immersion: "L1" } },
  { id: "twin-paste", modelType: "MERCHANT_TWIN", sourceId: "pasteria-portal", name: "Pastería El Portal", lat: 20.1409, lng: -98.6723, tags: ["GASTRONOMIA"], immersionLevel: 0.7, popularityScore: 0.9, telemetry: { crowdLevel: 0.6, openStatus: true }, properties: { type: "FOOD", immersion: "L2" } },
  { id: "twin-coffee", modelType: "MERCHANT_TWIN", sourceId: "mina-coffee", name: "Mina Coffee House", lat: 20.1391, lng: -98.6752, tags: ["CAFE"], immersionLevel: 0.6, popularityScore: 0.7, telemetry: { crowdLevel: 0.4, openStatus: true }, properties: { type: "FOOD", immersion: "L2" } },
  { id: "twin-hotel", modelType: "MERCHANT_TWIN", sourceId: "hotel-real", name: "Hotel Real del Monte", lat: 20.1456, lng: -98.6800, tags: ["HOSPEDAJE"], immersionLevel: 0.8, popularityScore: 0.75, telemetry: { crowdLevel: 0.3, openStatus: true }, properties: { type: "LODGING", immersion: "L3" } },
  { id: "twin-eco", modelType: "MERCHANT_TWIN", sourceId: "eco-aventuras", name: "Eco Aventuras RDM", lat: 20.1500, lng: -98.6820, tags: ["AVENTURA"], immersionLevel: 0.9, popularityScore: 0.7, telemetry: { crowdLevel: 0.15, openStatus: true }, properties: { type: "ACTIVITY", immersion: "L3" } },
];

type GeoStatus = "idle" | "requesting" | "granted" | "denied" | "unsupported" | "error";

const MapSection = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; accuracy?: number } | null>(null);
  const [geoStatus, setGeoStatus] = useState<GeoStatus>("idle");

  const { data: twinsResponse } = useApi<TwinsResponse>("/api/experience/twins");
  const twins = twinsResponse?.twins ?? fallbackTwins;

  const requestLocation = () => {
    if (!("geolocation" in navigator)) {
      setGeoStatus("unsupported");
      return;
    }
    setGeoStatus("requesting");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setGeoStatus("granted");
      },
      (err) => {
        setGeoStatus(err.code === err.PERMISSION_DENIED ? "denied" : "error");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  };

  useEffect(() => {
    requestLocation();
  }, []);

  const centerOnUser = () => {
    if (userLocation && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([userLocation.lat, userLocation.lng], 16, { duration: 1.2 });
    } else {
      requestLocation();
    }
  };


  // Stats from telemetry
  const avgCrowd = twins.length > 0
    ? Math.round((twins.reduce((a, t) => a + (t.telemetry.crowdLevel ?? 0), 0) / twins.length) * 100)
    : 0;
  const placesCount = twins.filter((t) => t.modelType === "PLACE_TWIN").length;
  const merchantsCount = twins.filter((t) => t.modelType === "MERCHANT_TWIN").length;

  useEffect(() => {
    if (!mapRef.current) return;

    // Cleanup previous map
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapRef.current, {
      center: [20.1410, -98.6735],
      zoom: 15,
      zoomControl: false,
      attributionControl: false,
    });

    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    if (userLocation) {
      L.circleMarker([userLocation.lat, userLocation.lng], {
        radius: 9,
        color: "#ffffff",
        weight: 2,
        fillColor: "#3b82f6",
        fillOpacity: 0.95,
      })
        .addTo(map)
        .bindPopup(
          `<div style="font-family:Inter,sans-serif;padding:6px 10px;font-size:12px;color:#0f172a;">
            <strong>Tu ubicación</strong>${userLocation.accuracy ? `<br/><span style='font-size:10px;color:#64748b;'>±${Math.round(userLocation.accuracy)} m</span>` : ""}
          </div>`,
          { className: "rdm-popup", closeButton: false },
        );
      if (userLocation.accuracy && userLocation.accuracy < 500) {
        L.circle([userLocation.lat, userLocation.lng], {
          radius: userLocation.accuracy,
          color: "#3b82f6",
          weight: 1,
          fillColor: "#3b82f6",
          fillOpacity: 0.08,
        }).addTo(map);
      }
    }

    // Render twins as markers with telemetry data
    twins.forEach((twin) => {
      const type = (twin.properties.type ?? "").toUpperCase();
      if (activeFilter && type !== activeFilter) return;

      const color = typeColors[type] ?? "#00f3ff";
      const label = typeLabels[type] ?? type;
      const crowd = twin.telemetry.crowdLevel ?? 0;
      const immersion = twin.properties.immersion ?? "L1";
      const isPlace = twin.modelType === "PLACE_TWIN";
      const size = twin.popularityScore > 0.7 ? 16 : isPlace ? 13 : 10;

      // Crowd-aware opacity
      const opacity = crowd > 0.7 ? 0.5 : 1;

      const icon = L.divIcon({
        className: "custom-marker",
        html: `<div style="
          width: ${size}px; height: ${size}px; border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #ffffff 0%, ${color} 35%, ${color} 100%); border: 2px solid rgba(255,255,255,0.75);
          box-shadow: 0 0 0 2px rgba(17,24,39,0.25), 0 0 18px ${color}90;
          opacity: ${opacity};
          animation: nodePulse 3s ease-in-out infinite;
        "></div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });

      const popupContent = `
        <div style="
          background: linear-gradient(145deg, #f9fafc, #eef3fb); color: #0f172a; padding: 16px 20px;
          border-radius: 14px; border: 1px solid rgba(148,163,184,0.35); box-shadow: 0 8px 30px rgba(15,23,42,0.12);
          font-family: 'Inter', sans-serif; min-width: 200px; max-width: 260px;
        ">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
            <span style="font-size:9px; text-transform:uppercase; letter-spacing:0.15em; color:${color}; font-family:'IBM Plex Mono',monospace;">
              ${isPlace ? label : `Comercio · ${label}`}
            </span>
            ${immersionBadge(immersion)}
          </div>
          <div style="font-size:15px; font-weight:600; margin-bottom:8px;">${twin.name}</div>
          ${twin.properties.narrative ? `<div style="font-size:12px; color:#475569; line-height:1.4; margin-bottom:8px;">${(twin.properties.narrative as string).substring(0, 140)}…</div>` : ""}
          <div style="display:flex;justify-content:space-between;align-items:center;">
            ${crowdBadge(crowd)}
            ${twin.telemetry.avgStayMinutes ? `<span style="font-size:10px;color:#64748b;font-family:'IBM Plex Mono',monospace;">~${twin.telemetry.avgStayMinutes} min</span>` : ""}
          </div>
          ${twin.telemetry.queueMinutes ? `<div style="font-size:10px;color:#64748b;margin-top:4px;">Espera: ~${twin.telemetry.queueMinutes} min</div>` : ""}
          <div style="display:flex;gap:6px;margin-top:10px;">
            <a href="https://www.google.com/maps/dir/?api=1&destination=${twin.lat},${twin.lng}" target="_blank" rel="noopener" style="flex:1;text-align:center;padding:6px 10px;border-radius:8px;background:#0f172a;color:#fff;font-size:11px;text-decoration:none;font-family:'IBM Plex Mono',monospace;letter-spacing:0.08em;text-transform:uppercase;">Cómo llegar</a>
            <a href="https://www.google.com/maps/search/?api=1&query=${twin.lat},${twin.lng}" target="_blank" rel="noopener" style="padding:6px 10px;border-radius:8px;background:#e2e8f0;color:#0f172a;font-size:11px;text-decoration:none;font-family:'IBM Plex Mono',monospace;letter-spacing:0.08em;text-transform:uppercase;">Ver</a>
          </div>
        </div>`;

      L.marker([twin.lat, twin.lng], { icon })
        .addTo(map)
        .bindPopup(popupContent, { className: "rdm-popup", closeButton: false });
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [twins, activeFilter, userLocation]);

  const filterOptions = [
    { key: null, label: "Todos" },
    { key: "HISTORIC", label: "Histórico" },
    { key: "MUSEUM", label: "Museos" },
    { key: "VIEWPOINT", label: "Miradores" },
    { key: "NATURE", label: "Naturaleza" },
    { key: "FOOD", label: "Gastronomía" },
    { key: "LODGING", label: "Hospedaje" },
    { key: "ACTIVITY", label: "Actividades" },
  ];

  return (
    <section className="relative py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <span className="font-mono text-xs uppercase tracking-widest text-primary mb-3 block">
            Gemelo Digital Territorial · Telemetría Viva
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase">
            Mapa <span className="text-gradient-cyan">en Tiempo Real</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-lg">
            Cada nodo representa un punto activo del gemelo digital con telemetría de aforo,
            nivel de inmersión y estado operativo. Los nodos más brillantes tienen menor saturación.
          </p>
        </motion.div>

        {/* Filter bar */}
        <div className="flex flex-wrap gap-2 mb-6 font-mono text-[10px] uppercase tracking-widest">
          {filterOptions.map((opt) => (
            <button
              key={opt.key ?? "all"}
              onClick={() => setActiveFilter(opt.key)}
              className={`px-3 py-1.5 rounded-lg transition-all border border-border ${
                activeFilter === opt.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-card/40 text-muted-foreground hover:text-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
          <button
            onClick={centerOnUser}
            data-testid="geo-center-btn"
            data-geo-status={geoStatus}
            className="ml-auto px-3 py-1.5 rounded-lg border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 transition-all"
          >
            {geoStatus === "requesting" ? "Localizando…" : userLocation ? "📍 Centrar en mí" : "📍 Activar ubicación"}
          </button>
        </div>

        {(geoStatus === "denied" || geoStatus === "error" || geoStatus === "unsupported") && (
          <div data-testid="geo-banner" data-geo-status={geoStatus} className="mb-4 rounded-lg border border-amber-300/30 bg-amber-300/5 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-amber-200">
            {geoStatus === "denied" && "Permiso de ubicación denegado. Habilítalo en tu navegador para personalizar tu experiencia."}
            {geoStatus === "error" && "No se pudo obtener tu ubicación. Revisa tu conexión o GPS."}
            {geoStatus === "unsupported" && "Tu navegador no soporta geolocalización."}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-surface overflow-hidden glow-cyan ring-1 ring-primary/30"
        >
          <div ref={mapRef} className="w-full h-[500px] md:h-[600px]" />
        </motion.div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-6 font-mono text-xs uppercase tracking-widest">
          {[
            { label: "Museos/Minas", color: "bg-secondary" },
            { label: "Histórico", color: "bg-primary" },
            { label: "Miradores", colorHex: "#74e3c7" },
            { label: "Gastronomía", colorHex: "#f8a16f" },
            { label: "Hospedaje", colorHex: "#e39cca" },
            { label: "Comercios", colorHex: "#c5a3ff" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div
                className={`w-2.5 h-2.5 rounded-full ${item.color ?? ""}`}
                style={item.colorHex ? { backgroundColor: item.colorHex } : {}}
              />
              <span className="text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Live telemetry stats */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 flex flex-wrap gap-8 font-mono text-xs uppercase tracking-widest text-muted-foreground"
        >
          <span>
            Nodos Activos:{" "}
            <span className="text-primary">{twins.length}</span>
          </span>
          <span>
            Lugares: <span className="text-foreground">{placesCount}</span>
          </span>
          <span>
            Comercios: <span className="text-secondary">{merchantsCount}</span>
          </span>
          <span>
            Ocupación Promedio: <span className={avgCrowd > 50 ? "text-secondary" : "text-primary"}>{avgCrowd}%</span>
          </span>
          <span>
            Altitud: <span className="text-foreground">2,700m</span>
          </span>
          <span>
            Ubicación: <span className="text-foreground">{userLocation ? "activa" : "no disponible"}</span>
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default MapSection;
