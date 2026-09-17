import React, { useState, useRef } from "react";
import { Mic, Square, Languages } from "lucide-react";

function AudioTranslator() {
    const [transcribedText, setTranscribedText] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState(null); // { text: '', type: 'success' | 'error' | 'loading' }
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const savedUser = JSON.parse(localStorage.getItem("springnova_user"));
    const username = savedUser ? savedUser.username : "guest";

    const startRecording = async () => {
        audioChunksRef.current = [];
        setTranscribedText('');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) audioChunksRef.current.push(e.data);
            };
            mediaRecorderRef.current.onstop = async () => {
                setIsLoading(true);
                setStatusMessage({ text: "⚡ Whisper AI is listening & processing...", type: 'loading' });
                const webmBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const wavBlob = await convertWebMToWav(webmBlob);
                await sendAudioToBackend(wavBlob);
            };
            mediaRecorderRef.current.start();
            setIsRecording(true);
            setStatusMessage({ text: "Recording started", type: 'success' });
            setTimeout(() => setStatusMessage(null), 2500);
        } catch (err) {
            setStatusMessage({ text: "Microphone access denied or unavailable.", type: 'error' });
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
            setIsRecording(false);
        }
    };

    const convertWebMToWav = async (webmBlob) => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
        const arrayBuffer = await webmBlob.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        const numOfChan = 1, sampleRate = 16000;
        const length = audioBuffer.length * numOfChan * 2 + 44;
        const out = new DataView(new ArrayBuffer(length));
        let offset = 0;
        let writeString = (str) => {
            for (let i = 0; i < str.length; i++) out.setUint8(offset++, str.charCodeAt(i));
        };
        writeString('RIFF'); out.setUint32(offset, length - 8, true); offset += 4;
        writeString('WAVE'); writeString('fmt '); out.setUint32(offset, 16, true); offset += 4;
        out.setUint16(offset, 1, true); offset += 2; out.setUint16(offset, numOfChan, true); offset += 2;
        out.setUint32(offset, sampleRate, true); offset += 4; out.setUint32(offset, sampleRate * 2 * numOfChan, true); offset += 4;
        out.setUint16(offset, numOfChan * 2, true); offset += 2; out.setUint16(offset, 16, true); offset += 2;
        writeString('data'); out.setUint32(offset, length - offset - 4, true); offset += 4;

        const channel = audioBuffer.getChannelData(0);
        for (let i = 0; i < channel.length; i++) {
            let sample = Math.max(-1, Math.min(1, channel[i]));
            out.setInt16(offset, sample < 0 ? sample * 32768 : sample * 32767, true);
            offset += 2;
        }
        return new Blob([out.buffer], { type: 'audio/wav' });
    };

    const sendAudioToBackend = async (blob) => {
        const formData = new FormData();
        formData.append("file", blob, "recording.wav");
        try {
            const res = await fetch(`http://localhost:8080/transcribe-audio?username=${username}`, { method: "POST", body: formData });
            if (!res.ok) throw new Error("Failed");
            const data = await res.text();
            setTranscribedText(data);
            setStatusMessage({ text: "Transcription complete!", type: 'success' });
            setTimeout(() => setStatusMessage(null), 3000);
        } catch (e) {
            setTranscribedText("Error processing transcription.");
            setStatusMessage({ text: "Error processing transcription.", type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.contentWrapper}>
                {!transcribedText && !isLoading && !isRecording && (
                    <div style={styles.hero}>
                        <h1 style={styles.title}>
                            <Languages size={22} color="#06b6d4" /> What can I help transcribe today?
                        </h1>
                    </div>
                )}

                {/* Inline Status Message Banner */}
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

                {transcribedText && (
                    <div style={styles.chatBubble}>
                        <span style={styles.bubbleLabel}>Transcription Result</span>
                        <p style={styles.bubbleText}>{transcribedText}</p>
                    </div>
                )}

                <div style={styles.buttonWrapper}>
                    <button 
                        onClick={isRecording ? stopRecording : startRecording}
                        style={{
                            ...styles.micButton,
                            backgroundColor: isRecording ? '#ef4444' : '#2f2f2f',
                            borderColor: isRecording ? '#ef4444' : '#555',
                        }}
                    >
                        {isRecording ? <><Square size={16} /> Stop Recording</> : <><Mic size={16} /> Click to Speak</>}
                    </button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: { 
        display: 'flex', 
        width: '100%', 
        height: 'calc(100vh - 60px)', 
        justifyContent: 'center', 
        alignItems: 'center', 
        boxSizing: 'border-box', 
        padding: '10px'
    },
    contentWrapper: { 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        maxWidth: '650px', 
        width: '100%',
        textAlign: 'center',
        gap: '20px'
    },
    hero: { 
        width: '100%'
    },
    title: { 
        fontSize: '22px', 
        fontWeight: '600', 
        color: '#ffffff', 
        display: 'inline-flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: '10px',
        writingMode: 'horizontal-tb',
        direction: 'ltr',
        margin: '0'
    },
    inlineBanner: { 
        padding: '8px 16px', 
        borderRadius: '8px', 
        fontSize: '13px', 
        fontWeight: '500', 
        display: 'flex', 
        alignItems: 'center',
        width: '100%',
        justifyContent: 'center',
        boxSizing: 'border-box'
    },
    chatBubble: { 
        backgroundColor: '#2f2f2f', 
        padding: '16px 20px', 
        borderRadius: '10px', 
        border: '1px solid #424242', 
        width: '100%',
        textAlign: 'left',
        writingMode: 'horizontal-tb'
    },
    bubbleLabel: { 
        fontSize: '11px', 
        textTransform: 'uppercase', 
        color: '#888', 
        letterSpacing: '1px',
        display: 'block'
    },
    bubbleText: { 
        fontSize: '15px', 
        color: '#fff', 
        marginTop: '6px', 
        lineHeight: '1.4',
        writingMode: 'horizontal-tb'
    },
    buttonWrapper: { 
        display: 'flex', 
        justifyContent: 'center', 
        width: '100%'
    },
    micButton: { 
        color: '#fff', 
        padding: '10px 24px', 
        borderRadius: '25px', 
        border: '1px solid', 
        cursor: 'pointer', 
        fontSize: '14px', 
        fontWeight: '500', 
        boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        writingMode: 'horizontal-tb'
    }
};

export default AudioTranslator;