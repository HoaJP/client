// client/src/components/attendance/TeacherAttendanceList.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import attendanceService from "../../services/attendanceService";

function TeacherAttendanceList() {
  const { teacherId } = useParams();
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await attendanceService.getTeacherAttendance(
          teacherId
        );
        setAttendance(response.data);
        setLoading(false);
      } catch (err) {
        setError("Không thể tải lịch sử chấm công");
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [teacherId]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border"></div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Lịch sử chấm công</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card mt-4">
        <div className="card-body">
          {attendance.length === 0 ? (
            <div className="alert alert-info">Không có dữ liệu chấm công</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Ngày</th>
                    <th>Lớp</th>
                    <th>Môn học</th>
                    <th>Thời gian</th>
                    <th>Trạng thái</th>
                    <th>Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((record) => (
                    <tr key={record.id}>
                      <td>
                        {new Date(record.date).toLocaleDateString("vi-VN")}
                      </td>
                      <td>{record.class_name}</td>
                      <td>{record.subject}</td>
                      <td>
                        {record.start_time} - {record.end_time}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            record.status === "present"
                              ? "bg-success"
                              : "bg-danger"
                          }`}
                        >
                          {record.status === "present" ? "Có mặt" : "Vắng mặt"}
                        </span>
                      </td>
                      <td>{record.notes}</td>
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

export default TeacherAttendanceList;
