import { Send, Trash2 } from "lucide-react";
import styles from "./styles.module.css";
import { useEffect, useRef, useState, useMemo } from "react";
import { api } from "../../service/api";
import dayjs, { Dayjs } from "dayjs";
import { Header } from "../../components/header";
import { Info } from "../../components/info";
import { Calendar } from "@mantine/dates";
import { Indicator } from "@mantine/core";
import clsx from "clsx";

type Habit = {
	_id: string;
	name: string;
	completedDates: string[];
	createdAt: string;
	updatedAt: string;
	userId: string;
};

type HabitMetrics = {
	_id: string;
	name: string;
	completedDates: string[];
};

export function Habits() {
	const [habits, setHabits] = useState<Habit[]>([]);
	const [metrics, setMetrics] = useState<HabitMetrics>({} as HabitMetrics);
	const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
	const nameInput = useRef<HTMLInputElement>(null);
	const today = dayjs().startOf("day");

	const metricsInfo = useMemo(() => {
		const numberOfMonthDays = today.endOf("month").get("date");
		const numberOfDays = metrics?.completedDates ? metrics?.completedDates?.length : 0;

		const completedDatesPerMonth = `${numberOfDays}/${numberOfMonthDays}`;

		const completedMonthPercent = `${Math.round((numberOfDays / numberOfMonthDays) * 100)}%`;

		return {
			completedDatesPerMonth,
			completedMonthPercent,
		};
	}, [metrics, today]);

	async function handleSelectHabit(habit: Habit, currentMonth?: Date) {
		setSelectedHabit(habit);

		const { data } = await api.get<HabitMetrics>(`/habits/${habit._id}/metrics`, {
			params: {
				date: currentMonth ? currentMonth.toISOString() : today.startOf("month").toISOString(),
			},
		});

		setMetrics(data);
	}

	async function handleSubmit() {
		const name = nameInput.current?.value;

		if (name) {
			await api.post("/habits", {
				name,
			});

			if (nameInput.current) {
				nameInput.current.value = "";
			}

			await loadHabits();
		}
	}

	async function handleToglle(habit: Habit) {
		await api.patch(`/habits/${habit._id}/toggle`);

		await loadHabits();
		await handleSelectHabit(habit);
	}

	async function handleRemove(id: string) {
		await api.delete(`/habits/${id}`);

		setMetrics({} as HabitMetrics);
		setSelectedHabit(null);

		await loadHabits();
	}

	async function handleSelectMonth(date: Date) {
		await handleSelectHabit(selectedHabit!, date);
	}

	async function loadHabits() {
		const { data } = await api.get<Habit[]>("/habits");

		setHabits(data);
	}

	useEffect(() => {
		loadHabits();
	}, []);

	return (
		<div className={styles.container}>
			<div className={styles.content}>
				<Header title="Hábitos diários" />
				<div className={styles.input}>
					<input ref={nameInput} placeholder="Digite aqui um novo hábito" type="text" />
					<Send onClick={handleSubmit} />
				</div>

				<div className={styles.habits}>
					{habits.map((item) => (
						<div
							key={item._id}
							className={clsx(
								styles.habit,
								item._id === selectedHabit?._id && styles["habit-active"],
							)}
						>
							<p>
								<button
									type="button"
									onClick={() => handleSelectHabit(item)}
									className="habit-button"
								>
									{item.name}
								</button>
							</p>

							<div>
								<input
									type="checkbox"
									checked={item.completedDates.some((item) => item === today.toISOString())}
									onChange={() => handleToglle(item)}
								/>
								<Trash2 onClick={() => handleRemove(item._id)} />
							</div>
						</div>
					))}
				</div>
			</div>
			{selectedHabit && (
				<div className={styles.metrics}>
					<h2>{selectedHabit.name}</h2>

					<div className={styles["info-container"]}>
						<Info value={metricsInfo.completedDatesPerMonth} label="Dias concluidos" />
						<Info value={metricsInfo.completedMonthPercent} label="Porcentagens" />
					</div>
					<div className={styles["calendar-container"]}>
						<Calendar
						    locale="pt-br"
							style={{ fontSize: '20'}}
							static
							onMonthSelect={handleSelectMonth}
							onNextMonth={handleSelectMonth}
							onPreviousMonth={handleSelectMonth}
							renderDay={(date) => {
								const day = dayjs(date).date();
								const isSameDate = metrics?.completedDates?.some((item) =>
									dayjs(item).isSame(dayjs(date)),
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
			)}
		</div>
	);
}
