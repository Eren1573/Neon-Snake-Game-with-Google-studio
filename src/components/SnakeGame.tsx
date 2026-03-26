import React, { useState, useEffect, useCallback, useRef } from 'react';

type Point = { x: number; y: number };

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Point = { x: 0, y: -1 };

export default function SnakeGame({ onScoreChange, highScore }: { onScoreChange: (score: number) => void, highScore: number }) {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);

  const directionRef = useRef(direction);
  directionRef.current = direction;

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setGameOver(false);
    setScore(0);
    onScoreChange(0);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (gameOver) return;
      
      const { x, y } = directionRef.current;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (x !== -1) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => {
            const newScore = s + 10;
            onScoreChange(newScore);
            return newScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, 100);
    return () => clearInterval(intervalId);
  }, [food, gameOver, isPaused, generateFood, onScoreChange]);

  return (
    <div className="relative flex flex-col items-center justify-center w-full">
      <div 
        className="grid bg-black/60 backdrop-blur-md border border-neon-cyan/50 glow-cyan rounded-2xl overflow-hidden relative"
        style={{ 
          gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
          width: 'min(100%, 500px)',
          aspectRatio: '1 / 1'
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);
          
          const isSnakeHead = snake[0].x === x && snake[0].y === y;
          const isSnakeBody = snake.some((segment, idx) => idx !== 0 && segment.x === x && segment.y === y);
          const isFood = food.x === x && food.y === y;

          return (
            <div 
              key={i} 
              className={`
                w-full h-full border border-neon-cyan/[0.03]
                ${isSnakeHead ? 'bg-neon-cyan glow-cyan rounded-sm z-10 scale-110 shadow-[0_0_15px_#00f3ff]' : ''}
                ${isSnakeBody ? 'bg-neon-cyan/80 rounded-sm shadow-[0_0_8px_rgba(0,243,255,0.5)]' : ''}
                ${isFood ? 'bg-neon-magenta glow-magenta rounded-full animate-pulse scale-75 shadow-[0_0_15px_#ff00ff]' : ''}
              `}
            />
          );
        })}

        {gameOver && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center z-50">
            <div className="bg-black/50 border border-neon-magenta/50 p-10 md:p-16 rounded-3xl glow-magenta flex flex-col items-center max-w-xl w-full mx-4 shadow-[0_0_50px_rgba(255,0,255,0.15)]">
              <h2 className="text-5xl md:text-6xl font-display font-black text-neon-magenta text-glow-magenta mb-6 tracking-widest uppercase text-center">SYSTEM CRASH</h2>
              <div className="text-white mb-10 text-center space-y-4 font-bold tracking-widest text-xl md:text-2xl">
                <p>FINAL SCORE: <span className="text-neon-cyan text-glow-cyan">{score}</span></p>
                <p>HIGH SCORE: <span className="text-neon-magenta text-glow-magenta">{Math.max(score, highScore)}</span></p>
              </div>
              <button 
                onClick={resetGame}
                className="px-10 py-4 bg-neon-cyan/10 border border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black hover:glow-cyan transition-all duration-300 rounded-xl font-display font-bold tracking-widest uppercase text-lg"
              >
                REBOOT SYSTEM
              </button>
            </div>
          </div>
        )}

        {isPaused && !gameOver && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-20 rounded-2xl">
            <h2 className="text-4xl font-display font-black text-neon-cyan text-glow-cyan tracking-widest uppercase">PAUSED</h2>
          </div>
        )}
      </div>
      
      <div className="mt-8 text-gray-400 text-sm flex flex-wrap justify-center gap-8 uppercase tracking-widest font-bold">
        <span className="flex items-center gap-3">
          <kbd className="bg-black/50 border border-neon-cyan/50 px-3 py-1.5 rounded-lg text-neon-cyan shadow-[0_0_10px_rgba(0,243,255,0.2)]">W A S D</kbd> 
          <span>MOVE</span>
        </span>
        <span className="flex items-center gap-3">
          <kbd className="bg-black/50 border border-neon-magenta/50 px-3 py-1.5 rounded-lg text-neon-magenta shadow-[0_0_10px_rgba(255,0,255,0.2)]">SPACE</kbd> 
          <span>PAUSE</span>
        </span>
      </div>
    </div>
  );
}
