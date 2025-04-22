import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import teacherService from "../../services/teacherService";

function TeacherList() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa giáo viên này?")) {
      try {
        await teacherService.deleteTeacher(id);
        setTeachers(teachers.filter((teacher) => teacher.id !== id));
      } catch (err) {
        setError("Không thể xóa giáo viên");
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border"></div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger mt-3">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Danh sách giáo viên</h2>
        <Link to="/teachers/add" className="btn btn-primary">
          Thêm giáo viên mới
        </Link>
      </div>

      {teachers.length === 0 ? (
        <div className="alert alert-info">Không có giáo viên nào</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Họ và tên</th>
                <th>Email</th>
                <th>SĐT</th>
                <th>Chuyên môn</th>
                <th>Giá/giờ</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <tr key={teacher.id}>
                  <td>{teacher.id}</td>
                  <td>{teacher.fullName}</td>
                  <td>{teacher.email}</td>
                  <td>{teacher.phone}</td>
                  <td>{teacher.specialization}</td>
                  <td>{teacher.hourlyRate} VNĐ</td>
                  <td>
                    <span
                      className={`badge ${
                        teacher.status === "active"
                          ? "bg-success"
                          : "bg-secondary"
                      }`}
                    >
                      {teacher.status === "active"
                        ? "Đang hoạt động"
                        : "Không hoạt động"}
                    </span>
                  </td>
                  <td>
                    <div className="btn-group">
                      <Link
                        to={`/teachers/${teacher.id}`}
                        className="btn btn-sm btn-info"
                      >
                        Xem
                      </Link>
                      <Link
                        to={`/teachers/edit/${teacher.id}`}
                        className="btn btn-sm btn-warning"
                      >
                        Sửa
                      </Link>
                      <button
                        onClick={() => handleDelete(teacher.id)}
                        className="btn btn-sm btn-danger"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TeacherList;
