import { useRecoilState } from "recoil";
import { v4 as uuidv4 } from 'uuid';

import { todosListState } from "../../Atons/Todo";

export const useTodo = () => {
    const [todoList, setTodolist] = useRecoilState(todosListState)

    function addTodo(todoInput, idTab) {
        setTodolist(old => [...old, {
            key: uuidv4(),
            todo: todoInput,
            tabId: idTab,
            create_at: new Date(),
            update_at: new Date(),
        }])
    }

    function updateTodo(name, id) {
        let olds = [...todoList];
        olds = olds.map(item => {
            if (item.key === id) {
                return {
                    ...item,
                    todo: name,
                    update_at: new Date(),
                }
            }
            return item;
        });
        setTodolist(olds);
    }

    function deleteTodo(keyTodo) {
        setTodolist((old) => old.filter((item) => item.key !== keyTodo))
    }

    function todosTabId(id) {
        return todoList.filter((item) => item.tabId === id)
    }

    function deleteTodoTabId(keyTab) {
        setTodolist((old) => old.filter((item) => item.tabId !== keyTab))
    }

    return {
        todoList,
        addTodo,
        deleteTodo,
        todosTabId,
        updateTodo,
        deleteTodoTabId,
    }
}