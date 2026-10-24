'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default Leaflet marker icon issue in Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function MapBounds({ courierPos, destinationPos }) {
  const map = useMap();
  useEffect(() => {
    if (courierPos && destinationPos) {
      const bounds = L.latLngBounds([courierPos, destinationPos]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [courierPos, destinationPos, map]);
  return null;
}

export default function DeliveryMap({ courierPos, destinationPos }) {
  const defaultCenter = courierPos || [8.9806, 38.7578]; // Default to Addis Ababa center if needed

  return (
    <div className="w-full h-96 rounded-xl overflow-hidden border border-stone-800 shadow-xl relative z-10">
      <MapContainer center={defaultCenter} zoom={13} scrollWheelZoom={false} className="w-full h-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {courierPos && (
          <Marker position={courierPos}>
            <Popup>Courier is on the way!</Popup>
          </Marker>
        )}
        {destinationPos && (
          <Marker position={destinationPos}>
            <Popup>Delivery Destination</Popup>
          </Marker>
        )}
        <MapBounds courierPos={courierPos} destinationPos={destinationPos} />
      </MapContainer>
    </div>
  );
}