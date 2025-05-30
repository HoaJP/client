import React, { useState, useEffect } from "react";
import availabilityService from "../../services/availabilityService";

function AllAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subjectsResponse, assignmentsResponse] = await Promise.all([
          availabilityService.getSubjects(),
          availabilityService.getAllAssignments(),
        ]);
        setSubjects(subjectsResponse.data);
        setAssignments(assignmentsResponse.data);
        setLoading(false);
      } catch (err) {
        setError("Không thể tải dữ liệu");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const filteredAssignments = selectedSubject
    ? assignments.filter((assignment) => assignment.subject === selectedSubject)
    : assignments;

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
        <div className="card-header">Danh sách lịch dạy</div>
        <div className="card-body">
          <div className="mb-3">
            <label htmlFor="subject" className="form-label">
              Lọc theo môn học
            </label>
            <select
              className="form-select"
              id="subject"
              value={selectedSubject}
              onChange={handleSubjectChange}
            >
              <option value="">Tất cả môn học</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          {filteredAssignments.length === 0 ? (
            <div className="alert alert-info">
              Không có lịch dạy nào được đăng ký
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Môn học</th>
                    <th>Lớp</th>
                    <th>Ngày bắt đầu</th>
                    <th>Ngày kết thúc</th>
                    <th>Thời gian</th>
                    <th>Giáo viên đăng ký</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssignments.map((assignment) => (
                    <tr key={assignment.class_id}>
                      <td>{assignment.subject}</td>
                      <td>{assignment.class_name}</td>
                      <td>{formatDate(assignment.start_date)}</td>
                      <td>{formatDate(assignment.end_date)}</td>
                      <td>
                        {assignment.start_time} - {assignment.end_time}
                      </td>
                      <td>{assignment.teachers.join(", ")}</td>
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

export default AllAssignments;
