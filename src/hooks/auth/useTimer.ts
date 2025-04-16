import { useEffect, useRef, useState } from "react";

export default function useTimer(start?: number) {
	const [countDown, setCountDown] = useState(start || 120);

	const intervalRef = useRef<number | null>(null);
	const timer = () => setCountDown(countDownDate => countDownDate - 1);
	const handleTimerStart = () => {
		setCountDown(120);
		intervalRef.current = setInterval(timer, 1000) as unknown as number;
	};

	const resetInterval = () => {
		if (intervalRef) {
			intervalRef.current && clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
	};

	useEffect(() => {
		if (countDown < 1) {
			resetInterval();
		}
	}, [countDown]);
	useEffect(() => {
		return resetInterval;
	}, []);

	const seconds = `0${Math.floor(countDown % 60)}`.slice(-2);
	const minutes = `0${Math.floor(countDown / 60)}`.slice(-2);

	return { minutes, seconds, time: countDown, handleTimerStart };
}
