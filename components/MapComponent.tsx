"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const cafes = [
  { name: "Café Aroma", lat: 4.3379, lng: -74.3635, desc: "Excelente ambiente y postres caseros." },
  { name: "Tierra Tostada", lat: 4.3395, lng: -74.3612, desc: "Café orgánico con vista a la montaña." },
  { name: "La Esquina del Café", lat: 4.3368, lng: -74.3648, desc: "Perfecto para leer y relajarse." },
];

export default function MapComponent() {
  return (
    <MapContainer
      center={[4.3379, -74.3635]}
      zoom={14}
      style={{ width: "100%", height: "500px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {cafes.map((cafe, i) => (
        <Marker key={i} position={[cafe.lat, cafe.lng]} icon={icon}>
          <Popup>
            <strong>{cafe.name}</strong>
            <br />
            {cafe.desc}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
