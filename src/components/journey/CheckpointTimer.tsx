"use client";

import styles from "./CheckpointTimer.module.css";

interface CheckpointTimerProps {
  timeLeft: number;
  totalTime: number;
}

export function CheckpointTimer({ timeLeft, totalTime }: CheckpointTimerProps) {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const progress = totalTime > 0 ? timeLeft / totalTime : 0;
  const dashOffset = circumference * (1 - progress);

  const isUrgent = timeLeft <= 30;
  const isWarning = timeLeft <= 60 && timeLeft > 30;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeStr = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  return (
    <div className={`${styles.timer} ${isUrgent ? styles.urgent : isWarning ? styles.warning : ""}`}>
      <svg width="64" height="64" viewBox="0 0 64 64" className={styles.svg}>
        <circle cx="32" cy="32" r={radius} className={styles.track} />
        <circle
          cx="32"
          cy="32"
          r={radius}
          className={styles.progress}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform="rotate(-90 32 32)"
        />
      </svg>
      <span className={styles.time}>{timeStr}</span>
    </div>
  );
}
