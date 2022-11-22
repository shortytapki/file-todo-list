import styles from './Button.module.css';
/**
 * @param {Object} props
 * @param {any} props.children
 * @param {string} props.colorType
 * @param {Function} props.handler
 * @param {string} props.type
 */
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
      type={type}
    >
      {children}
    </button>
  );
};
