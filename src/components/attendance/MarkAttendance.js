// client/src/components/attendance/MarkAttendance.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import attendanceService from "../../services/attendanceService";
import availabilityService from "../../services/availabilityService";

function MarkAttendance() {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [attendanceData, setAttendanceData] = useState({
    assignment_id: assignmentId,
    teacher_id: "",
    date: new Date().toISOString().split("T")[0], // Default to today
    status: "present",
    notes: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAttendanceData({
      ...attendanceData,
      [name]: value,
    });
  };
  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const response = await availabilityService.getAssignment(assignmentId);
        console.log("Assignment data:", response); // Thêm log này để kiểm tra

        if (response.data) {
          setAssignment(response.data);
          setAttendanceData((prev) => ({
            ...prev,
            teacher_id: response.data.teacher_id,
          }));
        } else {
          setError("Không tìm thấy thông tin lớp học");
        }
        setLoading(false);
      } catch (err) {
        setError("Không thể tải thông tin lớp học");
        setLoading(false);
      }
    };

    fetchAssignment();
  }, [assignmentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await attendanceService.markAttendance(attendanceData);
      navigate(`/attendance/teacher/${attendanceData.teacher_id}`);
    } catch (err) {
      setError("Không thể lưu thông tin chấm công");
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border"></div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="alert alert-danger mt-3">
        Không tìm thấy thông tin lớp học
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Chấm công cho lớp học</h2>
      <div className="card mt-4">
        <div className="card-header">
          <h4>
            {assignment.class_name} - {assignment.subject}
          </h4>
          <p className="mb-0">
            Ngày: {new Date(assignment.date).toLocaleDateString("vi-VN")} | Thời
            gian: {assignment.start_time} - {assignment.end_time}
          </p>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="date" className="form-label">
                Ngày chấm công
              </label>
              <input
                type="date"
                className="form-control"
                id="date"
                name="date"
                value={attendanceData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="status" className="form-label">
                Trạng thái
              </label>
              <select
                className="form-select"
                id="status"
                name="status"
                value={attendanceData.status}
                onChange={handleChange}
                required
              >
                <option value="present">Có mặt</option>
                <option value="absent">Vắng mặt</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="notes" className="form-label">
                Ghi chú
              </label>
              <textarea
                className="form-control"
                id="notes"
                name="notes"
                value={attendanceData.notes}
                onChange={handleChange}
                rows="3"
              ></textarea>
            </div>

            <div className="d-flex justify-content-between">
              <button type="submit" className="btn btn-primary">
                Lưu chấm công
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate(-1)}
              >
                Quay lại
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default MarkAttendance;
