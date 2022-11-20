import styles from './Editor.module.css';
import { generateHash } from '../../utils/generateHash';
import { storage } from '../../firebase-config';
import { ref, uploadBytes } from 'firebase/storage';
import { Button } from '../Button';

export const Editor = ({ taskData }) => {
  const submitHandler = (e) => {
    const files = e.target[2].files;
    console.log(files);
    e.preventDefault();
    // const fileRef = ref(
    //   storage,
    //   `userfiles/${generateHash() + '-' + file.name}`
    // );
    // uploadBytes(fileRef, file).then(() => console.log('Loaded'));
  };
  return (
    <form className={`${styles.form} card`} onSubmit={submitHandler}>
      <div className={`${styles.group} taskname`}>
        <label>Задача</label>
        <input type="text" />
      </div>
      <div className={styles.group}>
        <label>Описание</label>
        <textarea rows="10"></textarea>
      </div>
      <div className={styles.group}>
        <label>Файлы</label>
        <input type="file" multiple />
      </div>
      <Button type="submit">Добавить</Button>
    </form>
  );
};
