import styles from './Form.module.css';
import { generateHash } from '../../utils/generateHash';

import { Button } from '../Button';
import { useState } from 'react';
import { createTask, loadFiles } from '../../utils/tasksUtils';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase-config';

/**
 * Функция возвращает форму добавления задачи
 */
export const AddForm = () => {
  const [upload, setUpload] = useState(false);
  const submitHandler = async (e) => {
    e.preventDefault();
    const [nameInput, timeInput, descriptionInput, fileInput] = e.target;
    const name = nameInput.value;
    const description = descriptionInput.value;
    const endsAt = timeInput.value;
    const files = Array.from(fileInput.files);
    setUpload(true);
    const id = createTask({ name, description, endsAt });
    const fileRefs = files.map(
      (file) => `${id}/${generateHash() + '-' + file.name}`
    );
    await updateDoc(doc(db, 'tasks', id), { fileRefs: fileRefs });
    await loadFiles(files, fileRefs);
    window.location.reload();
  };

  return (
    <>
      {upload && <p>Работаем с файлами...</p>}
      {!upload && (
        <form className={`${styles.form} card`} onSubmit={submitHandler}>
          <div className={`${styles.group} taskname`}>
            <label>Задача</label>
            <input type="text" required />
          </div>
          <div className={styles.group}>
            <label>Срок выполнения</label>
            <input type="datetime-local" required />
          </div>
          <div className={styles.group}>
            <label>Описание</label>
            <textarea rows="3" required></textarea>
          </div>
          <div className={styles.group}>
            <label>Файлы</label>
            <input type="file" multiple />
          </div>
          <Button type="submit">Добавить</Button>
        </form>
      )}
    </>
  );
};
