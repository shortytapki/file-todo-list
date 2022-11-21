import { deleteObject, getStorage, ref, uploadBytes } from 'firebase/storage';
import {
  addDoc,
  Timestamp,
  collection,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { app, db } from '../firebase-config';
import { generateHash } from './generateHash';

export const loadFiles = async (files, fileRefs) => {
  for (let idx = 0; idx < files.length; idx++) {
    await uploadBytes(ref(getStorage(app), fileRefs.at(idx)), files.at(idx));
  }
};

export const deleteFiles = async (fileRefs) => {
  for (const fileRef of fileRefs) {
    const deleteRef = ref(getStorage(app), fileRef);
    await deleteObject(deleteRef);
  }
};

export const updateTask = async (
  id,
  updateParams,
  filesToRemove = [],
  filesToAdd = []
) => {
  if (!filesToAdd.length)
    await loadFiles(
      filesToAdd,
      filesToAdd.map((_) => `${updateParams.name}/${generateHash()}`)
    );
  // if (!filesToRemove.length) await deleteFiles(filesToRemove);
  // await updateDoc(doc(db, 'tasks', id), updateParams);
};

export const createTask = async ({ name, description, endsAt }) => {
  const res = await addDoc(collection(db, 'tasks'), {
    name: name,
    description: description,
    endsAt: Timestamp.fromDate(new Date(endsAt)),
    fileRefs: [],
  });
  return res.id;
};
