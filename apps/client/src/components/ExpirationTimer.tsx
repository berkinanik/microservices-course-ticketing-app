'use client';

import { useEffect, useState } from 'react';

export const ExpirationTimer = ({ expiresAt }: { expiresAt: string }) => {
  const [timeLeft, setTimeLeft] = useState<number>();

  useEffect(() => {
    function updateTimer() {
      const newTimeLeft = Math.round((new Date(expiresAt).getTime() - new Date().getTime()) / 1000);

      if (newTimeLeft <= 0) {
        clearInterval(interval);
        setTimeLeft(0);
      } else {
        setTimeLeft(newTimeLeft);
      }
    }

    const interval = setInterval(updateTimer, 1000);

    updateTimer();

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expiresAt]);

  return expiresAt && typeof timeLeft === 'number' ? (
    <div>
      {timeLeft > 0 ? (
        <p>
          Expires in <b>{timeLeft}</b> seconds
        </p>
      ) : (
        <p>Expired</p>
      )}
    </div>
  ) : null;
};
