import "./index.css";
import { createClient } from "@supabase/supabase-js";
import { LoginForm } from "./components/login-form";
import { Route, Routes, Navigate } from "react-router-dom";
import { SignUpForm } from "./components/sign-up-form";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase/client";
import Header from "./components/Header";
import BoardListPage from "./pages/BoardListPage";
import BoardCreatePage from "./pages/BoardCreatePage";
import BoardEditPage from "./pages/BoardEditPage";

export default function App() {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    const [boards, setBoards] = useState([
        {
            id: 1,
            title: "게시판을 만들어 봅시다.",
            content: "리액트를 이용해 게시판을 만들어 보도록 합시다.",
            author: "서정민",
            createdAt: "2026.07.07",
            views: 128,
        },
        {
            id: 2,
            title: "컴포넌트 분리",
            content:
                "하나의 큰 컴포넌트에 모든 코드를 작성하지 않고, 게시글 하나를 보여주는 부분(BoardItem), 게시글 목록을 관리하는 부분(BoardList)처럼 기능에 따라 나누면 코드를 이해하고 수정하기 쉬워집니다.",
            author: "서정민",
            createdAt: "2026.07.07",
            views: 74,
        },
        {
            id: 3,
            title: "리액트 라우터",
            content:
                "리액트는 기본적으로 SPA(Single Page Application) 방식으로 동작하지만, React Router를 사용하면 URL 경로(path)에 따라 렌더링할 컴포넌트를 변경하여 여러 페이지처럼 동작하는 화면을 구성할 수 있습니다.",
            author: "서정민",
            createdAt: "2026.07.07",
            views: 51,
        },
    ]);

    const handleDeleteBoard = (id) => {
        const newBoards = [...boards];
        setBoards(newBoards.filter((board) => board.id !== id));

        // Array.filter((item) => {조건식}) -> true를 반환한 아이템들만 모아서 리스트로 반환

        // Array.map() -> List<Board> -> List<Object>

        setBoards(boards.filter());
        // setBoards((prevBoards) =>
        //     prevBoards.filter((board) => board.id !== id),
        // );
    };

    const handleCreateBoard = (newBoard) => {
        // id/조회수/작성일시

        // 조건식 ? 조건식이 참일 경우 쓰는 값 : 조건식이 거짓일 때 쓰는 값
        const id = boards.length === 0 ? 1 : boards[boards.length - 1].id + 1;
        const views = 0;
        const createdAt = "2026.07.08";

        setBoards([...boards, { ...newBoard, id, views, createdAt }]);

        // const newId =
        //     boards.length === 0 ? 1 : boards[boards.length - 1].id + 1;

        // setBoards([...boards, {
        //     ...newBoard,
        // id: newId, // +1 제거
        //     category: "일반",
        //     createdAt: "2026.07.07",
        //     views: 0,
        // }])
    };

    const handleUpdateBoard = (newBoard) => {
        const copy = [...boards]; // 1. 배열 복사

        // 2. 수정하려는 데이터가 위치한 인덱스 찾기
        const idx = copy.findIndex((board) => board.id == newBoard.id);

        // 3. 데이터 수정 사항 반영
        copy[idx].title = newBoard.title;
        copy[idx].content = newBoard.content;
        copy[idx].author = newBoard.author;

        setBoards(copy);
        // Array.find() -> 조건에 부합하는 값 자체를 반환
        // Array.findIndex() -> 조건에 부합하는 값이 위치는 배열 인덱스 반환

        // setBoards((prevBoards) =>
        //     prevBoards.map((board) =>
        //         board.id === newBoard.id ? { ...board, ...newBoard } : board,
        //     ),
        // );
    };

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
            setLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!session) {
        return (
            <Routes>
                <Route path="/login" element={<LoginForm />} />
                <Route path="/sign-up" element={<SignUpForm />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        );
    }

    return (
        <>
            <Header />

            <div className="min-h-screen bg-slate-50 px-5 pb-16 pt-24 text-slate-900">
                <div className="mx-auto flex w-full max-w-5xl">
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <BoardListPage
                                    boards={boards}
                                    onDelete={handleDeleteBoard}
                                />
                            }
                        />
                        <Route
                            path="/boards/new"
                            element={
                                <BoardCreatePage onCreate={handleCreateBoard} />
                            }
                        />
                        <Route
                            path="/boards/:id/edit"
                            element={
                                <BoardEditPage
                                    boards={boards}
                                    onUpdate={handleUpdateBoard}
                                />
                            }
                        />
                        <Route
                            path="/login"
                            element={<Navigate to="/" replace />}
                        />
                    </Routes>
                </div>
            </div>
        </>
    );
}
