import React, { useRef, useEffect, useCallback } from 'react';
import { GameEngine } from '../game/GameEngine';

interface GameCanvasProps {
  engineRef: React.MutableRefObject<GameEngine | null>;
  controlMode: 'tap_switch' | 'drag_steer';
  onAction?: () => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  engineRef,
  controlMode,
  onAction
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!engineRef.current || !canvasRef.current) return;

    if (controlMode === 'tap_switch') {
      engineRef.current.handleAction();
      if (onAction) onAction();
    } else {
      const rect = canvasRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const virtualX = (clickX / rect.width) * 420;
      engineRef.current.handleSteer(virtualX);
    }
  }, [engineRef, controlMode, onAction]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (controlMode !== 'drag_steer' || !engineRef.current || !canvasRef.current) return;
    if (e.buttons > 0) {
      const rect = canvasRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const virtualX = (clickX / rect.width) * 420;
      engineRef.current.handleSteer(virtualX);
    }
  }, [engineRef, controlMode]);

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!engineRef.current) return;

      if (e.code === 'Space' || e.code === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        engineRef.current.handleAction();
        if (onAction) onAction();
      } else if (e.code === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        engineRef.current.setDirection(-1);
      } else if (e.code === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        engineRef.current.setDirection(1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [engineRef, onAction]);

  // Handle viewport resize
  useEffect(() => {
    const handleResize = () => {
      if (engineRef.current) {
        engineRef.current.handleResize();
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [engineRef]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full max-w-[480px] max-h-[880px] mx-auto flex items-center justify-center overflow-hidden touch-none select-none rounded-none sm:rounded-3xl shadow-[0_0_50px_rgba(0,240,255,0.15)] sm:border sm:border-white/10"
    >
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        className="w-full h-full block cursor-pointer select-none touch-none"
      />
    </div>
  );
};

