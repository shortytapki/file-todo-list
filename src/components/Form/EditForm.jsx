import styles from './Form.module.css';
import { generateHash } from '../../utils/generateHash';
import { Timestamp } from 'firebase/firestore';
import { Button } from '../Button';
import { useState } from 'react';
import { updateTask } from '../../utils/tasksUtils';

/**
 * Функция возвращает форму для редактирования содержания задачи
 * с заполненными полями и ссылками на прикреплённые файлы
 * @param {Object} props
 * @param {string} props.id
 * @param {string[]} props.urls
 * @param {string} props.initName
 * @param {string} props.initDescription
 * @param {string} props.initEndsAt
 * @param {string[]} props.loadedFileRefs
 * @returns
 */
export const EditForm = ({
  id,
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
    const newFiles = Array.from(fileInput.files);
    const newFileRefs = newFiles.map(
      (file) => `${id}/${generateHash() + '-' + file.name}`
    );
    const updateParams = {
      name: name,
      description: description,
      endsAt: Timestamp.fromDate(new Date(endsAt)),
    };
    const removingFileRefs = Array.from(
      e.target.querySelectorAll('input[type="checkbox"]')
    )
      .filter((input) => input.checked)
      .map((input) => input.value);
    setUpload(true);
    await updateTask(id, updateParams, removingFileRefs, newFiles, newFileRefs);
    window.location.reload();
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
                <a href={url}>{loadedFileRefs.at(idx).split('/').at(1)}</a>
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
