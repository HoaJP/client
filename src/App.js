import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Header from "./components/common/Header";
import TeacherList from "./components/teachers/TeacherList";
import TeacherForm from "./components/teachers/TeacherForm";
import TeacherDetail from "./components/teachers/TeacherDetail";
import TeacherAssignments from "./components/availability/TeacherAssignments";
import AllAssignments from "./components/availability/AllAssignments";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <main className="container py-4">
          <Routes>
            <Route path="/" element={<Navigate to="/teachers" />} />
            <Route path="/teachers" element={<TeacherList />} />
            <Route path="/teachers/add" element={<TeacherForm />} />
            <Route path="/teachers/edit/:id" element={<TeacherForm />} />
            <Route path="/teachers/:id" element={<TeacherDetail />} />
            <Route path="/assignments" element={<AllAssignments />} />
            <Route
              path="/assignments/teacher/:teacherId"
              element={<TeacherAssignments />}
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
