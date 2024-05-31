// useTimer.js
import { useEffect, useRef, useState } from 'react';

export const useTimer = (interval = 1000, onClick) => {
  const workerRef = useRef(null);
  const [time, setTime] = useState(0);

  

  useEffect(() => {
    workerRef.current = new Worker(new URL('./timeWorker.jsx', import.meta.url));
    
    workerRef.current.onmessage = (e) => {
      setTime(e.data);
    };

    return () => {
      workerRef.current.terminate();
    };
  }, [interval]);

  const startTimer = () => {
    workerRef.current.postMessage({ action: 'start', interval });
  };

  const stopTimer = () => {
    workerRef.current.postMessage({ action: 'stop' });
  };

  return { time, startTimer, stopTimer };
};
