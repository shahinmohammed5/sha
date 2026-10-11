import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { ParkingZone, IncidentReport } from '../../types';

interface LeafletMapProps {
  parkingZones?: ParkingZone[];
  incidents?: IncidentReport[];
  selectedZoneId?: string | null;
  selectedIncidentId?: string | null;
  onSelectZone?: (zoneId: string) => void;
  onReserveZone?: (zoneId: string) => void;
  onSelectIncident?: (incidentId: string) => void;
  height?: string;
  zoom?: number;
  center?: [number, number];
  interactive?: boolean;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  parkingZones = [],
  incidents = [],
  selectedZoneId,
  selectedIncidentId,
  onSelectZone,
  onReserveZone,
  onSelectIncident,
  height = '520px',
  zoom = 14,
  center = [11.9335, 79.8295], // Puducherry Town Center
  interactive = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center,
        zoom,
        zoomControl: interactive,
        dragging: interactive,
        scrollWheelZoom: interactive,
        attributionControl: false,
      });

      // Add OpenStreetMap tile layer with high clarity
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);

      // Attribution small at bottom right
      L.control.attribution({ position: 'bottomright', prefix: false }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Sync markers when parkingZones or incidents change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    // 1. Add Parking Markers
    parkingZones.forEach((zone) => {
      const occupancyRate = (zone.totalSlots - zone.availableSlots) / zone.totalSlots;
      let statusColor = '#159B72'; // green - Available
      let statusLabel = 'Available';

      if (zone.availableSlots <= 5 || occupancyRate > 0.85) {
        statusColor = '#E55353'; // red - Nearly Full / Full
        statusLabel = zone.availableSlots === 0 ? 'Full' : 'Nearly Full';
      } else if (occupancyRate > 0.6) {
        statusColor = '#F2A43A'; // amber - Filling Fast
        statusLabel = 'Filling Fast';
      }

      const isSelected = selectedZoneId === zone.id;

      // Custom SVG Pin matching reference image
      const iconHtml = `
        <div style="
          width: ${isSelected ? '38px' : '32px'};
          height: ${isSelected ? '38px' : '32px'};
          background: ${statusColor};
          border: 3px solid white;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 4px 12px rgba(7,29,56,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s ease;
        ">
          <div style="
            transform: rotate(45deg);
            color: white;
            font-size: 11px;
            font-weight: 800;
            font-family: sans-serif;
          ">
            ${zone.availableSlots}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-parking-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      const marker = L.marker([zone.lat, zone.lng], { icon: customIcon });

      // Popup Content matching Reference Image 2
      const popupDiv = document.createElement('div');
      popupDiv.className = 'p-4 min-w-[260px] text-left bg-white font-sans';
      popupDiv.innerHTML = `
        <div class="flex items-center justify-between gap-2 border-b border-gray-100 pb-2 mb-3">
          <h4 class="font-bold text-[#172B45] text-sm leading-snug">${zone.name}</h4>
          <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
            statusColor === '#159B72'
              ? 'bg-emerald-50 text-emerald-700'
              : statusColor === '#F2A43A'
              ? 'bg-amber-50 text-amber-700'
              : 'bg-rose-50 text-rose-700'
          }">${statusLabel}</span>
        </div>
        <div class="grid grid-cols-2 gap-2 text-center my-2.5">
          <div class="bg-gray-50 p-2 rounded-lg border border-gray-100">
            <span class="block text-xl font-extrabold text-[#172B45]">${zone.totalSlots}</span>
            <span class="text-[11px] text-[#6B7B90] font-medium">total spaces</span>
          </div>
          <div class="bg-blue-50 p-2 rounded-lg border border-blue-100">
            <span class="block text-xl font-extrabold text-[#1769E8]">${zone.availableSlots}</span>
            <span class="text-[11px] text-[#1769E8] font-medium">available</span>
          </div>
        </div>
        <div class="flex items-center justify-between text-xs text-[#6B7B90] my-2">
          <span>₹${zone.fourWheelerSlots.hourlyRate}/hr (4W) · ₹${zone.twoWheelerSlots.hourlyRate}/hr (2W)</span>
          <span>${zone.distanceKm || '0.5'} km</span>
        </div>
        <div class="text-[11px] text-gray-500 mb-3 truncate">📍 ${zone.address}</div>
        <div class="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
          <button id="btn-details-${zone.id}" class="w-full text-xs font-semibold py-1.5 px-2 rounded-lg border border-[#1769E8] text-[#1769E8] hover:bg-blue-50 transition-colors">
            View Details
          </button>
          <button id="btn-reserve-${zone.id}" class="w-full text-xs font-semibold py-1.5 px-2 rounded-lg bg-[#1769E8] text-white hover:bg-blue-700 transition-colors">
            Reserve
          </button>
        </div>
      `;

      marker.bindPopup(popupDiv);

      marker.on('popupopen', () => {
        const detailsBtn = document.getElementById(`btn-details-${zone.id}`);
        const reserveBtn = document.getElementById(`btn-reserve-${zone.id}`);
        if (detailsBtn && onSelectZone) {
          detailsBtn.onclick = () => onSelectZone(zone.id);
        }
        if (reserveBtn && onReserveZone) {
          reserveBtn.onclick = () => onReserveZone(zone.id);
        }
      });

      marker.on('click', () => {
        if (onSelectZone) onSelectZone(zone.id);
      });

      marker.addTo(layer);

      if (isSelected) {
        marker.openPopup();
        map.setView([zone.lat, zone.lng], 16, { animate: true });
      }
    });

    // 2. Add Incident Markers
    incidents.forEach((inc) => {
      const isSelected = selectedIncidentId === inc.id;
      const incidentIconHtml = `
        <div style="
          width: 28px;
          height: 28px;
          background: #E55353;
          border: 2px solid white;
          border-radius: 50%;
          box-shadow: 0 4px 10px rgba(229,83,83,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          animation: pulse 2s infinite;
        ">
          <svg style="width: 14px; height: 14px; color: white;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        </div>
      `;

      const incidentIcon = L.divIcon({
        html: incidentIconHtml,
        className: 'custom-incident-marker',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const incMarker = L.marker([inc.lat, inc.lng], { icon: incidentIcon });
      incMarker.bindPopup(`
        <div class="p-3 min-w-[200px] text-left font-sans">
          <div class="flex items-center gap-1.5 text-rose-600 font-bold text-xs uppercase mb-1">
            ⚠️ Traffic Incident
          </div>
          <div class="font-bold text-sm text-[#172B45]">${inc.category}</div>
          <p class="text-xs text-[#6B7B90] mt-1">${inc.description}</p>
          <div class="mt-2 text-[10px] text-gray-500 font-medium">📍 ${inc.locationName}</div>
          <div class="mt-1 text-[10px] text-gray-400">Status: <span class="font-semibold capitalize">${inc.status.replace('_', ' ')}</span></div>
        </div>
      `);

      incMarker.on('click', () => {
        if (onSelectIncident) onSelectIncident(inc.id);
      });

      incMarker.addTo(layer);

      if (isSelected) {
        incMarker.openPopup();
        map.setView([inc.lat, inc.lng], 16, { animate: true });
      }
    });
  }, [parkingZones, incidents, selectedZoneId, selectedIncidentId]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-sm bg-white">
      <div ref={mapContainerRef} style={{ height }} className="w-full z-0" />
      
      {/* Floating map legend matching ParkingOps style */}
      <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-gray-200/80 shadow-md text-xs flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#159B72]" />
          <span className="text-[#172B45] font-medium">Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F2A43A]" />
          <span className="text-[#172B45] font-medium">Filling Fast</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E55353]" />
          <span className="text-[#172B45] font-medium">Full</span>
        </div>
        <div className="flex items-center gap-1.5 border-l border-gray-200 pl-3">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping inline-block" />
          <span className="text-[#172B45] font-medium">Incidents</span>
        </div>
      </div>

      {/* Recenter Puducherry button */}
      <button
        onClick={() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setView([11.9335, 79.8295], 14, { animate: true });
          }
        }}
        title="Center Puducherry"
        className="absolute bottom-4 right-4 z-10 bg-white hover:bg-gray-50 text-[#172B45] text-xs font-semibold px-3 py-2 rounded-xl border border-gray-200 shadow-md flex items-center gap-1.5 transition-colors"
      >
        <svg className="w-3.5 h-3.5 text-[#1769E8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Puducherry Central
      </button>
    </div>
  );
};
