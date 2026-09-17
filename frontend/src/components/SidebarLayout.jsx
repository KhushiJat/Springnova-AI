import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Image, Utensils, Languages, History, CloudSun } from 'lucide-react';

function SidebarLayout({ activeTab, setActiveTab, children }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [statusMessage, setStatusMessage] = useState(null); // { text: '', type: 'success' | 'error' }
    const menuRef = useRef(null);

    const tabs = [
        { id: 'ask', label: 'Ask AI', icon: <Sparkles size={18} /> },
        { id: 'image', label: 'Image Generator', icon: <Image size={18} /> },
        { id: 'recipe', label: 'Recipe Generator', icon: <Utensils size={18} /> },
        { id: 'audio', label: 'Audio Translator', icon: <Languages size={18} /> },
        { id: 'weather', label: 'Weather Forecast', icon: <CloudSun size={18} /> },
        { id: 'history', label: 'Activity History', icon: <History size={18} /> }
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelectTab = (tab) => {
        setActiveTab(tab.id);
        setIsMenuOpen(false);
        
        // Show inline banner instead of toast popup
        setStatusMessage({
            text: `Switched to ${tab.label}`,
            type: 'success' // Change to 'error' if you want red banners for specific actions
        });

        // Automatically hide message after 3 seconds
        setTimeout(() => {
            setStatusMessage(null);
        }, 3000);
    };

    return (
        <div style={styles.appContainer}>
            <div style={styles.mainContent}>
                <div style={styles.topBar} ref={menuRef}>
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)} 
                        style={styles.menuButton}
                    >
                        <span style={styles.hamburgerIcon}>☰</span>
                        <span>Main Menu</span>
                    </button>

                    {/* Inline Status Banner (Green for success, Red for error) */}
                    {statusMessage && (
                        <div style={{
                            ...styles.inlineBanner,
                            backgroundColor: statusMessage.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            color: statusMessage.type === 'success' ? '#34d399' : '#f87171',
                            border: statusMessage.type === 'success' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)'
                        }}>
                            {statusMessage.text}
                        </div>
                    )}

                    {isMenuOpen && (
                        <div style={styles.dropdownMenu}>
                            {tabs.map((tab) => {
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => handleSelectTab(tab)}
                                        style={{
                                            ...styles.dropdownItem,
                                            backgroundColor: isActive ? '#2f2f2f' : 'transparent',
                                            color: isActive ? '#ffffff' : '#b4b4b4',
                                            fontWeight: isActive ? '600' : '400',
                                            border: isActive ? '1px solid #424242' : '1px solid transparent',
                                        }}
                                    >
                                        <span style={{ display: 'flex', alignItems: 'center', color: isActive ? '#3b82f6' : '#9ca3af' }}>
                                            {tab.icon}
                                        </span>
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div style={styles.scrollableArea}>
                    {children}
                </div>
            </div>
        </div>
    );
}

const styles = {
    appContainer: { display: 'flex', flexDirection: 'column', height: 'calc(100vh - 56px)', backgroundColor: '#171717', color: '#ececec', fontFamily: 'Söhne, ui-sans-serif, system-ui, sans-serif', overflow: 'hidden' },
    mainContent: { flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', backgroundColor: '#171717', overflow: 'hidden' },
    topBar: { padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '15px', borderBottom: '1px solid #2f2f2f', backgroundColor: '#171717', position: 'relative' },
    menuButton: { display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#212121', border: '1px solid #333', color: '#ececec', padding: '10px 16px', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', outline: 'none' },
    hamburgerIcon: { fontSize: '16px' },
    inlineBanner: { padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '500', display: 'flex', alignItems: 'center', animation: 'fadeIn 0.3s ease' },
    dropdownMenu: { position: 'absolute', top: '65px', left: '24px', backgroundColor: '#1e1e1e', border: '1px solid #333333', borderRadius: '14px', padding: '8px', width: '240px', boxShadow: '0 10px 30px rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', gap: '6px', zIndex: 1000 },
    dropdownItem: { textAlign: 'left', padding: '12px 16px', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', transition: 'background 0.2s ease', outline: 'none', display: 'flex', alignItems: 'center', gap: '12px' },
    scrollableArea: { flex: 1, overflowY: 'auto', padding: '30px' }
};

export default SidebarLayout;