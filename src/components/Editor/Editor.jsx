import styles from './Editor.module.css';
import { generateHash } from '../../utils/generateHash';
import { addDoc, Timestamp, collection } from 'firebase/firestore';
import { ref, uploadBytes, getStorage } from 'firebase/storage';
import { db, app } from '../../firebase-config';
import { Button } from '../Button';
import { useState } from 'react';

export const Editor = ({ taskData }) => {
  const [upload, setUpload] = useState(false);
  const submitHandler = async (e) => {
    e.preventDefault();
    const storage = getStorage(app);

    const [nameInpit, timeInput, descriptionInput, fileInput] = e.target;
    const name = nameInpit.value;
    const description = descriptionInput.value;
    const endsAt = timeInput.value;
    const files = Array.from(fileInput.files);

    const fileRefs = files.map((_) => `${name}/${generateHash()}`);
    setUpload(true);
    await addDoc(collection(db, 'tasks'), {
      name: name,
      description: description,
      endsAt: Timestamp.fromDate(new Date(endsAt)),
      files: fileRefs,
    });
    for (let idx = 0; idx < files.length; idx++) {
      await uploadBytes(ref(storage, fileRefs.at(idx)), files.at(idx));
    }
    window.location.reload();
  };

  return (
    <>
      {upload && <p>Добавляем задачу...</p>}
      {!upload && (
        <form className={`${styles.form} card`} onSubmit={submitHandler}>
          <div className={`${styles.group} taskname`}>
            <label>Задача</label>
            <input type="text" />
          </div>
          <div>
            <label>Срок выполнения</label>
            <input type="datetime-local" />
          </div>
          <div className={styles.group}>
            <label>Описание</label>
            <textarea rows="3"></textarea>
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
