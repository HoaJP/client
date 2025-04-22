import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import teacherService from "../../services/teacherService";

function TeacherForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    specialization: "",
    hourlyRate: "",
    status: "active",
  });

  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      const fetchTeacher = async () => {
        try {
          const response = await teacherService.getTeacher(id);
          setFormData(response.data);
          setLoading(false);
        } catch (err) {
          setError("Không thể tải thông tin giáo viên");
          setLoading(false);
        }
      };

      fetchTeacher();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditMode) {
        await teacherService.updateTeacher(id, formData);
      } else {
        await teacherService.createTeacher(formData);
      }
      navigate("/teachers");
    } catch (err) {
      setError(
        isEditMode ? "Không thể cập nhật giáo viên" : "Không thể thêm giáo viên"
      );
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
      <h2>
        {isEditMode ? "Cập nhật thông tin giáo viên" : "Thêm giáo viên mới"}
      </h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="fullName" className="form-label">
            Họ và tên
          </label>
          <input
            type="text"
            className="form-control"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="phone" className="form-label">
            Số điện thoại
          </label>
          <input
            type="text"
            className="form-control"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="specialization" className="form-label">
            Chuyên môn
          </label>
          <input
            type="text"
            className="form-control"
            id="specialization"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="hourlyRate" className="form-label">
            Giá/giờ (VNĐ)
          </label>
          <input
            type="number"
            className="form-control"
            id="hourlyRate"
            name="hourlyRate"
            value={formData.hourlyRate}
            onChange={handleChange}
          />
        </div>

        {isEditMode && (
          <div className="mb-3">
            <label htmlFor="status" className="form-label">
              Trạng thái
            </label>
            <select
              className="form-select"
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Không hoạt động</option>
            </select>
          </div>
        )}

        <div className="mb-3">
          <button type="submit" className="btn btn-primary me-2">
            {isEditMode ? "Cập nhật" : "Thêm mới"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/teachers")}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}

export default TeacherForm;
