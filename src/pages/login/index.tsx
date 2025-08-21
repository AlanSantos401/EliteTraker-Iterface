import { Github } from "lucide-react";
import styles from "./styles.module.css";
import { Button } from "../../components/button";
import { useNavigate } from "react-router-dom";

export function Login() {
	const navigate = useNavigate();
	return (
		<div className={styles.container}>
			<div className={styles.content}>
				<h1>Entre com</h1>
				<Button onClick={() => {
					navigate('/');
				}}>
					<Github />
					GitHub
				</Button>
				<p> Ao entrar, eu concordo com os Termos de Serviço e Política de Privacidade.</p>
			</div>
		</div>
	);
}
