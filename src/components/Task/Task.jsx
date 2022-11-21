import styles from './Task.module.css';
import { Button } from '../Button';
import { doc, deleteDoc } from 'firebase/firestore';
import {
  ref,
  getDownloadURL,
  getStorage,
  deleteObject,
} from 'firebase/storage';
import { app, db } from '../../firebase-config';
import { useEffect, useState } from 'react';

export const Task = ({ name, description, endsAt, id, files }) => {
  const [isDeleted, setIsDeleted] = useState(false);
  const [urls, setUrls] = useState([]);
  const expTimeStamp = new Date().getTime();
  const endsAtTimestamp = endsAt.seconds * 1000;

  useEffect(() => {
    if (files.length === 0) return;
    const getFilesURLs = async () => {
      let urls = [];
      for (const url of files) {
        const fileURL = await getDownloadURL(ref(getStorage(app), url));
        urls.push(fileURL);
      }
      setUrls(urls);
    };
    getFilesURLs();
  }, []);

  const removeHandler = async () => {
    setIsDeleted(true);
    await deleteDoc(doc(db, 'tasks', id));
    for (const file of files) await deleteObject(ref(getStorage(app), file));
  };

  return (
    <>
      {!isDeleted && (
        <div
          className={`${styles.task} card ${
            endsAtTimestamp < expTimeStamp ? styles.expired : ''
          }`}
        >
          <header className={styles.header}>
            <h2>{name}</h2>
            <span>
              выполнить до{' '}
              {new Date(endsAtTimestamp).toLocaleString().slice(0, -3)}
            </span>
          </header>
          <p className={styles.description}>{description}</p>
          <p className={styles.files}>Прикреплённые файлы</p>
          <ul className={styles.links}>
            {urls.map((url, idx) => (
              <li key={idx}>
                <a href={url} className={styles.link}>
                  {files.at(idx)}
                </a>
              </li>
            ))}
          </ul>
          <div className={styles.buttons}>
            <Button colorType="edit">Редактировать</Button>
            <Button handler={() => {}} colorType="markAsCompleted">
              Отметить как выполненную
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
