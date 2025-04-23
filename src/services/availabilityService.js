import api from "./api";

const availabilityService = {
  getTeacherAvailability: async (teacherId) => {
    try {
      const response = await api.get(`/availability/teacher/${teacherId}`);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching availability for teacher ${teacherId}:`,
        error
      );
      throw error;
    }
  },

  addAvailability: async (availabilityData) => {
    try {
      const response = await api.post("/availability", availabilityData);
      return response.data;
    } catch (error) {
      console.error("Error adding availability:", error);
      throw error;
    }
  },

  deleteAvailability: async (id) => {
    try {
      const response = await api.delete(`/availability/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting availability with id ${id}:`, error);
      throw error;
    }
  },

  getTeacherAssignments: async (teacherId) => {
    try {
      const response = await api.get(
        `/availability/assignments/teacher/${teacherId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching assignments for teacher ${teacherId}:`,
        error
      );
      throw error;
    }
  },

  createAssignment: async (assignmentData) => {
    try {
      const response = await api.post(
        "/availability/assignments",
        assignmentData
      );
      return response.data;
    } catch (error) {
      console.error("Error creating assignment:", error);
      throw error;
    }
  },
  getAssignment: async (id) => {
    try {
      const response = await api.get(`/availability/assignments/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching assignment ${id}:`, error);
      throw error;
    }
  },
};

export default availabilityService;
