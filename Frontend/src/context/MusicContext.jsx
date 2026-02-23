import React, { createContext, useContext, useEffect, useRef, useState } from "react";

const MusicContext = createContext();

export function useMusic() {
  return useContext(MusicContext);
}

export function MusicProvider({ children }) {
  const tracks = [
    "/src/assets/audio1.mp3",
    "/src/assets/audio2.mp3",
    "/src/assets/audio3.mp3",
    "/src/assets/audio4.mp3",
    "/src/assets/audio5.mp3",
  ];

  const audioRef = useRef(new Audio(tracks[0]));
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.6);
  const [hasAutoplayFailed, setHasAutoplayFailed] = useState(false);

  const isUserLoggedIn = () => {
    return !!localStorage.getItem("user");
  };

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;

    const handleEnded = () => {
      setTrackIndex((prev) => (prev + 1) % tracks.length);
    };

    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, [tracks.length]);

  // Auto play if user logged in and has not failed autoplay
  useEffect(() => {
    if (isUserLoggedIn() && !hasAutoplayFailed) {
      setIsPlaying(true);
      audioRef.current.play().catch(() => {
        setHasAutoplayFailed(true); // If autoplay fails, update the state
      });
    }
  }, [hasAutoplayFailed]);

  useEffect(() => {
    const audio = audioRef.current;
    audio.src = tracks[trackIndex];
    if (isPlaying) {
      audio.play().catch(() => {
        setHasAutoplayFailed(true); // Handle if autoplay fails
      });
    }
  }, [trackIndex, isPlaying, tracks]);

  const play = () => {
    setHasAutoplayFailed(false); // Reset autoplay error on manual play
    setIsPlaying(true);
    audioRef.current.play().catch(() => {
      setHasAutoplayFailed(true); // In case the play fails
    });
  };

  const pause = () => {
    setIsPlaying(false);
    audioRef.current.pause();
  };

  const nextTrack = () => {
    setTrackIndex((prev) => (prev + 1) % tracks.length);
  };

  const prevTrack = () => {
    setTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  const value = {
    isPlaying,
    play,
    pause,
    nextTrack,
    prevTrack,
    volume,
    setVolume,
    trackIndex,
    tracks,
    hasAutoplayFailed,
  };

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
}
