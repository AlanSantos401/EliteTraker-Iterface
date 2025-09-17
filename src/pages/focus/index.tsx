import { AlarmClock, X } from "lucide-react";
import { Header } from "../../components/header";
import styles from "./styles.module.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../../components/button";
import { useTimer } from "react-timer-hook";
import dayjs from "dayjs";
import { api } from "../../service/api";
import { Info } from "../../components/info";
import { Calendar } from "@mantine/dates";
import { Indicator } from "@mantine/core";

type Timers = {
	focus: number;
	rest: number;
};

type FocusMetrics = {
	_id: [number, number, number];
	count: number;
};

type FocusTime = {
	_id: string;
	timeFrom: string;
	timeTo: string;
	userId: string;
	createdAt: string;
	updatedAt: string;
};

enum TimersState {
	PAUSED = "PAUSED",
	FOCUS = "FOCUS",
	REST = "REST",
}

const timerStateTitle = {
	[TimersState.PAUSED]: "Pausado",
	[TimersState.FOCUS]: "Em foco",
	[TimersState.REST]: "Em descanso",
};

export function Focus() {
	const focusInpt = useRef<HTMLInputElement>(null);
	const restInput = useRef<HTMLInputElement>(null);
	const [timers, setTimers] = useState<Timers>({ focus: 0, rest: 0 });
	const [timerState, setTimerState] = useState<TimersState>(TimersState.PAUSED);
	const [timeFrom, setTimeFrom] = useState<Date | null>(null);
	const [focusMetrics, setFocusMetrics] = useState<FocusMetrics[]>([]);
	const [focusTimes, setFocusTimes] = useState<FocusTime[]>([]);
	const [currentDate, setCurrentDate] = useState<dayjs.Dayjs>(dayjs().startOf("day"));
	const [currentMonth, setCurrentMonth] = useState<dayjs.Dayjs>(dayjs().startOf("month"));

	function addSeconds(date: Date, seconds: number) {
		const time = dayjs(date).add(seconds, "second");

		return time.toDate();
	}

	function handleStart() {
		restTimers.pause();

		const now = new Date();

		focusTimers.restart(addSeconds(now, timers.focus * 60));

		setTimeFrom(now);
	}

	async function handleEnd() {
		focusTimers.pause();

		await api.post("/focus-time", {
			timeFrom: timeFrom?.toISOString(),
			timeTo: new Date().toISOString(),
		});

		setTimeFrom(null);
	}

	const focusTimers = useTimer({
		expiryTimestamp: new Date(),
		async onExpire() {
			if (timerState === TimersState.PAUSED) {
				await handleEnd();
			}
		},
	});

	const restTimers = useTimer({
		expiryTimestamp: new Date(),
	});

	function handleAddMinutes(type: "focus" | "rest") {
		if (type === "focus") {
			const currentValue = Number(focusInpt.current?.value);

			if (focusInpt.current) {
				const value = currentValue + 5;
				focusInpt.current.value = String(value);

				setTimers((old) => ({
					...old,
					focus: value,
				}));
			}

			return;
		}

		const currentValue = Number(restInput.current?.value);

		if (restInput.current) {
			const value = currentValue + 5;
			restInput.current.value = String(value);

			setTimers((old) => ({
				...old,
				rest: value,
			}));
		}
	}

	function handleCancel() {
		setTimers({
			focus: 0,
			rest: 0,
		});

		setTimerState(TimersState.PAUSED);

		if (focusInpt.current) {
			focusInpt.current.value = "";
		}

		if (restInput.current) {
			restInput.current.value = "";
		}
	}

	function handleFocus() {
		if (timers.focus <= 0 || timers.rest <= 0) {
			return;
		}

		handleStart();

		setTimerState(TimersState.FOCUS);
	}

	async function handleRest() {
		await handleEnd();

		const now = new Date();

		restTimers.restart(addSeconds(now, timers.rest * 60));

		setTimerState(TimersState.REST);
	}

	const metricsInfoByDay = useMemo(() => {
		const timesMetrics = focusTimes.map((item) => ({
			timeFrom: dayjs(item.timeFrom),
			timeTo: dayjs(item.timeTo),
		}));

		let totalTimeInMinutes = 0;

		if (timesMetrics.length) {
			for (const { timeFrom, timeTo } of timesMetrics) {
				const diff = timeTo.diff(timeFrom, "minutes");

				totalTimeInMinutes += diff;
			}
		}

		return {
			timesMetrics,
			totalTimeInMinutes,
		};
	}, [focusTimes]);

	const metricsInfoByMonth = useMemo(() => {
		const completedDates: String[] = [];
		let couter: number = 0;

		if (focusMetrics.length) {
			focusMetrics.forEach((item) => {
				const date = dayjs(`${item._id[0]}-${item._id[1]}-${item._id[2]}`)
					.startOf("day")
					.toISOString();

				completedDates.push(date);
				couter += item.count;
			});
		}

		return { completedDates, couter };
	}, [focusMetrics]);

	function handleResume() {
		handleStart();

		setTimerState(TimersState.FOCUS);
	}

	async function loadFocusMetrics(currentMonth: string) {
		const { data } = await api.get<FocusMetrics[]>("/focus-time/metrics", {
			params: {
				date: currentMonth,
			},
		});

		setFocusMetrics(data);
	}

	async function loadFocusTimes(currentDate: string) {
		const { data } = await api.get<FocusTime[]>("/focus-time", {
			params: {
				date: currentDate,
			},
		});

		setFocusTimes(data);
	}

	async function handleSelectMonth(date: Date) {
		setCurrentMonth(dayjs(date));
	}

	async function handleSelectDate(date: Date) {
		setCurrentDate(dayjs(date));
	}

	useEffect(() => {
		loadFocusMetrics(currentMonth.toISOString());
	}, [currentMonth]);

	useEffect(() => {
		loadFocusTimes(currentDate.toISOString());
	}, [currentDate]);

	return (
		<div className={styles.container}>
			<div className={styles.content}>
				<Header title="Tempo de Foco" />
				<div className={styles["input-group"]}>
					<div className={styles.input}>
						<X onClick={() => handleAddMinutes("focus")} />
						<input ref={focusInpt} placeholder="Tempo de foco" type="number" disabled />
					</div>

					<div className={styles.input}>
						<X onClick={() => handleAddMinutes("rest")} />
						<input ref={restInput} placeholder="Tempo de descanso" type="number" disabled />
					</div>
				</div>

				<div className={styles.timer}>
					<svg className={styles.circle} width="364" height="364" viewBox="0 0 364 364">
						{/* círculo de fundo */}
						<circle cx="182" cy="182" r="170" stroke="white" strokeWidth="6" fill="none" />
						{/* círculo animado */}
						<circle
							cx="182"
							cy="182"
							r="170"
							stroke="blue"
							strokeWidth="6"
							fill="none"
							strokeDasharray={2 * Math.PI * 170}
							strokeDashoffset={
								timerState === TimersState.FOCUS
									? ((focusTimers.totalSeconds ?? 0) / (timers.focus * 60)) * (2 * Math.PI * 170)
									: timerState === TimersState.REST
										? ((restTimers.totalSeconds ?? 0) / (timers.rest * 60)) * (2 * Math.PI * 170)
										: 0
							}
							strokeLinecap="round"
							transform="rotate(-90 182 182)"
						/>

						<foreignObject x="0" y="0" width="100%" height="100%">
							<div xmlns="http://www.w3.org/1999/xhtml" className={styles["timer-content"]}>
								{timerState === TimersState.PAUSED && (
									<span>{`${String(timers.focus).padStart(2, "0")}:00`}</span>
								)}
								{timerState === TimersState.FOCUS && (
									<span>{`${String(focusTimers.minutes).padStart(2, "0")}:${String(focusTimers.seconds).padStart(2, "0")}`}</span>
								)}
								{timerState === TimersState.REST && (
									<span>{`${String(restTimers.minutes).padStart(2, "0")}:${String(restTimers.seconds).padStart(2, "0")}`}</span>
								)}
								<strong>{timerStateTitle[timerState]}</strong>
							</div>
						</foreignObject>
					</svg>
				</div>

				<div className={styles["button-group"]}>
					{timerState === TimersState.PAUSED && (
						<Button onClick={handleFocus} disabled={timers.focus <= 0 || timers.rest <= 0}>
							Começar
						</Button>
					)}

					{timerState === TimersState.FOCUS && (
						<Button onClick={handleRest}>Iniciar Descanso</Button>
					)}

					{timerState === TimersState.REST && <Button onClick={handleResume}>Retomar</Button>}

					<Button onClick={handleCancel} variant="error">
						Cancelar
					</Button>
				</div>
			</div>
			<div className={styles.metrics}>
				<h2>Estatísticas</h2>

				<div className={styles["info-container"]}>
					<Info value={String(metricsInfoByMonth.couter)} label="Ciclos totais" />
					<Info
						value={`${metricsInfoByDay.totalTimeInMinutes} minutes`}
						label="Tempo total de foco"
					/>
				</div>
				<div className={styles["calendar-container"]}>
					{currentDate && (
						<div className={styles['focus-info']}>
							<h3>{dayjs(currentDate).format("D [de] MMMM")}</h3>
							{focusTimes.slice(0, 3).map((item, idx) => {
								const start = dayjs(item.timeFrom);
								const end = dayjs(item.timeTo);
								const duration = end.diff(start, "minutes");

								return (
									<div key={idx} className={styles['focus-item']}>
										<span>
											<AlarmClock />{start.format("HH:mm")} - {end.format("HH:mm")}
										</span>
										<span>{duration} minutos</span>
									</div>
								);
							})}
						</div>
					)}

					<Calendar
						getDayProps={(date) => ({
							selected: dayjs(date).isSame(currentDate),
							onClick: async () => await handleSelectDate(new Date(date)),
						})}
						locale="pt-br"
						onMonthSelect={handleSelectMonth}
						onNextMonth={handleSelectMonth}
						onPreviousMonth={handleSelectMonth}
						renderDay={(date) => {
							const day = dayjs(date).date();
							const isSameDate = metricsInfoByMonth.completedDates?.some((item) =>
								dayjs(item.toString()).isSame(dayjs(date)),
							);
							return (
								<Indicator size={8} color="var(--info)" offset={-2} disabled={!isSameDate}>
									<div>{day}</div>
								</Indicator>
							);
						}}
					/>
				</div>
			</div>
		</div>
	);
}
