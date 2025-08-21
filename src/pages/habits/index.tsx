import { Send, Trash2 } from "lucide-react";
import styles from "./styles.module.css";

export function Habits() {
	return (
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
				<div className={styles.habit}>
					<p>estudar espanhol</p>
					<div>
						<input type="checkbox" />
						<Trash2 />
					</div>
				</div>
			</div>
		</div>
	);
}
