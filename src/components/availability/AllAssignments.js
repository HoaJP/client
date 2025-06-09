
import React, { useState, useEffect } from "react";
import availabilityService from "../../services/availabilityService";

function AllAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await availabilityService.getAllAssignments();
        setAssignments(response.data);
        setLoading(false);
      } catch (err) {
        setError("Không thể tải danh sách lịch dạy");
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const handleViewDetails = async (classId) => {
    try {
      const response = await availabilityService.getClassDetails(classId);
      setSelectedClass(response.data);
      setShowModal(true);
    } catch (err) {
      setError("Không thể tải chi tiết lớp học");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedClass(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Quản lý lịch dạy</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      {assignments.length === 0 ? (
        <div className="alert alert-warning">
          Chưa có lịch dạy nào được đăng ký
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Tên lớp</th>
                <th>Môn học</th>
                <th>Ngày bắt đầu</th>
                <th>Ngày kết thúc</th>
                <th>Thời gian</th>
                <th>Giáo viên</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment) => (
                <tr key={assignment.class_id}>
                  <td>{assignment.class_name}</td>
                  <td>{assignment.subject}</td>
                  <td>{formatDate(assignment.start_date)}</td>
                  <td>{formatDate(assignment.end_date)}</td>
                  <td>
                    {assignment.start_time} - {assignment.end_time}
                  </td>
                  <td>{assignment.teachers.join(", ")}</td>
                  <td>
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() => handleViewDetails(assignment.class_id)}
                    >
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal hiển thị chi tiết lịch dạy */}
      {showModal && selectedClass && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Chi tiết lịch dạy: {selectedClass.class_name}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Môn học:</strong> {selectedClass.subject}
                </p>
                <p>
                  <strong>Ngày bắt đầu:</strong>{" "}
                  {formatDate(selectedClass.start_date)}
                </p>
                <p>
                  <strong>Ngày kết thúc:</strong>{" "}
                  {formatDate(selectedClass.end_date)}
                </p>
                <p>
                  <strong>Thời gian:</strong> {selectedClass.start_time} -{" "}
                  {selectedClass.end_time}
                </p>
                <h6>
                  <strong>Lịch dạy các buổi học</strong>
                </h6>
                {selectedClass.schedules?.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Tên lớp</th>
                          <th>Thứ</th>
                          <th>Ngày dạy</th>
                          <th>Giờ dạy</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedClass.schedules.map((schedule, index) => (
                          <tr key={index}>
                            <td>{selectedClass.class_name}</td>
                            <td>{schedule.day_of_week}</td>
                            <td>{formatDate(schedule.date)}</td>
                            <td>{`${schedule.start_time} - ${schedule.end_time}`}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p>Không có lịch dạy nào được thiết lập</p>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllAssignments;