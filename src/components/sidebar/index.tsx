import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import { History, ListCheck, LogOut } from "lucide-react";
import { useUser } from "../../hooks/use-user";
import clsx from "clsx";

export function Sidebar() {
	const { userData, logout } = useUser();
	const navigate = useNavigate();
	const { pathname } = useLocation();

	function handleLogout() {
		logout();

		navigate("/entrar");
	}

	return (
		<div className={styles.container}>
			<img src={userData.avatarURL} alt={userData.name} />
			<div className={styles.links}>
				<Link to="/">
					<ListCheck className={clsx(pathname === "/" && styles.active)} />
				</Link>
				<Link to="/foco">
					<History className={clsx(pathname === "/foco" && styles.active)} />
				</Link>
			</div>
			<LogOut onClick={handleLogout} className={styles.logout} />
		</div>
	);
}
