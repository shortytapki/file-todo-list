import styles from './Button.module.css';

export const Button = ({ children, colorType, handler, type }) => {
  const colorTypes = {
    edit: styles.edit,
    markAsCompleted: styles.complete,
    remove: styles.remove,
  };
  return (
    <button
      className={`${styles.button} ${colorTypes[colorType]} ${
        type ? styles.add : ''
      }`}
      onClick={handler}
      type={type && 'submit'}
    >
      {children}
    </button>
  );
};
