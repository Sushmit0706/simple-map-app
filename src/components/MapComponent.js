import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { EditControl } from "react-leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import { SearchControl, OpenStreetMapProvider } from 'react-leaflet-geosearch';
import 'react-leaflet-geosearch/lib/react-leaflet-geosearch.css';

// Fixing default icon issue with React Leaflet and Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
});

const geojsonFeature = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [-0.1, 51.505],
            [-0.1, 51.51],
            [-0.06, 51.51],
            [-0.06, 51.505],
            [-0.1, 51.505]
          ]
        ]
      }
    }
  ]
};

const MapComponent = () => {
  const [showGeoJSON, setShowGeoJSON] = useState(true);
  const [markers, setMarkers] = useState([]);
  const provider = new OpenStreetMapProvider();

  const handleCreated = (e) => {
    const type = e.layerType;
    const layer = e.layer;

    if (type === 'marker') {
      setMarkers([...markers, layer.getLatLng()]);
    }
  };

  const handleDeleted = (e) => {
    const layers = e.layers;
    layers.eachLayer((layer) => {
      setMarkers(markers.filter(marker => marker.lat !== layer.getLatLng().lat && marker.lng !== layer.getLatLng().lng));
    });
  };

  return (
    <div>
      <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: "100vh", width: "100%" }}>
        <TileLayer
          url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a> contributors'
          subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
        />
        <SearchControl provider={provider} showMarker={true} retainZoomLevel={false} animateZoom={true} autoClose={true} />
        <Marker position={[51.505, -0.09]}>
          <Popup>
            You clicked the marker!
          </Popup>
        </Marker>
        {showGeoJSON && (
          <GeoJSON data={geojsonFeature} style={{ color: 'red', opacity: 0.5 }} />
        )}
        {markers.map((position, idx) => (
          <Marker key={`marker-${idx}`} position={position}>
            <Popup>
              Marker at {position.toString()}
            </Popup>
          </Marker>
        ))}
        <EditControl
          position="topright"
          onCreated={handleCreated}
          onDeleted={handleDeleted}
          draw={{
            rectangle: false,
            circle: false,
            circlemarker: false,
            polyline: false
          }}
        />
      </MapContainer>
      <button onClick={() => setShowGeoJSON(!showGeoJSON)}>
        Toggle GeoJSON Layer
      </button>
    </div>
  );
};

export default MapComponent;