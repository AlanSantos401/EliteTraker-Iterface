import { Link, useNavigate } from "react-router-dom";
import style from "./styles.module.css";
import { ListCheck, LogOut } from "lucide-react";
import { useUser } from "../../hooks/use-user";

export function Sidebar() {
	const { userData, logout } = useUser();
	const navigate = useNavigate()

	function handleLogout() {
		logout();

		navigate("/entrar");
	}

	return (
		<div className={style.container}>
			<img src={userData.avatarURL} alt={userData.name} />
			<div className={style.links}>
				<Link to="/">
					<ListCheck />
				</Link>
			</div>
			<LogOut onClick={handleLogout} className={style.logout} />
		</div>
	);
}
