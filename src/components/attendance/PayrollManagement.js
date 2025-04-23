// client/src/components/attendance/PayrollManagement.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import attendanceService from "../../services/attendanceService";
import teacherService from "../../services/teacherService";

function PayrollManagement() {
  const { teacherId } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [payrollHistory, setPayrollHistory] = useState([]);
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
  });
  const [calculatedPayroll, setCalculatedPayroll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teacherResponse, payrollResponse] = await Promise.all([
          teacherService.getTeacher(teacherId),
          attendanceService.getTeacherPayroll(teacherId),
        ]);

        setTeacher(teacherResponse.data);
        setPayrollHistory(payrollResponse.data);
        setLoading(false);
      } catch (err) {
        setError("Không thể tải dữ liệu");
        setLoading(false);
      }
    };

    fetchData();
  }, [teacherId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCalculate = async (e) => {
    e.preventDefault();
    if (!formData.startDate || !formData.endDate) {
      setError("Vui lòng chọn khoảng thời gian");
      return;
    }

    try {
      const response = await attendanceService.calculatePayroll({
        teacherId,
        startDate: formData.startDate,
        endDate: formData.endDate,
      });
      setCalculatedPayroll(response.data);
      setError(null);
    } catch (err) {
      setError("Không thể tính lương");
      setCalculatedPayroll(null);
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
      <h2>Quản lý lương cho: {teacher?.fullName}</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">Tính lương theo kỳ</div>
            <div className="card-body">
              <form onSubmit={handleCalculate}>
                <div className="mb-3">
                  <label htmlFor="startDate" className="form-label">
                    Từ ngày
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="endDate" className="form-label">
                    Đến ngày
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  Tính lương
                </button>
              </form>

              {calculatedPayroll && (
                <div className="mt-4">
                  <h5>Kết quả tính lương:</h5>
                  <ul className="list-group">
                    <li className="list-group-item">
                      Tổng giờ dạy:{" "}
                      <strong>{calculatedPayroll.total_hours}</strong> giờ
                    </li>
                    <li className="list-group-item">
                      Tổng lương:{" "}
                      <strong>
                        {calculatedPayroll.amount.toLocaleString()} VNĐ
                      </strong>
                    </li>
                    <li className="list-group-item">
                      Kỳ tính:{" "}
                      {new Date(
                        calculatedPayroll.period_start
                      ).toLocaleDateString("vi-VN")}{" "}
                      -{" "}
                      {new Date(
                        calculatedPayroll.period_end
                      ).toLocaleDateString("vi-VN")}
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header">Lịch sử thanh toán</div>
            <div className="card-body">
              {payrollHistory.length === 0 ? (
                <div className="alert alert-info">
                  Chưa có lịch sử thanh toán
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Kỳ</th>
                        <th>Tổng giờ</th>
                        <th>Tổng lương</th>
                        <th>Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payrollHistory.map((payroll) => (
                        <tr key={payroll.id}>
                          <td>
                            {new Date(payroll.period_start).toLocaleDateString(
                              "vi-VN"
                            )}{" "}
                            -
                            {new Date(payroll.period_end).toLocaleDateString(
                              "vi-VN"
                            )}
                          </td>
                          <td>{payroll.total_hours}</td>
                          <td>{payroll.amount.toLocaleString()} VNĐ</td>
                          <td>
                            <span
                              className={`badge ${
                                payroll.status === "paid"
                                  ? "bg-success"
                                  : "bg-warning"
                              }`}
                            >
                              {payroll.status === "paid"
                                ? "Đã thanh toán"
                                : "Chờ thanh toán"}
                            </span>
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
      </div>
    </div>
  );
}

export default PayrollManagement;
