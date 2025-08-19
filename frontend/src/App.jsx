import { useState, useEffect } from 'react';
import axios from 'axios'
import './App.css';
import Header from './components/Header';
import TodoEditor from './components/TodoEditor';
import TodoList from './components/TodoList';

function App() {

  const [todos, setTodos] = useState([])
  const API = `${import.meta.env.VITE_API_URL}/api/todos`

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await axios.get(API)
        const data = Array.isArray(res.data) ? res.data : res.data.todos ?? []

        setTodos(data)
        console.log(data)

      } catch (error) {

      }
    }
    fetchTodos()
  }, [])

  const onCreate = async (todoText) => {
    if (!todoText.trim()) return

    try {

      const res = await axios.post(API, { text: todoText.trim() })

      const created = res.data?.todo ?? res.data

      if (Array.isArray(res.data?.todos)) {
        setTodos(res.data.todos)
      } else {
        setTodos(prev => [created, ...prev])
      }

    } catch (error) {
      console.log("추가 실패", error)
    }
  }

  const onDelete = async (id) => {
    try {
      if (!confirm('정말 삭제할까요?')) return

      const { data } = await axios.delete(`${API}/${id}`)

      if (Array.isArray(data?.todos)) {
        setTodos(data.todos)
        return
      }

      const deletedId = data?.deletedId ?? data?.todo?._id ?? data?._id ?? id
      setTodos((prev) => prev.filter((t) => t._id !== deletedId))
    } catch (error) {
      console.log('삭제 실패', error)
    }
  }

  // 텍스트 수정
  const onUpdateText = async (id, newText) => {
    try {
      const { data } = await axios.patch(`${API}/${id}/text`, { text: newText });
      setTodos(prev => prev.map(t => (t._id === id ? data.todo : t)));
    } catch (error) {
      console.log("수정 실패", error);
    }
  };

  // 체크박스 토글
  const onUpdateChecked = async (id, isCompleted) => {
    try {
      const { data } = await axios.patch(`${API}/${id}/check`, { isCompleted });
      setTodos(prev => prev.map(t => (t._id === id ? data.todo : t)));
    } catch (error) {
      console.log("체크 수정 실패", error);
    }
  };



  return (
    <div className='App'>
      <Header />
      <TodoEditor onCreate={onCreate} />
      <TodoList
        todos={Array.isArray(todos) ? todos : []}
        onDelete={onDelete}
        // onUpdateText={onUpdateText}
        // onUpdateChecked={onUpdateChecked}
      />
    </div>
  );
}

export default App;
