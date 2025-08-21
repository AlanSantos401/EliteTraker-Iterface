import { Send, Trash2 } from "lucide-react";
import styles from "./styles.module.css";
import { Sidebar } from "../../components/sidebar";

export function Habits() {
	return (
		<div className={styles.app}>
			<Sidebar />
			<div className={styles.container}>
				<div className={styles.content}>
					<header>
						<h1>Hábitos Diários</h1>
						<span>Hoje, 21 de Agosto</span>
					</header>
					<div className={styles.input}>
						<input placeholder="Digite aqui um novo hábito" type="text" />
						<Send />
					</div>
					<div className={styles.habits}>
						{Array(6)
							.fill(1)
							.map((_, index) => (
								<div key={index} className={styles.habit}>
									<p>Hábito {index + 1}</p>
									<div>
										<input type="checkbox" />
										<Trash2 />
									</div>
								</div>
							))}
					</div>
				</div>
			</div>
		</div>
	);
}
