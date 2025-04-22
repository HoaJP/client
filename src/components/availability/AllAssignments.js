// client/src/components/availability/AllAssignments.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import availabilityService from "../../services/availabilityService";
import teacherService from "../../services/teacherService";

function AllAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState("");

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await teacherService.getAllTeachers();
        setTeachers(response.data);
        setLoading(false);
      } catch (err) {
        setError("Không thể tải danh sách giáo viên");
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const handleTeacherChange = async (e) => {
    const teacherId = e.target.value;
    setSelectedTeacher(teacherId);

    if (teacherId) {
      try {
        const response = await availabilityService.getTeacherAssignments(
          teacherId
        );
        setAssignments(response.data);
      } catch (err) {
        setError("Không thể tải lịch dạy của giáo viên");
      }
    } else {
      setAssignments([]);
    }
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
      <h2>Quản lý lịch dạy</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card mt-4">
        <div className="card-header">Xem lịch dạy theo giáo viên</div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="teacher" className="form-label">
                  Chọn giáo viên
                </label>
                <select
                  className="form-select"
                  id="teacher"
                  value={selectedTeacher}
                  onChange={handleTeacherChange}
                >
                  <option value="">-- Chọn giáo viên --</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.fullName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-md-6">
              {selectedTeacher && (
                <div className="d-flex justify-content-end align-items-end h-100">
                  <Link
                    to={`/assignments/teacher/${selectedTeacher}/add`}
                    className="btn btn-primary"
                  >
                    Thêm lịch dạy mới
                  </Link>
                </div>
              )}
            </div>
          </div>

          {selectedTeacher && (
            <div className="mt-4">
              {assignments.length === 0 ? (
                <div className="alert alert-info">
                  Không có lịch dạy nào cho giáo viên này
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Lớp</th>
                        <th>Môn học</th>
                        <th>Ngày</th>
                        <th>Thời gian</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignments.map((assignment) => (
                        <tr key={assignment.id}>
                          <td>{assignment.class_name}</td>
                          <td>{assignment.subject}</td>
                          <td>
                            {new Date(assignment.date).toLocaleDateString(
                              "vi-VN"
                            )}
                          </td>
                          <td>
                            {assignment.start_time} - {assignment.end_time}
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                assignment.status === "scheduled"
                                  ? "bg-primary"
                                  : "bg-success"
                              }`}
                            >
                              {assignment.status === "scheduled"
                                ? "Đã lên lịch"
                                : "Đã hoàn thành"}
                            </span>
                          </td>
                          <td>
                            <Link
                              to={`/attendance/mark/${assignment.id}`}
                              className="btn btn-sm btn-success"
                            >
                              Chấm công
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AllAssignments;
