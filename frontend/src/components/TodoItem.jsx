import React from 'react'
import "./TodoItem.css"
import { useState } from 'react'
const TodoItem = ({ todo, onDelete, onUpdateText, onUpdateChecked }) => {

    const [editing, setEditing] = useState(false)
    const [text, setText] = useState(todo.text)
    const isCompleted = !todo.isCompleted

    const startEdit = () => {
        setText(todo.text)
        setEditing(true)
    }
    const cancelEdit = () => {
        setText(todo.text)
        setEditing(false)
    }

    const saveEdit = async() => {
        const next = text.trim()
        await onUpdateText(todo._id, next)
    }

    

    return (
        <div className={`TodoItem ${!isCompleted ? 'isCompleted' : ''}`}>
            <input
                type="checkbox"
                checked={todo.isCompleted}
                onChange={(e) => onUpdateChecked(todo._id, !todo.isCompleted)}
            />
            <div className="content">{todo.text}</div>
            <div className="date">{new Date(todo.date).toLocaleDateString()}</div>
            <div className="btn-wrap">
                <button
                    className="updateBtn"
                    onClick={() => {
                        const newText = prompt("새 텍스트 입력:", todo.text);
                        if (newText && newText.trim()) {
                            onUpdateText(todo._id, newText.trim());
                        }
                    }}
                >
                    수정
                </button>
                <button className="deleteBtn" onClick={() => onDelete(todo._id)}>
                    삭제
                </button>
            </div>
        </div>
    )
}



export default TodoItem