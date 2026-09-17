import React, { useState } from 'react';
import { CloudSun, CloudRain, Sun, CloudLightning, Cloud } from 'lucide-react';

export default function WeatherView({ username = 'admin' }) {
    const [city, setCity] = useState('');
    const [weatherText, setWeatherText] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchWeather = async (e) => {
        e.preventDefault();
        if (!city.trim()) return;

        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/weather?city=${encodeURIComponent(city)}&username=${username}`);
            const data = await response.text();
            setWeatherText(data);
        } catch (err) {
            console.error("Error fetching weather:", err);
            setWeatherText("Failed to fetch weather data from server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', color: '#ececec' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>Weather Forecast Dashboard</h2>
            <p style={{ color: '#8e8e8e', fontSize: '14px', marginBottom: '24px' }}>
                Format search as <strong style={{ color: '#fff' }}>City, Country Code</strong> (e.g., <em>Vidisha, IN</em>)
            </p>

            <form onSubmit={fetchWeather} style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
                <input 
                    type="text" 
                    placeholder="e.g., Vidisha, IN" 
                    value={city} 
                    onChange={(e) => setCity(e.target.value)}
                    style={{
                        flex: 1,
                        backgroundColor: '#212121',
                        border: '1px solid #333',
                        borderRadius: '12px',
                        padding: '14px 18px',
                        color: '#fff',
                        fontSize: '15px',
                        outline: 'none'
                    }}
                />
                <button 
                    type="submit" 
                    disabled={loading}
                    style={{
                        backgroundColor: '#3b82f6',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '0 24px',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}
                >
                    {loading ? 'Searching...' : 'Get Forecast'}
                </button>
            </form>

            {weatherText && (
                <div style={{
                    background: 'linear-gradient(135deg, #1e3a8a 0%, #172554 100%)',
                    borderRadius: '20px',
                    padding: '30px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                    border: '1px solid #1d4ed8',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px'
                }}>
                    <CloudSun size={48} color="#93c5fd" />
                    <div>
                        <h3 style={{ fontSize: '18px', color: '#93c5fd', marginBottom: '8px', textTransform: 'uppercase' }}>
                            Live Weather Result
                        </h3>
                        <p style={{ fontSize: '18px', lineHeight: '1.6', color: '#fff', margin: 0 }}>
                            {weatherText}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}