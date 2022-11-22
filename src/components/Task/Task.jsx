import styles from './Task.module.css';
import { Button } from '../Button';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { ref, getDownloadURL, getStorage } from 'firebase/storage';
import { app, db } from '../../firebase-config';
import { useEffect, useState } from 'react';
import { deleteFiles } from '../../utils/tasksUtils';
import { EditForm } from '../Form';

export const Task = ({
  name,
  description,
  endsAt,
  id,
  fileRefs,
  isCompleted,
}) => {
  const [isDeleted, setIsDeleted] = useState(false);
  const [urls, setUrls] = useState([]);
  const [completed, setCompleted] = useState(isCompleted);
  const [editorIsOpen, setEdtiorIsOpen] = useState();
  const expTimeStamp = new Date().getTime();
  const endsAtTimestamp = endsAt.seconds * 1000;

  useEffect(() => {
    if (!fileRefs.length) return;
    const getFilesURLs = async () => {
      let urls = [];
      for (const fileRef of fileRefs) {
        const fileURL = await getDownloadURL(ref(getStorage(app), fileRef));
        urls.push(fileURL);
      }
      setUrls(urls);
    };
    getFilesURLs();
  }, []);

  const removeHandler = async () => {
    setIsDeleted(true);
    await deleteDoc(doc(db, 'tasks', id));
    await deleteFiles(fileRefs);
  };

  const completeHandler = async () => {
    setCompleted(!isCompleted);
    await updateDoc(doc(db, 'tasks', id), { isCompleted: !completed });
  };
  const editHandler = () => setEdtiorIsOpen((prev) => !prev);

  return (
    <>
      {editorIsOpen && (
        <>
          <EditForm
            {...{
              urls,
              id,
              initName: name,
              initDescription: description,
              initEndsAt: new Date(endsAtTimestamp).toISOString().slice(0, -8),
              loadedFileRefs: fileRefs,
            }}
          />
          <Button handler={editHandler} colorType="edit">
            Закрыть форму
          </Button>
        </>
      )}
      {!isDeleted && !editorIsOpen && (
        <div
          className={`${styles.task} card ${
            endsAtTimestamp < expTimeStamp ? styles.expired : ''
          } ${completed ? styles.completed : ''}`}
        >
          <header className={styles.header}>
            <h2>{name}</h2>
            <span>
              выполнить до{' '}
              {new Date(endsAtTimestamp).toLocaleString().slice(0, -3)}
            </span>
          </header>
          <p className={styles.description}>{description}</p>
          {urls.length ? (
            <p className={styles.files}>Прикреплённые файлы:</p>
          ) : (
            ''
          )}
          <ul className="links">
            {urls.length
              ? urls.map((url, idx) => (
                  <li key={idx}>
                    <a href={url}>{fileRefs.at(idx).split('/').at(1)}</a>
                  </li>
                ))
              : ''}
          </ul>
          <div className={styles.buttons}>
            <Button handler={editHandler} colorType="edit">
              Редактировать
            </Button>
            <Button handler={completeHandler} colorType="markAsCompleted">
              {completed ? 'Вернуть в активные' : 'Отметить как выполненную'}
            </Button>
            <Button handler={removeHandler} colorType="remove">
              Удалить
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
