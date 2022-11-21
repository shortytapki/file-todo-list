import styles from './Form.module.css';
import { generateHash } from '../../utils/generateHash';
import { Button } from '../Button';
import { useState } from 'react';

export const EditForm = ({
  urls,
  initName,
  initDescription,
  initEndsAt,
  loadedFileRefs,
}) => {
  const [upload, setUpload] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    const [nameInput, timeInput, descriptionInput, fileInput] = e.target;
    const name = nameInput.value;
    const description = descriptionInput.value;
    const endsAt = timeInput.value;
    const files = Array.from(fileInput.files);
    const fileRefs = files.map((_) => `${name}/${generateHash()}`);
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
                <input type="checkbox" />
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
