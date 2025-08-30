import { X } from "lucide-react";
import { Header } from "../../components/header";
import styles from "./styles.module.css";
import { useRef } from "react";

export function Focus() {
  const focusInpt = useRef<HTMLInputElement>(null);
  const restInput = useRef<HTMLInputElement>(null);

  function handleAddMinutes(type: 'focus' | 'rest') {
   if(type === 'focus') {
    const currentValue = Number(focusInpt.current?.value);

    if(focusInpt.current) {
       focusInpt.current.value = String(currentValue + 5);
    }

    return;
   }

    const currentValue = Number(restInput.current?.value);

    if(restInput.current) {
       restInput.current.value = String(currentValue + 5);
    }
  } 

	return (
		<div className={styles.container}>
			<div className={styles.content}>
				<Header title="Tempo de Foco" />
				<div className={styles["input-group"]}>
					<div className={styles.input}>
						<X  onClick={() => handleAddMinutes('focus')}/>
						<input ref={focusInpt} placeholder="Tempo de foco" type="number" disabled/>
					</div>

					<div className={styles.input}>
						<X onClick={() => handleAddMinutes('rest')}/>
						<input ref={restInput} placeholder="Tempo de descanso" type="number" disabled/>
					</div>
				</div>
			</div>
		</div>
	);
}
