"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";

interface SoundContextType {
    isMuted: boolean;
    toggleMute: () => void;
    playHover: () => void;
    playClick: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundProvider({ children }: { children: React.ReactNode }) {
    const [isMuted, setIsMuted] = useState(true); // Default to muted to avoid jarring users
    const audioCtxRef = useRef<AudioContext | null>(null);

    useEffect(() => {
        const savedMute = localStorage.getItem("sound-muted");
        if (savedMute !== null) {
            setIsMuted(savedMute === "true");
        } else {
            // Auto mute on touch devices by default if no preference is saved
            const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
            setIsMuted(isTouchDevice);
        }
    }, []);

    const toggleMute = useCallback(() => {
        setIsMuted((prev) => {
            const newValue = !prev;
            localStorage.setItem("sound-muted", String(newValue));
            return newValue;
        });
    }, []);

    const initAudioContext = useCallback(() => {
        if (!audioCtxRef.current) {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            audioCtxRef.current = new AudioContext();
        }
        if (audioCtxRef.current.state === "suspended") {
            audioCtxRef.current.resume();
        }
        return audioCtxRef.current;
    }, []);

    const playHover = useCallback(() => {
        if (isMuted) return;
        try {
            const ctx = initAudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            // Soft high frequency "tick"
            osc.type = "sine";
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05);
            
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.015, ctx.currentTime + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
            
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.05);
        } catch (e) {
            console.error("Audio play failed:", e);
        }
    }, [isMuted, initAudioContext]);

    const playClick = useCallback(() => {
        if (isMuted) return;
        try {
            const ctx = initAudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            // Deeper, slightly longer "pop"
            osc.type = "sine";
            osc.frequency.setValueAtTime(600, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
            
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
            
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.1);
        } catch (e) {
            console.error("Audio play failed:", e);
        }
    }, [isMuted, initAudioContext]);

    return (
        <SoundContext.Provider value={{ isMuted, toggleMute, playHover, playClick }}>
            {children}
        </SoundContext.Provider>
    );
}

export function useSound() {
    const context = useContext(SoundContext);
    if (context === undefined) {
        throw new Error("useSound must be used within a SoundProvider");
    }
    return context;
}
