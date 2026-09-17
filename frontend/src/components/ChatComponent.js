import React, { useState } from "react";
import { Sparkles } from "lucide-react";

function ChatComponent() {
    const [prompt, setPrompt] = useState('');
    const [chatResponse, setChatResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState(null); // { text: '', type: 'success' | 'error' }

    const askAI = async () => {
        if (!prompt.trim()) {
            setStatusMessage({ text: "Please enter a prompt first!", type: 'error' });
            return;
        }

        setIsLoading(true);
        setStatusMessage({ text: "Thinking...", type: 'success' });

        try {
            const response = await fetch(`http://localhost:8080/ask-ai?encode=true&prompt=${encodeURIComponent(prompt)}`);
            if (!response.ok) throw new Error("Failed to fetch response");
            
            const data = await response.text();
            setChatResponse(data);
            setStatusMessage({ text: "AI response generated!", type: 'success' });
            setTimeout(() => setStatusMessage(null), 3000);
        } catch (error) {
            console.error("Error generating response : ", error);
            setChatResponse("Error generating response from AI.");
            setStatusMessage({ text: "Failed to get response from AI.", type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={{ ...styles.headerTitle, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Sparkles size={22} color="#3b82f6" /> Ask AI
            </h2>

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
            
            <div style={styles.inputCard}>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ask anything or request creative assistance..."
                    rows={3}
                    style={styles.textarea}
                />
                <button onClick={askAI} disabled={isLoading} style={styles.primaryBtn}>
                    {isLoading ? "Thinking..." : "Send Prompt"}
                </button>
            </div>

            {(chatResponse || isLoading) && (
                <div style={styles.outputCard}>
                    <span style={styles.outputLabel}>AI Response</span>
                    {isLoading ? (
                        <p style={styles.loadingText}>Generating response...</p>
                    ) : (
                        <p style={styles.outputText}>{chatResponse}</p>
                    )}
                </div>
            )}
        </div>
    );
}

const styles = {
    container: { maxWidth: '750px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' },
    headerTitle: { fontSize: '24px', fontWeight: '600', color: '#fff', marginBottom: '10px' },
    inlineBanner: { padding: '10px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '500', display: 'flex', alignItems: 'center', width: '100%', boxSizing: 'border-box' },
    inputCard: { backgroundColor: '#212121', border: '1px solid #333', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' },
    textarea: { backgroundColor: '#2f2f2f', border: '1px solid #424242', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px', outline: 'none', fontFamily: 'inherit', resize: 'vertical' },
    primaryBtn: { alignSelf: 'flex-end', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '20px', padding: '10px 20px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' },
    outputCard: { backgroundColor: '#2f2f2f', border: '1px solid #424242', borderRadius: '12px', padding: '20px' },
    outputLabel: { fontSize: '11px', textTransform: 'uppercase', color: '#888', letterSpacing: '1px' },
    outputText: { fontSize: '15px', color: '#fff', marginTop: '8px', lineHeight: '1.6', whiteSpace: 'pre-wrap' },
    loadingText: { color: '#aaa', fontStyle: 'italic', marginTop: '8px' }
};

export default ChatComponent;