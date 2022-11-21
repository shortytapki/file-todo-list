import { useEffect, useState } from 'react';
import './App.css';
import { Task } from './components/Task';
import { db } from './firebase-config';
import { collection, getDocs } from 'firebase/firestore';
import { Button } from './components/Button';
import { Editor } from './components/Editor';

function App() {
  const [data, setData] = useState([]);
  const [editorIsOpen, setEditorIsOpen] = useState(false);

  const toggleEditorView = () => setEditorIsOpen((prev) => !prev);

  useEffect(() => {
    const getData = async () => {
      const querySnapshot = await getDocs(collection(db, 'tasks'));
      let docs = [];
      querySnapshot.forEach((doc) => {
        docs.push({ ...doc.data(), id: doc.id });
      });
      setData(docs);
      console.log(docs);
    };
    getData();
  }, []);

  return (
    <main className="app">
      <header className="header">
        <h1>ToDo List</h1>
        <Button handler={toggleEditorView}>Добавить задачу</Button>
      </header>
      {editorIsOpen && <Editor />}
      <ul className="tasks">
        {data.length !== 0 &&
          data.map((taskObj, idx) => <Task key={idx} {...taskObj} />)}
      </ul>
    </main>
  );
}

export default App;
