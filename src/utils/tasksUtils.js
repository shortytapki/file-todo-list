import { deleteObject, getStorage, ref, uploadBytes } from 'firebase/storage';
import {
  addDoc,
  Timestamp,
  collection,
  updateDoc,
  doc,
  getDoc,
} from 'firebase/firestore';
import { app, db } from '../firebase-config';

/**
 * Функция загружает файлы переданные файлы в хранилище и добавляет ссылки на них в документ задачи
 * @param {Array} files
 * @param {Array} fileRefs
 * @returns {Promise}
 */
export const loadFiles = async (files, fileRefs) => {
  for (let idx = 0; idx < files.length; idx++) {
    await uploadBytes(ref(getStorage(app), fileRefs.at(idx)), files.at(idx));
  }
};
/**
 * Функция удаляет файлы по принятым путям
 * @param {Array} fileRefs
 * @returns {Promise}
 */
export const deleteFiles = async (fileRefs) => {
  for (const fileRef of fileRefs) {
    const deleteRef = ref(getStorage(app), fileRef);
    await deleteObject(deleteRef);
  }
};
/**
 * Функция обновляет задачу с переданным id в соответствии с переданными парметрами
 * @param {string} id
 * @param {Array} updateParams
 * @param {Array} removingFileRefs
 * @param {Array} newFiles
 * @param {Array} newFileRefs
 * @returns {Promise}
 */
export const updateTask = async (
  id,
  updateParams,
  removingFileRefs,
  newFiles,
  newFileRefs
) => {
  if (removingFileRefs.length) {
    await deleteFiles(removingFileRefs);
    const docSnap = await getDoc(doc(db, 'tasks', id));
    const fileRefs = docSnap.data().fileRefs;
    await updateDoc(doc(db, 'tasks', id), {
      fileRefs: fileRefs.filter((ref) => !removingFileRefs.includes(ref)),
    });
  }

  if (newFileRefs.length) {
    await loadFiles(newFiles, newFileRefs);
    const docSnap = await getDoc(doc(db, 'tasks', id));
    const fileRefs = docSnap.data().fileRefs;
    await updateDoc(doc(db, 'tasks', id), {
      fileRefs: fileRefs.concat(newFileRefs),
    });
  }
  await updateDoc(doc(db, 'tasks', id), updateParams);
};
/**
 * Функция создаёт задачу в соответствии с переданными параметрами и возвращает её сгенерероывнный id
 * @param {Object} object
 * @param {string} object.name
 * @param {string} object.description
 * @param {string} object.endsAt
 * @returns {string}
 */
export const createTask = async ({ name, description, endsAt }) => {
  const res = await addDoc(collection(db, 'tasks'), {
    name: name,
    description: description,
    endsAt: Timestamp.fromDate(new Date(endsAt)),
    isCompleted: false,
    fileRefs: [],
  });
  return res.id;
};
