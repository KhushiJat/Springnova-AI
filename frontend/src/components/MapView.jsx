import React, { useState } from 'react';
import { Navigation, Compass, Search } from 'lucide-react';

export default function MapView({ username = 'admin' }) {
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [activeMapQuery, setActiveMapQuery] = useState('World');
    const [isNavigating, setIsNavigating] = useState(false);
    const [statusMessage, setStatusMessage] = useState(null); // { text: '', type: 'success' | 'error' }

    // Track live GPS location
    const handleGetLiveGPS = () => {
        if (!navigator.geolocation) {
            setStatusMessage({ text: "Geolocation is not supported by your browser", type: 'error' });
            return;
        }

        setStatusMessage({ text: "Acquiring GPS signal...", type: 'success' });

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                const gpsQuery = `${latitude},${longitude}`;
                setActiveMapQuery(gpsQuery);
                setIsNavigating(true);
                setStatusMessage({ text: `Live GPS locked: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`, type: 'success' });
                setTimeout(() => setStatusMessage(null), 4000);

                try {
                    await fetch(`http://localhost:8080/map/track?username=${username}&queryType=GPS&details=Lat:${latitude}, Lon:${longitude}`, {
                        method: 'POST'
                    });
                } catch (e) {
                    console.error("Backend logging failed", e);
                }
            },
            (error) => {
                console.error("GPS error:", error);
                setStatusMessage({ text: "Unable to retrieve your location. Check permissions.", type: 'error' });
            },
            { enableHighAccuracy: true }
        );
    };

    // Handle custom route search and log it to backend history
    const handleRouteSearch = async (e) => {
        e.preventDefault();
        if (!destination.trim()) return;

        const query = origin.trim() ? `${origin} to ${destination}` : destination;
        setActiveMapQuery(query);
        setIsNavigating(false);
        setStatusMessage({ text: `Mapping route for: ${query}`, type: 'success' });
        setTimeout(() => setStatusMessage(null), 3500);

        // Log route search to Spring Boot backend history
        try {
            await fetch(`http://localhost:8080/map/track?username=${username}&queryType=ROUTE&details=${encodeURIComponent(query)}`, {
                method: 'POST'
            });
        } catch (e) {
            console.error("Backend logging failed", e);
        }
    };

    const mapEmbedUrl = isNavigating
        ? `https://maps.google.com/maps?q=${activeMapQuery}&t=&z=16&ie=UTF8&iwloc=&output=embed`
        : `https://maps.google.com/maps?q=${encodeURIComponent(activeMapQuery)}&t=&z=12&ie=UTF8&iwloc=&output=embed`;

    return (
        <div style={{ width: '100%', maxWidth: '950px', margin: '0 auto', padding: '30px', color: '#ececec', boxSizing: 'border-box' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>SpringNova Live Maps & Tracker</h2>
            <p style={{ color: '#8e8e8e', fontSize: '14px', marginBottom: '20px' }}>
                Track your precise live coordinates or search directions between locations.
            </p>

            {/* Inline Status Banner */}
            {statusMessage && (
                <div style={{
                    ...styles.inlineBanner,
                    backgroundColor: statusMessage.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                    color: statusMessage.type === 'error' ? '#f87171' : '#34d399',
                    border: statusMessage.type === 'error' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)'
                }}>
                    {statusMessage.text}
                </div>
            )}

            <div style={{
                backgroundColor: '#212121',
                border: '1px solid #333',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '20px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '15px' }}>
                    <button
                        onClick={handleGetLiveGPS}
                        style={{
                            flex: 1,
                            backgroundColor: '#2563eb',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '12px 16px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            fontSize: '14px'
                        }}
                    >
                        <Navigation size={18} /> Track My Live GPS Location
                    </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', margin: '15px 0', color: '#666' }}>
                    <div style={{ flex: 1, height: '1px', backgroundColor: '#333' }}></div>
                    <span style={{ padding: '0 10px', fontSize: '12px', textTransform: 'uppercase', color: '#8e8e8e' }}>Or Search Route</span>
                    <div style={{ flex: 1, height: '1px', backgroundColor: '#333' }}></div>
                </div>

                <form onSubmit={handleRouteSearch} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <input 
                        type="text" 
                        placeholder="Starting point (optional)" 
                        value={origin} 
                        onChange={(e) => setOrigin(e.target.value)}
                        style={{
                            flex: 1,
                            minWidth: '200px',
                            backgroundColor: '#171717',
                            border: '1px solid #333',
                            borderRadius: '10px',
                            padding: '12px 14px',
                            color: '#fff',
                            fontSize: '14px',
                            outline: 'none'
                        }}
                    />
                    <input 
                        type="text" 
                        placeholder="Destination (e.g. Bhopal, IN)" 
                        value={destination} 
                        onChange={(e) => setDestination(e.target.value)}
                        style={{
                            flex: 1,
                            minWidth: '200px',
                            backgroundColor: '#171717',
                            border: '1px solid #333',
                            borderRadius: '10px',
                            padding: '12px 14px',
                            color: '#fff',
                            fontSize: '14px',
                            outline: 'none'
                        }}
                    />
                    <button 
                        type="submit" 
                        style={{
                            backgroundColor: '#10b981',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '0 20px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}
                    >
                        <Search size={16} /> Get Route
                    </button>
                </form>
            </div>

            <div style={{
                backgroundColor: '#212121',
                border: '1px solid #333',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                height: '450px',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{ padding: '12px 18px', backgroundColor: '#171717', borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Compass size={18} color="#3b82f6" />
                        <span style={{ fontSize: '14px', fontWeight: '500', color: '#fff' }}>
                            {isNavigating ? 'Live GPS Navigation Active' : `Map View: ${activeMapQuery}`}
                        </span>
                    </div>
                    <span style={{ fontSize: '12px', color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '6px' }}>
                        Connected
                    </span>
                </div>
                <iframe
                    title="SpringNova Live Map Tracker"
                    src={mapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0, flex: 1 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>
        </div>
    );
}

const styles = {
    inlineBanner: { 
        padding: '10px 16px', 
        borderRadius: '10px', 
        fontSize: '13px', 
        fontWeight: '500', 
        display: 'flex', 
        alignItems: 'center', 
        width: '100%', 
        boxSizing: 'border-box', 
        marginBottom: '20px' 
    }
};