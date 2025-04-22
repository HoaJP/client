// client/src/components/availability/AssignmentOverview.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import availabilityService from "../../services/availabilityService";
import teacherService from "../../services/teacherService";

function AssignmentOverview() {
  const [assignments, setAssignments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    teacherId: "",
    fromDate: "",
    toDate: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teachersResponse = await teacherService.getAllTeachers();
        setTeachers(teachersResponse.data);

        // Mặc định này cần phát triển thêm API phía backend để lấy tất cả lịch dạy
        // Tạm thời cứ để trống
        setAssignments([]);
        setLoading(false);
      } catch (err) {
        setError("Không thể tải dữ liệu");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({
      ...filter,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // API gọi dữ liệu theo filter - cần phát triển thêm ở backend
    // Tạm thời để trống
  };

  // Format date YYYY-MM-DD to DD/MM/YYYY for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
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
      <h2>Tổng quan lịch dạy</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card mb-4">
        <div className="card-header">
          <h3 className="card-title">Bộ lọc</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-4">
              <label htmlFor="teacherId" className="form-label">
                Giáo viên
              </label>
              <select
                className="form-select"
                id="teacherId"
                name="teacherId"
                value={filter.teacherId}
                onChange={handleFilterChange}
              >
                <option value="">Tất cả</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label htmlFor="fromDate" className="form-label">
                Từ ngày
              </label>
              <input
                type="date"
                className="form-control"
                id="fromDate"
                name="fromDate"
                value={filter.fromDate}
                onChange={handleFilterChange}
              />
            </div>

            <div className="col-md-3">
              <label htmlFor="toDate" className="form-label">
                Đến ngày
              </label>
              <input
                type="date"
                className="form-control"
                id="toDate"
                name="toDate"
                value={filter.toDate}
                onChange={handleFilterChange}
              />
            </div>

            <div className="col-md-2 d-flex align-items-end">
              <button type="submit" className="btn btn-primary w-100">
                Lọc
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h3 className="card-title mb-0">Danh sách lịch dạy</h3>
        </div>
        <div className="card-body">
          {assignments.length === 0 ? (
            <div className="alert alert-info">Không có lịch dạy nào</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Giáo viên</th>
                    <th>Lớp</th>
                    <th>Môn học</th>
                    <th>Ngày</th>
                    <th>Giờ học</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((assignment) => (
                    <tr key={assignment.id}>
                      <td>{assignment.teacherName}</td>
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
                      <td>
                        <Link
                          to={`/assignments/teacher/${assignment.teacher_id}`}
                          className="btn btn-sm btn-info"
                        >
                          Chi tiết
                        </Link>
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
  );
}

export default AssignmentOverview;
