
import { useCallback } from 'react';

interface UseProgressBarHandlersProps {
  duration: number;
  currentTime: number;
  mainVideoRef: React.RefObject<HTMLVideoElement>;
  pipVideoRef: React.RefObject<HTMLVideoElement>;
  mainProgressRef: React.RefObject<HTMLDivElement>;
  pipProgressRef: React.RefObject<HTMLDivElement>;
  isDraggingMain: boolean;
  isDraggingPip: boolean;
  setMainProgressHoverX: (x: number) => void;
  setPipProgressHoverX: (x: number) => void;
  setHoverTime: (time: number) => void;
  setPipHoverTime: (time: number) => void;
  setCurrentTime: (time: number) => void;
  setIsDraggingMain: (dragging: boolean) => void;
  setIsDraggingPip: (dragging: boolean) => void;
}

export const useProgressBarHandlers = ({
  duration,
  currentTime,
  mainVideoRef,
  pipVideoRef,
  mainProgressRef,
  pipProgressRef,
  isDraggingMain,
  isDraggingPip,
  setMainProgressHoverX,
  setPipProgressHoverX,
  setHoverTime,
  setPipHoverTime,
  setCurrentTime,
  setIsDraggingMain,
  setIsDraggingPip
}: UseProgressBarHandlersProps) => {

  const handleMainProgressMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (mainProgressRef.current && duration > 0) {
      const rect = mainProgressRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      const time = percentage * duration;
      
      setMainProgressHoverX(x);
      setHoverTime(time);
      
      if (isDraggingMain) {
        if (mainVideoRef.current) {
          mainVideoRef.current.currentTime = time;
        }
        if (pipVideoRef.current) {
          pipVideoRef.current.currentTime = time;
        }
        setCurrentTime(time);
      }
    }
  }, [duration, isDraggingMain, mainProgressRef, mainVideoRef, pipVideoRef, setMainProgressHoverX, setHoverTime, setCurrentTime]);

  const handlePipProgressMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (pipProgressRef.current && duration > 0) {
      const rect = pipProgressRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      const time = percentage * duration;
      
      setPipProgressHoverX(x);
      setPipHoverTime(time);
      
      if (isDraggingPip) {
        if (mainVideoRef.current) {
          mainVideoRef.current.currentTime = time;
        }
        if (pipVideoRef.current) {
          pipVideoRef.current.currentTime = time;
        }
        setCurrentTime(time);
      }
    }
  }, [duration, isDraggingPip, pipProgressRef, mainVideoRef, pipVideoRef, setPipProgressHoverX, setPipHoverTime, setCurrentTime]);

  const handleMainProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (mainProgressRef.current && duration > 0) {
      const rect = mainProgressRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      const newTime = percentage * duration;
      
      if (mainVideoRef.current) {
        mainVideoRef.current.currentTime = newTime;
      }
      if (pipVideoRef.current) {
        pipVideoRef.current.currentTime = newTime;
      }
      setCurrentTime(newTime);
    }
  }, [duration, mainProgressRef, mainVideoRef, pipVideoRef, setCurrentTime]);

  const handlePipProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (pipProgressRef.current && duration > 0) {
      const rect = pipProgressRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      const newTime = percentage * duration;
      
      if (mainVideoRef.current) {
        mainVideoRef.current.currentTime = newTime;
      }
      if (pipVideoRef.current) {
        pipVideoRef.current.currentTime = newTime;
      }
      setCurrentTime(newTime);
    }
  }, [duration, pipProgressRef, mainVideoRef, pipVideoRef, setCurrentTime]);

  const handleMainProgressMouseDown = useCallback(() => {
    setIsDraggingMain(true);
  }, [setIsDraggingMain]);

  const handlePipProgressMouseDown = useCallback(() => {
    setIsDraggingPip(true);
  }, [setIsDraggingPip]);

  const handleMouseUp = useCallback(() => {
    setIsDraggingMain(false);
    setIsDraggingPip(false);
  }, [setIsDraggingMain, setIsDraggingPip]);

  return {
    handleMainProgressMouseMove,
    handlePipProgressMouseMove,
    handleMainProgressClick,
    handlePipProgressClick,
    handleMainProgressMouseDown,
    handlePipProgressMouseDown,
    handleMouseUp
  };
};
