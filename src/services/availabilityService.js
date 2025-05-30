// import api from "./api";

// const availabilityService = {
//   getTeacherAssignments: async (teacherId) => {
//     try {
//       const response = await api.get(
//         `/availability/assignments/teacher/${teacherId}`
//       );
//       return response.data;
//     } catch (error) {
//       console.error(
//         `Error fetching assignments for teacher ${teacherId}:`,
//         error
//       );
//       throw error;
//     }
//   },

//   getSubjects: async () => {
//     try {
//       const response = await api.get("/availability/subjects");
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching subjects:", error);
//       throw error;
//     }
//   },

//   getClassesBySubject: async (subject) => {
//     try {
//       const response = await api.get(`/availability/classes/${subject}`);
//       return response.data;
//     } catch (error) {
//       console.error(`Error fetching classes for subject ${subject}:`, error);
//       throw error;
//     }
//   },

//   getRegisteredClassesBySubject: async (subject) => {
//     try {
//       const response = await api.get(`/availability/registered/${subject}`);
//       return response.data;
//     } catch (error) {
//       console.error(
//         `Error fetching registered classes for subject ${subject}:`,
//         error
//       );
//       throw error;
//     }
//   },

//   getClassDetails: async (id) => {
//     try {
//       const response = await api.get(`/availability/class/${id}`);
//       return response.data;
//     } catch (error) {
//       console.error(`Error fetching class details for id ${id}:`, error);
//       throw error;
//     }
//   },

//   createAssignment: async (assignmentData) => {
//     try {
//       const response = await api.post(
//         "/availability/assignments",
//         assignmentData
//       );
//       return response.data;
//     } catch (error) {
//       console.error("Error creating assignment:", error);
//       throw error;
//     }
//   },

//   getAllAssignments: async () => {
//     try {
//       const response = await api.get("/availability/assignments");
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching all assignments:", error);
//       throw error;
//     }
//   },

//   deleteAssignment: async (teacherId, classId) => {
//     try {
//       const response = await api.delete(
//         `/availability/assignments/${teacherId}/${classId}`
//       );
//       return response.data;
//     } catch (error) {
//       console.error(
//         `Error deleting assignment for teacher ${teacherId} and class ${classId}:`,
//         error
//       );
//       throw error;
//     }
//   },
// };

// export default availabilityService;

import api from "./api";

const availabilityService = {
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

  getSubjects: async () => {
    try {
      const response = await api.get("/availability/subjects");
      return response.data;
    } catch (error) {
      console.error("Error fetching subjects:", error);
      throw error;
    }
  },

  getClassesBySubject: async (subject) => {
    try {
      const response = await api.get(`/availability/classes/${subject}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching classes for subject ${subject}:`, error);
      throw error;
    }
  },

  getRegisteredClassesBySubject: async (subject) => {
    try {
      const response = await api.get(`/availability/registered/${subject}`);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching registered classes for subject ${subject}:`,
        error
      );
      throw error;
    }
  },

  getClassDetails: async (id) => {
    try {
      const response = await api.get(`/availability/class/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching class details for id ${id}:`, error);
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

  getAllAssignments: async () => {
    try {
      const response = await api.get("/availability/assignments");
      return response.data;
    } catch (error) {
      console.error("Error fetching all assignments:", error);
      throw error;
    }
  },

  deleteAssignment: async (teacherId, classId) => {
    try {
      const response = await api.delete(
        `/availability/assignments/${teacherId}/${classId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error deleting assignment for teacher ${teacherId} and class ${classId}:`,
        error
      );
      throw error;
    }
  },
};

export default availabilityService;