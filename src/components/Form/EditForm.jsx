import styles from './Form.module.css';
import { generateHash } from '../../utils/generateHash';
import { db } from '../../firebase-config';
import { doc } from 'firebase/firestore';
import { Button } from '../Button';
import { useState } from 'react';
import { deleteFiles } from '../../utils/tasksUtils';
import { updateDoc } from 'firebase/firestore';

export const EditForm = ({
  id,
  urls,
  initName,
  initDescription,
  initEndsAt,
  loadedFileRefs,
  files,
}) => {
  const [upload, setUpload] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    const removingFileRefs = Array.from(
      e.target.querySelectorAll('input[type="checkbox"]')
    )
      .filter((input) => input.checked)
      .map((input) => input.value);

    if (removingFileRefs.length) {
      await deleteFiles(removingFileRefs);
      await updateDoc(doc(db, 'tasks', id), {
        fileRefs: loadedFileRefs.filter(
          (ref) => !removingFileRefs.includes(ref)
        ),
      });
    }

    window.location.reload();
    // const [nameInput, timeInput, descriptionInput, fileInput] = e.target;
    // const name = nameInput.value;
    // const description = descriptionInput.value;
    // const endsAt = timeInput.value;
    // const newFiles = Array.from(fileInput.files);
    // const newFileRefs = newFiles.map((_) => `${name}/${generateHash()}`);
  };

  return (
    <>
      {upload && <p>Работаем с файлами...</p>}
      {!upload && (
        <form className={`${styles.form} card`} onSubmit={submitHandler}>
          <div className={`${styles.group} taskname`}>
            <label>Задача</label>
            <input type="text" required defaultValue={initName} />
          </div>
          <div className={styles.group}>
            <label>Срок выполнения</label>
            <input type="datetime-local" required defaultValue={initEndsAt} />
          </div>
          <div className={styles.group}>
            <label>Описание</label>
            <textarea
              rows="3"
              required
              defaultValue={initDescription}
            ></textarea>
          </div>
          <div className={styles.group}>
            <label>Файлы</label>
            <input type="file" multiple />
          </div>
          <ul className="links">
            {urls.map((url, idx) => (
              <li key={url}>
                <a href={url}>{loadedFileRefs.at(idx)}</a>
                <input type="checkbox" value={loadedFileRefs.at(idx)} />
                <span>Удалить файл</span>
              </li>
            ))}
          </ul>
          <Button type="submit">Обновить</Button>
        </form>
      )}
    </>
  );
};
