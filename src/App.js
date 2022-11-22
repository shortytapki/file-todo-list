import { useEffect, useState } from 'react';
import './App.css';
import { Task } from './components/Task';
import { db } from './firebase-config';
import { collection, getDocs } from 'firebase/firestore';
import { Button } from './components/Button';
import { AddForm } from './components/Form';

/**
 *  Фунция App является входной точкой в работу приложения
 *
 */

function App() {
  const [data, setData] = useState(null);

  const [editorIsOpen, setEditorIsOpen] = useState(false);

  /**
   * Переключает состояние формы добавления задачи -> открыта/закрыта
   * @returns {void}
   */
  const toggleFormView = () => setEditorIsOpen((prev) => !prev);

  useEffect(() => {
    /**
     * Функция получает данные о задачах и устанавливает их с помощью функции setData()
     * @returns {Promise}
     */
    const getData = async () => {
      const querySnapshot = await getDocs(collection(db, 'tasks'));
      let docs = [];
      querySnapshot.forEach((doc) => {
        docs.push({ ...doc.data(), id: doc.id });
      });
      setData(docs);
    };
    getData();
  }, []);

  return (
    <main className="app">
      <header className="header">
        <h1>ToDo List</h1>
        <Button handler={toggleFormView} colorType="edit">
          Добавить задачу
        </Button>
      </header>
      {editorIsOpen && <AddForm />}
      <ul className="tasks">
        {data && data.map((taskObj, idx) => <Task key={idx} {...taskObj} />)}
      </ul>
    </main>
  );
}

export default App;
