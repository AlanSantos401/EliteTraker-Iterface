import { Link } from "react-router-dom";
import style from "./styles.module.css";
import { ListCheck, LogOut } from "lucide-react";
import { useUser } from "../../hooks/use-user";

export function Sidebar() {
	const { userData } = useUser();

	return (
		<div className={style.container}>
			<img src={userData.avatarURL} alt={userData.name} />
			<div className={style.links}>
				<Link to="/">
					<ListCheck />
				</Link>
			</div>
			<LogOut className={style.logout} />
		</div>
	);
}
