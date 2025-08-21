import { Link } from 'react-router-dom'
import style from './styles.module.css'
import { ListCheck, LogOut } from 'lucide-react'

export function Sidebar() {
    return (
        <div className={style.container}>
            <img src="https://avatars.githubusercontent.com/u/196714523?v=4" alt="foto" />
            <div className={style.links}>
                <Link  to='/'><ListCheck /></Link>
            </div>
            <LogOut  className={style.logout}/>
        </div>
    )
}