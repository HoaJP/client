import api from "./api";

const attendanceService = {
  getTeacherAttendance: async (teacherId) => {
    try {
      const response = await api.get(`/attendance/teacher/${teacherId}`);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching attendance for teacher ${teacherId}:`,
        error
      );
      throw error;
    }
  },

  markAttendance: async (attendanceData) => {
    try {
      const response = await api.post("/attendance", attendanceData);
      return response.data;
    } catch (error) {
      console.error("Error marking attendance:", error);
      throw error;
    }
  },

  calculatePayroll: async (payrollData) => {
    try {
      const response = await api.post(
        "/attendance/payroll/calculate",
        payrollData
      );
      return response.data;
    } catch (error) {
      console.error("Error calculating payroll:", error);
      throw error;
    }
  },

  getTeacherPayroll: async (teacherId) => {
    try {
      const response = await api.get(
        `/attendance/payroll/teacher/${teacherId}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching payroll for teacher ${teacherId}:`, error);
      throw error;
    }
  },
};

export default attendanceService;
