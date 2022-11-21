import styles from './Task.module.css';
import { Button } from '../Button';
import { doc, deleteDoc } from 'firebase/firestore';
import { ref, getDownloadURL, getStorage } from 'firebase/storage';
import { app, db } from '../../firebase-config';
import { useEffect, useState } from 'react';

export const Task = ({ name, description, endsAt, id, files }) => {
  const [isDeleted, setIsDeleted] = useState(false);
  const [urls, setUrls] = useState([]);

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

  console.log(urls);
  const removeHandler = async () => {
    setIsDeleted(true);
    await deleteDoc(doc(db, 'tasks', id));
  };

  return (
    <>
      {!isDeleted && (
        <div className={`${styles.task} card`}>
          <header className={styles.header}>
            <h2>{name}</h2>
            <span>
              выполнить до{' '}
              {new Date(endsAt.seconds * 1000).toLocaleString().slice(0, -3)}
            </span>
          </header>
          <p className={styles.description}>{description}</p>
          <ul>
            {urls.map((url, idx) => (
              <a href={url} key={idx} className={styles.link}>
                {files.at(idx)}
              </a>
            ))}
          </ul>
          <div className={styles.buttons}>
            <Button>Редактировать</Button>
            <Button remove={true} handler={removeHandler}>
              Удалить
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
