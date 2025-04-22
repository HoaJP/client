import api from "./api";

const teacherService = {
  getAllTeachers: async () => {
    try {
      const response = await api.get("/teachers");
      return response.data;
    } catch (error) {
      console.error("Error fetching teachers:", error);
      throw error;
    }
  },

  getTeacher: async (id) => {
    try {
      const response = await api.get(`/teachers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching teacher with id ${id}:`, error);
      throw error;
    }
  },

  createTeacher: async (teacherData) => {
    try {
      const response = await api.post("/teachers", teacherData);
      return response.data;
    } catch (error) {
      console.error("Error creating teacher:", error);
      throw error;
    }
  },

  updateTeacher: async (id, teacherData) => {
    try {
      const response = await api.put(`/teachers/${id}`, teacherData);
      return response.data;
    } catch (error) {
      console.error(`Error updating teacher with id ${id}:`, error);
      throw error;
    }
  },

  deleteTeacher: async (id) => {
    try {
      const response = await api.delete(`/teachers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting teacher with id ${id}:`, error);
      throw error;
    }
  },
};

export default teacherService;
