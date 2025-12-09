"use client";

import Calendar from "../components/Calendar";
import TodoList from "../../todo/components/TodoList";
import PlusButton from "@/components/common/PlusButton";

import { useCalendarCore } from "@/features/calendar/hooks/useCalendarCore";

export default function MainPage() {
    const {
        year,
        month,
        calendarMatrix,
        selectedDay,
        editingTodoId,

        setYear,
        setMonth,
        selectDay, // receives CalendarDay

        handleToggle,
        handleEdit,
        handleDelete,
        handleAdd,
        handleConfirm,
    } = useCalendarCore();

    return (
        <div>
            {/* API 기반 Calendar */}
            <Calendar
                year={year}
                month={month}
                calendarMatrix={calendarMatrix}
                selectedDay={selectedDay}
                onSelectDay={(day) => selectDay(day.date)}
                onChangeMonth={(y: number, m: number) => {
                    setYear(y);
                    setMonth(m);
                }}
            />

            {/* TodoList */}
            <TodoList
                selectedDay={selectedDay}
                onToggleTodo={handleToggle}
                onEditTodo={handleEdit}
                onDeleteTodo={handleDelete}
                onConfirmNewTodo={handleConfirm}
                editingTodoId={editingTodoId}
            />

            {/* + 버튼 */}
            <PlusButton showMenu={true} onAddEvent={handleAdd} />
        </div>
    );
}
