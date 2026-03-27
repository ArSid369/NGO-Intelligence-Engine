import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Need, Volunteer } from '../../server/models/types.js';

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapProps {
  need: Need | null;
  volunteers: Volunteer[];
  assignedVolunteerId?: number;
}

export default function Map({ need, volunteers, assignedVolunteerId }: MapProps) {
  const center: [number, number] = need?.lat && need?.lng ? [need.lat, need.lng] : [40.7128, -74.0060];

  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden border border-gray-200 shadow-sm relative z-0">
      <MapContainer center={center} zoom={12} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {need?.lat && need?.lng && (
          <Marker position={[need.lat, need.lng]} icon={redIcon}>
            <Popup>
              <strong>Crisis Location</strong><br/>
              {need.location}<br/>
              Type: {need.need_type}<br/>
              Urgency: {need.urgency}
            </Popup>
          </Marker>
        )}

        {volunteers.map(v => (
          <Marker 
            key={v.id} 
            position={[v.lat, v.lng]} 
            icon={assignedVolunteerId === v.id ? greenIcon : new L.Icon.Default()}
          >
            <Popup>
              <strong>{v.name}</strong><br/>
              Skills: {v.skills.join(', ')}
              {assignedVolunteerId === v.id && <div className="text-green-600 font-bold mt-1">✓ Assigned</div>}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
