import React, { useState } from "react";
import { Image as ImageIcon } from "lucide-react";

function ImageGenerator() {
    const [prompt, setPrompt] = useState('');
    const [imageUrls, setImageUrls] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Get current username from localStorage
    const savedUser = JSON.parse(localStorage.getItem("springnova_user"));
    const username = savedUser ? savedUser.username : "guest";

    const generateImage = async () => {
        if (!prompt.trim()) return;
        setIsLoading(true);
        try {
            // Added &username=${username} to the query parameters
            const response = await fetch(`http://localhost:8080/generate-image?prompt=${encodeURIComponent(prompt)}&username=${username}`);
            const urls = await response.json();
            setImageUrls(urls);
        } catch (error) {
            console.error("Error generating image : ", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={{ ...styles.headerTitle, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ImageIcon size={22} color="#ec4899" /> Image Generator
            </h2>
            
            <div style={styles.inputCard}>
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the image you want to create..."
                    style={styles.inputField}
                />
                <button onClick={generateImage} disabled={isLoading} style={styles.primaryBtn}>
                    {isLoading ? "Generating..." : "Generate Image"}
                </button>
            </div>

            <div style={styles.imageGrid}>
                {imageUrls.map((url, index) => (
                    <img key={index} src={url} alt={`Generated ${index}`} style={styles.generatedImage} />
                ))}
                {isLoading && <p style={{ color: '#aaa', fontStyle: 'italic' }}>Creating your artwork...</p>}
                {!isLoading && imageUrls.length === 0 && (
                    <div style={styles.emptySlot}>Your generated art will appear here</div>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: { maxWidth: '750px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' },
    headerTitle: { fontSize: '24px', fontWeight: '600', color: '#fff', marginBottom: '10px' },
    inputCard: { backgroundColor: '#212121', border: '1px solid #333', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' },
    inputField: { backgroundColor: '#2f2f2f', border: '1px solid #424242', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px', outline: 'none' },
    primaryBtn: { alignSelf: 'flex-end', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '20px', padding: '10px 20px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' },
    imageGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '10px' },
    generatedImage: { width: '100%', borderRadius: '10px', border: '1px solid #424242', objectFit: 'cover' },
    emptySlot: { border: '2px dashed #424242', borderRadius: '10px', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#777', fontSize: '13px' }
};

export default ImageGenerator;