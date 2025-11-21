import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, Pause, RotateCcw } from "lucide-react";

const PRESET_TIMES = [
  { label: "5 min", seconds: 300 },
  { label: "10 min", seconds: 600 },
  { label: "15 min", seconds: 900 },
  { label: "25 min", seconds: 1500 },
];

export default function Timer() {
  const [totalSeconds, setTotalSeconds] = useState(1500); // Default 25 minutes
  const [timeLeft, setTimeLeft] = useState(1500);
  const [isRunning, setIsRunning] = useState(false);
  const [customMinutes, setCustomMinutes] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            playNotification();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const playNotification = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {
        // Ignore autoplay errors
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePresetClick = (seconds: number) => {
    setTotalSeconds(seconds);
    setTimeLeft(seconds);
    setIsRunning(false);
  };

  const handleCustomTime = () => {
    const minutes = parseInt(customMinutes);
    if (!isNaN(minutes) && minutes > 0 && minutes <= 999) {
      const seconds = minutes * 60;
      setTotalSeconds(seconds);
      setTimeLeft(seconds);
      setIsRunning(false);
      setCustomMinutes("");
    }
  };

  const handleReset = () => {
    setTimeLeft(totalSeconds);
    setIsRunning(false);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;
  const circumference = 2 * Math.PI * 140;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-8">
      <div className="w-full max-w-md space-y-8">
        {/* Timer Display */}
        <div className="relative flex items-center justify-center">
          <svg className="absolute w-[320px] h-[320px] sm:w-[360px] sm:h-[360px] -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="140"
              stroke="hsl(var(--progress-bg))"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="50%"
              cy="50%"
              r="140"
              stroke="hsl(var(--primary))"
              strokeWidth="12"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ 
                transition: "stroke-dashoffset 0.3s linear",
                filter: "drop-shadow(0 0 8px hsl(var(--timer-glow) / 0.6))"
              }}
            />
          </svg>
          
          <div className={`text-center ${isRunning ? "animate-pulse-glow" : ""}`}>
            <div className="text-7xl sm:text-8xl font-bold font-mono tracking-tight text-foreground">
              {formatTime(timeLeft)}
            </div>
            <div className="text-muted-foreground text-sm mt-2 uppercase tracking-wider">
              {isRunning ? "Running" : timeLeft === 0 ? "Completed" : "Ready"}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <Button
            size="lg"
            onClick={toggleTimer}
            className="w-20 h-20 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-[var(--shadow-glow)] transition-all"
          >
            {isRunning ? (
              <Pause className="w-8 h-8" />
            ) : (
              <Play className="w-8 h-8 ml-1" />
            )}
          </Button>
          
          <Button
            size="lg"
            variant="secondary"
            onClick={handleReset}
            className="w-20 h-20 rounded-full shadow-lg"
          >
            <RotateCcw className="w-7 h-7" />
          </Button>
        </div>

        {/* Preset Times */}
        <div className="grid grid-cols-4 gap-3">
          {PRESET_TIMES.map((preset) => (
            <Button
              key={preset.label}
              variant="secondary"
              onClick={() => handlePresetClick(preset.seconds)}
              className={`h-14 transition-all ${
                totalSeconds === preset.seconds && !isRunning
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : ""
              }`}
            >
              {preset.label}
            </Button>
          ))}
        </div>

        {/* Custom Time Input */}
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Custom minutes"
            value={customMinutes}
            onChange={(e) => setCustomMinutes(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCustomTime()}
            className="bg-card border-border text-foreground placeholder:text-muted-foreground"
            min="1"
            max="999"
          />
          <Button
            onClick={handleCustomTime}
            variant="secondary"
            className="px-8"
          >
            Set
          </Button>
        </div>
      </div>

      {/* Hidden audio element for notification */}
      <audio ref={audioRef} src="https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3" />
    </div>
  );
}
