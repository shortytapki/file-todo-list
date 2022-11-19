import styles from './Task.module.css';

export const Task = ({ name, description, endsAt }) => {
  return (
    <div className={styles.task}>
      <h2>{name}</h2>
      <span>{new Date(endsAt.seconds * 1000).toLocaleString()}</span>
      <p>{description}</p>
    </div>
  );
};
