import { Send, Trash2 } from "lucide-react";
import styles from "./styles.module.css";
import { useEffect, useRef, useState } from "react";
import { api } from "../../service/api";
import dayjs from "dayjs";
import { Header } from "../../components/header";
import { Info } from "../../components/info";
import { Calendar } from '@mantine/dates';
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
}

export function Habits() {
	const [habits, setHabits] = useState<Habit[]>([]);
	const [metrics, setMetrics] = useState<HabitMetrics>({}as HabitMetrics);
	const [selectedHabit, setSelectedhabit] = useState <Habit | null>(null);
	const nameInput = useRef<HTMLInputElement>(null);
	const today = dayjs().startOf("day").toISOString();

	async function handleSelectHabit(habit: Habit) {
		setSelectedhabit(habit)
		console.log(habit)
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
	async function handleToglle(id: string) {
		await api.patch(`/habits/${id}/toggle`);

		await loadHabits();
	}
	async function handleRemove(id: string) {
		await api.delete(`/habits/${id}`);

		await loadHabits();
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
						<div key={item._id} className={clsx(styles.habit, item._id === selectedHabit?._id && styles['habit-active'])}>
							<p onClick={() => handleSelectHabit(item)}>{item.name}</p>
							<div>
								<input
									type="checkbox"
									checked={item.completedDates.some((item) => item === today)}
									onChange={() => handleToglle(item._id)}
								/>
								<Trash2 onClick={() => handleRemove(item._id)} />
							</div>
						</div>
					))}
				</div>
			</div>
			<div className={styles.metrics}>
              <h2>Estudar Espanhol</h2>

			  <div className={styles['info-container']}>
				<Info value="23/31" label="Dias concluidos"/>
				<Info value="75%" label="Porcentagens"/>
			  </div>
			  <div className={styles['calendar-container']}>
                <Calendar />
			  </div>
			  
			  
			</div>
		</div>
	);
}
