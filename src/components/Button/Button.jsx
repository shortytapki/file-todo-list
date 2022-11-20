import styles from './Button.module.css';

export const Button = ({ children, remove, handler, type }) => {
  return (
    <button
      className={`${styles.button} ${remove ? styles.remove : ''} ${
        type ? styles.add : ''
      }`}
      onClick={handler}
      type={type && 'submit'}
    >
      {children}
    </button>
  );
};
