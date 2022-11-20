import styles from './Task.module.css';
import { Button } from '../Button';

export const Task = ({ name, description, endsAt }) => {
  return (
    <div className={`${styles.task} card`}>
      <h2>{name}</h2>
      <span>{new Date(endsAt.seconds * 1000).toLocaleString()}</span>
      <p>{description}</p>
      <div>
        <Button>Редактировать</Button>
        <Button remove={true}>Удалить</Button>
      </div>
    </div>
  );
};
