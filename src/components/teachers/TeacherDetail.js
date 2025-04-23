import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import teacherService from "../../services/teacherService";

function TeacherDetail() {
  const { id } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const response = await teacherService.getTeacher(id);
        setTeacher(response.data);
        setLoading(false);
      } catch (err) {
        setError("Không thể tải thông tin giáo viên");
        setLoading(false);
      }
    };

    fetchTeacher();
  }, [id]);

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

  if (!teacher) {
    return (
      <div className="alert alert-warning mt-3">Không tìm thấy giáo viên</div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Chi tiết giáo viên</h2>

      <div className="card">
        <div className="card-header d-flex justify-content-between">
          <h3>{teacher.fullName}</h3>
          <span
            className={`badge ${
              teacher.status === "active" ? "bg-success" : "bg-secondary"
            }`}
          >
            {teacher.status === "active" ? "Đang hoạt động" : "Không hoạt động"}
          </span>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <p>
                <strong>Email:</strong> {teacher.email}
              </p>
              <p>
                <strong>Số điện thoại:</strong> {teacher.phone}
              </p>
            </div>
            <div className="col-md-6">
              <p>
                <strong>Chuyên môn:</strong> {teacher.specialization}
              </p>
              <p>
                <strong>Giá/giờ:</strong> {teacher.hourlyRate} VNĐ
              </p>
            </div>
          </div>
        </div>
        <div className="card-footer">
          <div className="btn-group">
            <Link
              to={`/teachers/edit/${teacher.id}`}
              className="btn btn-warning"
            >
              Chỉnh sửa
            </Link>
            <Link to="/teachers" className="btn btn-primary">
              Quay lại
            </Link>
            <Link
              to={`/assignments/teacher/${teacher.id}`}
              className="btn btn-info"
            >
              Lịch dạy
            </Link>
            <Link
              to={`/availability/teacher/${teacher.id}`}
              className="btn btn-secondary"
            >
              Lịch rảnh
            </Link>
            <Link
              to={`/attendance/teacher/${teacher.id}`}
              className="btn btn-success"
            >
              Chấm công
            </Link>
            <Link
              to={`/attendance/payroll/teacher/${teacher.id}`}
              className="btn btn-secondary"
            >
              Tính lương
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherDetail;
