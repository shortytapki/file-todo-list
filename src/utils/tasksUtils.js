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
