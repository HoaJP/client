// client/src/components/availability/TeacherAvailability.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import availabilityService from "../../services/availabilityService";

const dayNames = [
  "Chủ nhật",
  "Thứ hai",
  "Thứ ba",
  "Thứ tư",
  "Thứ năm",
  "Thứ sáu",
  "Thứ bảy",
];

function TeacherAvailability() {
  const { teacherId } = useParams();
  const [availabilities, setAvailabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newAvailability, setNewAvailability] = useState({
    teacher_id: teacherId,
    day_of_week: 1,
    start_time: "08:00",
    end_time: "10:00",
  });

  useEffect(() => {
    fetchAvailabilities();
  }, [teacherId]);

  const fetchAvailabilities = async () => {
    try {
      const response = await availabilityService.getTeacherAvailability(
        teacherId
      );
      setAvailabilities(response.data);
      setLoading(false);
    } catch (err) {
      setError("Không thể tải lịch rảnh của giáo viên");
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAvailability({
      ...newAvailability,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await availabilityService.addAvailability(newAvailability);
      // Reset form
      setNewAvailability({
        ...newAvailability,
        day_of_week: 1,
        start_time: "08:00",
        end_time: "10:00",
      });
      // Refresh list
      fetchAvailabilities();
    } catch (err) {
      setError("Không thể thêm lịch rảnh");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa lịch rảnh này?")) {
      try {
        await availabilityService.deleteAvailability(id);
        setAvailabilities(availabilities.filter((item) => item.id !== id));
      } catch (err) {
        setError("Không thể xóa lịch rảnh");
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

  return (
    <div className="container mt-4">
      <h2>Lịch rảnh của giáo viên</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        <div className="col-md-6">
          <h3>Thêm lịch rảnh mới</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="day_of_week" className="form-label">
                Ngày trong tuần
              </label>
              <select
                className="form-select"
                id="day_of_week"
                name="day_of_week"
                value={newAvailability.day_of_week}
                onChange={handleInputChange}
              >
                {dayNames.map((day, index) => (
                  <option key={index} value={index}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="start_time" className="form-label">
                Thời gian bắt đầu
              </label>
              <input
                type="time"
                className="form-control"
                id="start_time"
                name="start_time"
                value={newAvailability.start_time}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="end_time" className="form-label">
                Thời gian kết thúc
              </label>
              <input
                type="time"
                className="form-control"
                id="end_time"
                name="end_time"
                value={newAvailability.end_time}
                onChange={handleInputChange}
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Thêm lịch rảnh
            </button>
          </form>
        </div>

        <div className="col-md-6">
          <h3>Lịch rảnh hiện tại</h3>
          {availabilities.length === 0 ? (
            <div className="alert alert-info">
              Chưa có lịch rảnh nào được đăng ký
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Ngày</th>
                    <th>Thời gian bắt đầu</th>
                    <th>Thời gian kết thúc</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {availabilities.map((item) => (
                    <tr key={item.id}>
                      <td>{dayNames[item.day_of_week]}</td>
                      <td>{item.start_time}</td>
                      <td>{item.end_time}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(item.id)}
                        >
                          Xóa
                        </button>
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

export default TeacherAvailability;
