import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import availabilityService from "../../services/availabilityService";
import teacherService from "../../services/teacherService";

function TeacherAssignments() {
  const { teacherId } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [registeredClasses, setRegisteredClasses] = useState([]);
  const [newAssignment, setNewAssignment] = useState({
    teacher_id: teacherId,
    subject: "",
    class_id: "",
  });
  const [selectedClassDetails, setSelectedClassDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teacherResponse, subjectsResponse, registeredResponse] =
          await Promise.all([
            teacherService.getTeacher(teacherId),
            availabilityService.getSubjects(),
            availabilityService.getTeacherAssignments(teacherId),
          ]);

        setTeacher(teacherResponse.data);
        setSubjects(subjectsResponse.data);
        setRegisteredClasses(registeredResponse.data);
        setLoading(false);
      } catch (err) {
        setError("Không thể tải thông tin");
        setLoading(false);
      }
    };

    fetchData();
  }, [teacherId]);

  const handleSubjectChange = async (e) => {
    const subject = e.target.value;
    setNewAssignment({
      ...newAssignment,
      subject,
      class_id: "",
    });
    setSelectedClassDetails(null);
    setClasses([]);
    setRegisteredClasses([]);

    if (subject) {
      if (teacher.specialization !== subject) {
        setError("Môn học không đúng với chuyên môn của bạn");
        return;
      } else {
        setError(null);
        try {
          const [classResponse, registeredResponse] = await Promise.all([
            availabilityService.getClassesBySubject(subject),
            availabilityService.getTeacherAssignments(teacherId),
          ]);
          setClasses(classResponse.data);
          setRegisteredClasses(registeredResponse.data);
        } catch (err) {
          setError("Không thể tải danh sách lớp học");
        }
      }
    }
  };

  const handleClassChange = async (e) => {
    const classId = e.target.value;
    setNewAssignment({
      ...newAssignment,
      class_id: classId,
    });

    if (classId) {
      try {
        const response = await availabilityService.getClassDetails(classId);
        setSelectedClassDetails(response.data);
      } catch (err) {
        setError("Không thể tải thông tin lớp học");
      }
    } else {
      setSelectedClassDetails(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await availabilityService.createAssignment({
        teacher_id: newAssignment.teacher_id,
        class_id: newAssignment.class_id,
      });
      const registeredResponse =
        await availabilityService.getTeacherAssignments(teacherId);
      setRegisteredClasses(registeredResponse.data);
      const classResponse = await availabilityService.getClassesBySubject(
        newAssignment.subject
      );
      setClasses(classResponse.data);
      setNewAssignment({
        ...newAssignment,
        class_id: "",
      });
      setSelectedClassDetails(null);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || "Không thể đăng ký lịch dạy");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const isClassDisabled = (classId) => {
    return registeredClasses.some((cls) => cls.class_id === parseInt(classId));
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          Đăng ký dạy: {teacher?.fullName} ({teacher?.specialization})
        </h2>
        <Link to={`/teachers/${teacherId}`} className="btn btn-secondary">
          Quay lại
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Đăng ký lớp học</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="subject" className="form-label">
                    Môn học
                  </label>
                  <select
                    className="form-select"
                    id="subject"
                    name="subject"
                    value={newAssignment.subject}
                    onChange={handleSubjectChange}
                    required
                  >
                    <option value="">-- Chọn môn học --</option>
                    {subjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="class_id" className="form-label">
                    Lớp học
                  </label>
                  <select
                    className="form-select"
                    id="class_id"
                    name="class_id"
                    value={newAssignment.class_id}
                    onChange={handleClassChange}
                    required
                    disabled={!newAssignment.subject || error}
                  >
                    <option value="">-- Chọn lớp học --</option>
                    {classes.map((cls) => (
                      <option
                        key={cls.id}
                        value={cls.id}
                        disabled={isClassDisabled(cls.id)}
                      >
                        {cls.class_name}{" "}
                        {isClassDisabled(cls.id) ? "(Đã đăng ký bởi bạn)" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedClassDetails && (
                  <div className="mb-3">
                    <h5>
                      <strong>Thông tin lớp học</strong>
                    </h5>
                    <p>
                      <strong>Tên lớp:</strong>{" "}
                      {selectedClassDetails.class_name}
                    </p>
                    <p>
                      <strong>Ngày bắt đầu:</strong>{" "}
                      {formatDate(selectedClassDetails.start_date)}
                    </p>
                    <p>
                      <strong>Ngày kết thúc:</strong>{" "}
                      {formatDate(selectedClassDetails.end_date)}
                    </p>
                    <p>
                      <strong>Thời gian:</strong>{" "}
                      {selectedClassDetails.start_time} -{" "}
                      {selectedClassDetails.end_time}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={
                    !newAssignment.class_id || !selectedClassDetails || error
                  }
                >
                  Đăng ký
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                Lớp đã đăng ký (Môn: {newAssignment.subject || "Chưa chọn"})
              </h3>
            </div>
            <div className="card-body">
              {registeredClasses.length === 0 ? (
                <div className="alert alert-warning">
                  Chưa có lớp nào được đăng ký cho môn này
                </div>
              ) : (
                <ul className="list-group">
                  {registeredClasses.map((cls) => (
                    <li key={cls.class_id} className="list-group-item">
                      <strong>{cls.class_name}</strong>
                      <br />
                      <strong>Ngày bắt đầu:</strong>{" "}
                      {formatDate(cls.start_date)}
                      <br />
                      <strong>Ngày kết thúc:</strong> {formatDate(cls.end_date)}
                      <br />
                      <strong>Thời gian:</strong> {cls.start_time} -{" "}
                      {cls.end_time}
                      <br />
                      <strong>Giáo viên:</strong>{" "}
                      {cls.teachers?.join(", ") || teacher.fullName}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherAssignments;
