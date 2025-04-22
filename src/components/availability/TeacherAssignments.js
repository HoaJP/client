// client/src/components/availability/TeacherAssignments.js
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import availabilityService from "../../services/availabilityService";
import teacherService from "../../services/teacherService";

function TeacherAssignments() {
  const { teacherId } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newAssignment, setNewAssignment] = useState({
    teacher_id: teacherId,
    class_name: "",
    subject: "",
    date: "",
    start_time: "08:00",
    end_time: "10:00",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assignmentsResponse, teacherResponse] = await Promise.all([
          availabilityService.getTeacherAssignments(teacherId),
          teacherService.getTeacher(teacherId),
        ]);

        setAssignments(assignmentsResponse.data);
        setTeacher(teacherResponse.data);
        setLoading(false);
      } catch (err) {
        setError("Không thể tải thông tin lịch dạy");
        setLoading(false);
      }
    };

    fetchData();
  }, [teacherId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAssignment({
      ...newAssignment,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await availabilityService.createAssignment(
        newAssignment
      );
      setAssignments([...assignments, response.data]);

      // Reset form
      setNewAssignment({
        ...newAssignment,
        class_name: "",
        subject: "",
        date: "",
        start_time: "08:00",
        end_time: "10:00",
      });
    } catch (err) {
      setError("Không thể đăng ký lịch dạy");
    }
  };

  // Format date YYYY-MM-DD to DD/MM/YYYY for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  // Get current date in YYYY-MM-DD format for min date in input
  const getCurrentDate = () => {
    const date = new Date();
    return date.toISOString().split("T")[0];
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border"></div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Lịch dạy của giáo viên: {teacher?.fullName}</h2>
        <Link to={`/teachers/${teacherId}`} className="btn btn-secondary">
          Quay lại
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        <div className="col-md-5">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Đăng ký lịch dạy mới</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="class_name" className="form-label">
                    Tên lớp
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="class_name"
                    name="class_name"
                    value={newAssignment.class_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="subject" className="form-label">
                    Môn học
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="subject"
                    name="subject"
                    value={newAssignment.subject}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="date" className="form-label">
                    Ngày dạy
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="date"
                    name="date"
                    min={getCurrentDate()}
                    value={newAssignment.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="start_time" className="form-label">
                      Thời gian bắt đầu
                    </label>
                    <input
                      type="time"
                      className="form-control"
                      id="start_time"
                      name="start_time"
                      value={newAssignment.start_time}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="end_time" className="form-label">
                      Thời gian kết thúc
                    </label>
                    <input
                      type="time"
                      className="form-control"
                      id="end_time"
                      name="end_time"
                      value={newAssignment.end_time}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary">
                  Đăng ký
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-7">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Lịch dạy đã đăng ký</h3>
            </div>
            <div className="card-body">
              {assignments.length === 0 ? (
                <div className="alert alert-info">
                  Chưa có lịch dạy nào được đăng ký
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Lớp</th>
                        <th>Môn học</th>
                        <th>Ngày</th>
                        <th>Giờ học</th>
                        <th>Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignments.map((assignment) => (
                        <tr key={assignment.id}>
                          <td>{assignment.class_name}</td>
                          <td>{assignment.subject}</td>
                          <td>{formatDate(assignment.date)}</td>
                          <td>
                            {assignment.start_time} - {assignment.end_time}
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                assignment.status === "completed"
                                  ? "bg-success"
                                  : "bg-warning"
                              }`}
                            >
                              {assignment.status === "completed"
                                ? "Đã hoàn thành"
                                : "Đã lên lịch"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherAssignments;
