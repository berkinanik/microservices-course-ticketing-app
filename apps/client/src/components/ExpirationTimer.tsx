'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

export const ExpirationTimer = ({
  expiresAt,
  isRefreshEnabled = false,
}: {
  expiresAt: string;
  isRefreshEnabled?: boolean;
}) => {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState<number>();

  useEffect(() => {
    function updateTimer() {
      const newTimeLeft = Math.round((new Date(expiresAt).getTime() - new Date().getTime()) / 1000);

      if (newTimeLeft <= 0) {
        clearInterval(interval);
        setTimeLeft(0);

        if (isRefreshEnabled) {
          setTimeout(() => {
            router.refresh();
          }, 1000);
        }
      } else {
        setTimeLeft(newTimeLeft);
      }
    }

    const interval = setInterval(updateTimer, 1000);

    updateTimer();

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expiresAt]);

  return expiresAt ? (
    typeof timeLeft === 'number' ? (
      <div>
        {timeLeft > 0 ? (
          <p>
            Expires in <b className="font-mono">{timeLeft}</b> seconds
          </p>
        ) : (
          <p className="italic">Expired</p>
        )}
      </div>
    ) : (
      <span className="italic">Loading...</span>
    )
  ) : null;
};
