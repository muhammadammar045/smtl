import { PageTitle } from "@/components/common/parts/BreadCrumb";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { useState } from "react";

interface TodoItem {
    id: string;
    text: string;
    completed: boolean;
    date: string;
}

function Todo() {
    const [todos, setTodos] = useState<TodoItem[]>([
        { id: "1", text: "asdsadsad", completed: false, date: "04/01/2025" },
        { id: "2", text: "asdsadsada", completed: false, date: "04/17/2025" },
        { id: "3", text: "asd", completed: true, date: "04/29/2025" },
    ]);
    const [newTodo, setNewTodo] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const addTodo = () => {
        if (newTodo.trim()) {
            setTodos([
                ...todos,
                {
                    id: Date.now().toString(),
                    text: newTodo,
                    completed: false,
                    date: new Date().toLocaleDateString(),
                },
            ]);
            setNewTodo("");
        }
    };

    const toggleTodo = (id: string) => {
        setTodos(
            todos.map((todo) =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        );
    };

    const deleteTodo = (id: string) => {
        setTodos(todos.filter((todo) => todo.id !== id));
    };

    // Pagination
    const totalPages = Math.ceil(todos.length / itemsPerPage);
    const paginatedTodos = todos.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className='space-y-4'>
            <PageTitle
                title='To Do List'
                description=''
            />

            <Card className='p-4'>
                <div className='flex gap-2 mb-4'>
                    <Input
                        placeholder='Add new todo...'
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addTodo()}
                    />
                    <Button onClick={addTodo}>
                        <Plus className='h-4 w-4' />
                    </Button>
                </div>

                <div className='space-y-2'>
                    {paginatedTodos.map((todo) => (
                        <div
                            key={todo.id}
                            className='flex items-center justify-between gap-2 p-2 border rounded'
                        >
                            <div className='flex items-center gap-2'>
                                <Checkbox
                                    checked={todo.completed}
                                    onCheckedChange={() => toggleTodo(todo.id)}
                                />
                                <span
                                    className={
                                        todo.completed
                                            ? "line-through text-muted-foreground"
                                            : ""
                                    }
                                >
                                    {todo.text}
                                </span>
                            </div>
                            <div className='flex items-center gap-2'>
                                <span className='text-sm text-muted-foreground'>
                                    {todo.date}
                                </span>
                                <Button
                                    variant='ghost'
                                    size='icon'
                                    onClick={() => deleteTodo(todo.id)}
                                >
                                    <X className='h-4 w-4' />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                {totalPages > 1 && (
                    <div className='flex justify-center gap-1 mt-4'>
                        {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1
                        ).map((page) => (
                            <Button
                                key={page}
                                variant={
                                    currentPage === page ? "default" : "outline"
                                }
                                size='sm'
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </Button>
                        ))}
                        {currentPage < totalPages && (
                            <>
                                <Button
                                    variant='outline'
                                    size='sm'
                                    onClick={() =>
                                        setCurrentPage(currentPage + 1)
                                    }
                                >
                                    &gt;
                                </Button>
                                <Button
                                    variant='outline'
                                    size='sm'
                                    onClick={() => setCurrentPage(totalPages)}
                                >
                                    »
                                </Button>
                            </>
                        )}
                    </div>
                )}
            </Card>
        </div>
    );
}

export default Todo;
