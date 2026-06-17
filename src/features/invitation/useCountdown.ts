import { useEffect, useState } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

/** Đếm ngược tới ngày cưới. Trả về {days,hours,minutes,seconds,isPast}. */
export function useCountdown(target: string | null): TimeLeft {
  const calc = (): TimeLeft => {
    if (!target) return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
    const diff = new Date(target.replace(' ', 'T')).getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff / 3600000) % 24),
      minutes: Math.floor((diff / 60000) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      isPast: false,
    };
  };

  const [time, setTime] = useState<TimeLeft>(calc);

  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return time;
}
