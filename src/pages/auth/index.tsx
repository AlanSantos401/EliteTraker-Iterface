import styles from './styles.module.css'
import { useSearchParams } from 'react-router-dom'
import { useEffect } from 'react';
import { useUser } from '../../hooks/use-use';


export function Auth() {
     const [searchParams] = useSearchParams();
     const {userData, getUserInfo} = useUser();

    useEffect(() => {
        getUserInfo(String(searchParams.get('code')))

    }, [])

    return (
        <div className={styles.container}>
            <h1>Loading...</h1>
            <p>{JSON.stringify(userData)}</p>
        </div>
    )

}