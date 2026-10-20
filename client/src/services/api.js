const BASE_URL = "https://naveen-academy-0c7k.onrender.com/api";

// 0. Director Login
export const loginAPI = async (credentials) => {
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    return await res.json();
  } catch (error) {
    console.error("Login API error:", error);
    return { success: false, message: "Cannot connect to server." };
  }
};

// 1. Fetch Students
export const fetchStudentsAPI = async () => {
  try {
    const res = await fetch(`${BASE_URL}/students`);
    return await res.json();
  } catch (error) {
    console.error("Fetch students error:", error);
    return { success: false, data: [] };
  }
};

// 2. Enroll Student
export const enrollStudentAPI = async (studentData) => {
  try {
    const res = await fetch(`${BASE_URL}/students/enroll`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(studentData),
    });
    return await res.json();
  } catch (error) {
    console.error("Enroll student error:", error);
    return { success: false, message: error.message };
  }
};

// 3. Collect Fee
export const payFeeAPI = async (studentId, feeDetails) => {
  try {
    const res = await fetch(`${BASE_URL}/students/${studentId}/fee`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(feeDetails),
    });
    return await res.json();
  } catch (error) {
    console.error("Pay fee error:", error);
    return { success: false, message: error.message };
  }
};

// 4. Update Student Details
export const updateStudentAPI = async (studentId, updatedData) => {
  try {
    const res = await fetch(`${BASE_URL}/students/${studentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });
    return await res.json();
  } catch (error) {
    console.error("Update student error:", error);
    return { success: false, message: error.message };
  }
};

// 5. Delete Student Record
export const deleteStudentAPI = async (studentId) => {
  try {
    const res = await fetch(`${BASE_URL}/students/${studentId}`, {
      method: "DELETE",
    });
    return await res.json();
  } catch (error) {
    console.error("Delete student error:", error);
    return { success: false, message: error.message };
  }
};

// 6. Dashboard Stats
export const fetchDashboardStatsAPI = async () => {
  try {
    const res = await fetch(`${BASE_URL}/students`);
    const result = await res.json();

    if (result && result.success && Array.isArray(result.data)) {
      const all = result.data;
      const totalStudents = all.length;

      const paidStudents = all.filter((s) => {
        const hasHistoryPaid = s.feeHistory?.some(
          (f) =>
            (f.month?.toLowerCase().includes("oct") || f.status === "Paid") &&
            f.status === "Paid"
        );
        return s.feeStatus === "Paid" || hasHistoryPaid;
      });

      const unpaidStudents = all.filter((s) => !paidStudents.includes(s));

      const monthlyRevenue = paidStudents.reduce(
        (sum, s) => sum + (Number(s.monthlyFee) || 0),
        0
      );

      const pendingDues = unpaidStudents.reduce(
        (sum, s) => sum + (Number(s.monthlyFee) || 0),
        0
      );

      return {
        success: true,
        stats: {
          totalStudents,
          monthlyRevenue,
          pendingDues,
          pendingCount: unpaidStudents.length,
        },
      };
    }
    return {
      success: false,
      stats: { totalStudents: 0, monthlyRevenue: 0, pendingDues: 0, pendingCount: 0 },
    };
  } catch (error) {
    return {
      success: false,
      stats: { totalStudents: 0, monthlyRevenue: 0, pendingDues: 0, pendingCount: 0 },
    };
  }
};

// 7. Notices APIs
export const fetchNoticesAPI = async () => {
  try {
    const res = await fetch(`${BASE_URL}/notices`);
    return await res.json();
  } catch (error) {
    console.error("Fetch notices error:", error);
    return { success: false, data: [] };
  }
};

export const createNoticeAPI = async (noticeData) => {
  try {
    const res = await fetch(`${BASE_URL}/notices/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(noticeData),
    });
    return await res.json();
  } catch (error) {
    console.error("Create notice error:", error);
    return { success: false, message: error.message };
  }
};

export const deleteNoticeAPI = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/notices/${id}`, {
      method: "DELETE",
    });
    return await res.json();
  } catch (error) {
    console.error("Delete notice error:", error);
    return { success: false, message: error.message };
  }
};

// 8. Notes & Study Material APIs
export const fetchNotesAPI = async (studentClass = "") => {
  try {
    const url = studentClass && studentClass !== "All"
      ? `${BASE_URL}/notes?studentClass=${encodeURIComponent(studentClass)}`
      : `${BASE_URL}/notes`;
    const res = await fetch(url);
    return await res.json();
  } catch (error) {
    console.error("Fetch notes error:", error);
    return { success: false, data: [] };
  }
};

export const createNoteAPI = async (noteData) => {
  try {
    const res = await fetch(`${BASE_URL}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(noteData),
    });
    return await res.json();
  } catch (error) {
    console.error("Create note error:", error);
    return { success: false, message: error.message };
  }
};

export const deleteNoteAPI = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/notes/${id}`, {
      method: "DELETE",
    });
    return await res.json();
  } catch (error) {
    console.error("Delete note error:", error);
    return { success: false, message: error.message };
  }
};