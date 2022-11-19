import { useEffect, useState } from 'react';
import './App.css';
import { Task } from './components/Task';
import { db } from './firebase-config';
import { collection, getDocs } from 'firebase/firestore';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const querySnapshot = await getDocs(collection(db, 'tasks'));

      let docs = [];
      querySnapshot.forEach((doc) => {
        docs.push(doc.data());
      });
      setData(docs);
    };
    getData();
  }, []);
  return (
    <main className="app">
      <h1>ToDo List</h1>
      <ul className="tasks">
        {data.length !== 0 &&
          data.map((taskObj, idx) => <Task key={idx} {...taskObj} />)}
      </ul>
    </main>
  );
}

export default App;
