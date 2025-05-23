
import React, { useState, useEffect, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin } from 'lucide-react';
import { toast } from 'sonner';

const LocationMap = () => {
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  // Sample data - in a real app, this would come from your database
  const shohibulLocations = [
    { name: "Ahmad Fauzi", address: "Jl. Pantai Mentari Blok U-21", coordinates: [112.7378, -7.2575] },
    { name: "Budi Santoso", address: "Jl. Pantai Mentari Blok R-05", coordinates: [112.7398, -7.2565] },
    { name: "Siti Aminah", address: "Jl. Pantai Utara No. 123", coordinates: [112.7358, -7.2555] },
    { name: "Hasan Mahmud", address: "Jl. Mentari Timur No. 45", coordinates: [112.7418, -7.2585] },
  ];

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    // Clear any existing map
    if (map.current) {
      map.current.remove();
      map.current = null;
    }

    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [112.7378, -7.2575], // Surabaya, Indonesia coordinates
        zoom: 14
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl(),
        'top-right'
      );

      // Add event handler for when the map finishes loading
      map.current.on('load', () => {
        // Add markers for each shohibul
        addMarkers();
        toast.success("Peta berhasil dimuat!");
        setShowTokenInput(false);
      });

      map.current.on('error', () => {
        toast.error("Terjadi kesalahan saat memuat peta. Pastikan token Mapbox valid.");
        setShowTokenInput(true);
      });
    } catch (error) {
      console.error("Error initializing map:", error);
      toast.error("Terjadi kesalahan saat memuat peta");
    }
  };

  const addMarkers = () => {
    if (!map.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Filter locations if there's a search query
    const locationsToShow = searchQuery
      ? shohibulLocations.filter(loc => 
          loc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          loc.address.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : shohibulLocations;

    // Add markers for filtered locations
    locationsToShow.forEach(location => {
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.color = '#E53935';
      el.style.width = '30px';
      el.style.height = '30px';

      const marker = new mapboxgl.Marker({ color: '#E53935' })
        .setLngLat(location.coordinates as [number, number])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <h3 style="margin: 0; font-weight: bold;">${location.name}</h3>
              <p style="margin: 5px 0 0;">${location.address}</p>
            `)
        )
        .addTo(map.current!);

      markersRef.current.push(marker);
    });

    // If there are filtered results, fit the map to show all markers
    if (locationsToShow.length > 0 && locationsToShow.length < shohibulLocations.length) {
      const bounds = new mapboxgl.LngLatBounds();
      locationsToShow.forEach(location => {
        bounds.extend(location.coordinates as [number, number]);
      });
      map.current.fitBounds(bounds, { padding: 50 });
    }
  };

  useEffect(() => {
    if (mapboxToken) {
      initializeMap();
    }
  }, [mapboxToken]);

  useEffect(() => {
    if (map.current) {
      addMarkers();
    }
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    addMarkers();
  };

  return (
    <Layout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Peta Lokasi</h1>
        <p className="text-gray-500">Visualisasi peta lokasi shohibul qurban.</p>
        
        {showTokenInput ? (
          <Card>
            <CardHeader>
              <CardTitle>Masukkan Token Mapbox</CardTitle>
              <CardDescription>
                Token Mapbox diperlukan untuk menampilkan peta. Dapatkan token di 
                <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500"> mapbox.com</a>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input 
                  type="text" 
                  placeholder="Masukkan token Mapbox Anda"
                  value={mapboxToken}
                  onChange={(e) => setMapboxToken(e.target.value)}
                />
                <Button onClick={initializeMap}>Muat Peta</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-4">
              <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="text"
                    placeholder="Cari berdasarkan nama atau alamat..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button type="submit">Cari</Button>
              </form>
            </CardContent>
          </Card>
        )}
        
        <div className="h-[600px] border rounded-lg overflow-hidden">
          <div ref={mapContainer} className="h-full w-full" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Lokasi</CardTitle>
            <CardDescription>
              Daftar lengkap shohibul qurban yang terdaftar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {shohibulLocations.map((location, index) => (
                <div 
                  key={index} 
                  className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    if (map.current) {
                      map.current.flyTo({
                        center: location.coordinates as [number, number],
                        zoom: 16,
                        essential: true
                      });
                      
                      // Find and open the popup for this marker
                      markersRef.current.forEach(marker => {
                        const markerLngLat = marker.getLngLat();
                        if (
                          markerLngLat.lng === location.coordinates[0] && 
                          markerLngLat.lat === location.coordinates[1]
                        ) {
                          marker.togglePopup();
                        }
                      });
                    }
                  }}
                >
                  <MapPin className="text-red-500 mr-3" />
                  <div>
                    <p className="font-medium">{location.name}</p>
                    <p className="text-sm text-gray-500">{location.address}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default LocationMap;
