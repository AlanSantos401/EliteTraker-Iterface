import { Github } from "lucide-react";
import styles from "./styles.module.css";
import { Button } from "../../components/button";
import { api } from "../../service/api";

export function Login() {
	async function handleAuth() {
		const { data } = await api.get("/auth");

		window.location.href = data.redirectURL;
	}

	return (
		<div className={styles.container}>
			<div className={styles.content}>
				<h1>Entre com</h1>
				<Button onClick={handleAuth}>
					<Github />
					GitHub
				</Button>
				<p> Ao entrar, eu concordo com os Termos de Serviço e Política de Privacidade.</p>
			</div>
		</div>
	);
}
