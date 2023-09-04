import { useEffect, useState } from 'react';
import styles from './ReactGGPromoBanner.module.scss';
import useLocalStorage from './useLocalStorage';

function CloseButton({ onClick }) {
  return (
    <button className={styles.close} onClick={onClick}>
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth={0}
        viewBox="0 0 512 512"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M289.94 256l95-95A24 24 0 00351 127l-95 95-95-95a24 24 0 00-34 34l95 95-95 95a24 24 0 1034 34l95-95 95 95a24 24 0 0034-34z"
          stroke="none"
        />
      </svg>
    </button>
  );
}

function timeUntilTargetPST(targetYear, targetMonth, targetDay) {
  const now = new Date();

  // Extract the UTC year, month, day, hour, minute, and second
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const date = now.getUTCDate();
  const hour = now.getUTCHours();
  const minute = now.getUTCMinutes();
  const second = now.getUTCSeconds();

  // Create a current UTC date object
  const currentUTC = new Date(Date.UTC(year, month, date, hour, minute, second)) as any;

  // Construct the target UTC date at 8 AM UTC (midnight PST)
  const targetUTC = new Date(Date.UTC(targetYear, targetMonth - 1, targetDay, 8, 0, 0)) as any;

  let delta = (targetUTC - currentUTC) / 1000;

  const days = Math.floor(delta / 86400);
  delta -= days * 86400;

  const hours = Math.floor(delta / 3600) % 24;
  delta -= hours * 3600;

  const minutes = Math.floor(delta / 60) % 60;
  delta -= minutes * 60;

  const seconds = delta % 60;

  return {
    days: String(days).padStart(2, '0'),
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
    hasExpired: delta <= 0,
  };
}

export default function ReactGGPromoBanner() {
  const [days, setDays] = useState('--');
  const [hours, setHours] = useState('--');
  const [minutes, setMinutes] = useState('--');
  const [seconds, setSeconds] = useState('--');
  const [isClient, setIsClient] = useState(false);
  const [showBanner, setShowBanner] = useLocalStorage('showBanner', true);

  const hideBanner = !isClient && !showBanner;

  useEffect(() => {
    setIsClient(true);
    let countdownInterval = setInterval(updateCountdown, 1000);

    function updateCountdown() {
      const { days, hours, minutes, seconds, hasExpired } = timeUntilTargetPST(2023, 9, 12);

      if (hasExpired) {
        // Countdown has ended, clear the interval and set all values to 0
        clearInterval(countdownInterval);
        setDays(days);
        setHours(hours);
        setMinutes(minutes);
        setSeconds(seconds);
        return;
      }

      // Uncomment when we move to the other banner
      setDays(days);
      setHours(hours);
      setMinutes(minutes);
      setSeconds(seconds);
    }

    updateCountdown();

    return () => {
      clearInterval(countdownInterval);
    };
  }, []);

  if (showBanner && isClient) {
    return (
      <section className="container">
        <div className={styles.banner}>
          <header>
            <img width={400} src="/images/react-gg-logo-sticker.svg" alt="React.gg" />
            <h3>Launch Week Sale</h3>
            <CloseButton onClick={() => setShowBanner(false)} />
          </header>
          <div className={styles.countdown}>
            <div className={[styles.number, styles.day].join(' ')}>
              <span className={styles['time']}>{days}</span>
              <span className={styles['unit']}>days</span>
            </div>
            <div className={[styles.number, styles.hour].join(' ')}>
              <span className={styles['time']}>{hours}</span>
              <span className={styles['unit']}>hours</span>
            </div>
            <div className={[styles.number, styles.minute].join(' ')}>
              <span className={styles['time']}>{minutes}</span>
              <span className={styles['unit']}>minutes</span>
            </div>
            <div className={[styles.number, styles.second].join(' ')}>
              <span className={styles['time']}>{seconds}</span>
              <span className={styles['unit']}>seconds</span>
            </div>
          </div>
          <footer>
            <p>
              Get up to <strong>25% off</strong>
              <sup>1</sup> our <a href="https://react.gg">react.gg course</a>, if you buy before this giant clock goes to zero <sup>2,3</sup>.
            </p>
            <div className={styles.group}>
              <a className={styles.button} href="https://react.gg#register">
                Get the course
              </a>
            </div>
            <ol className={styles['footnotes']}>
              <li>Literally the cheapest this course will ever be</li>
              <li>Is this how you support NPM Trends? Yes</li>
              <li>Are you guilt tripping me? Obviously yes</li>
            </ol>
          </footer>
        </div>
      </section>
    );
  }
  return null;
}
