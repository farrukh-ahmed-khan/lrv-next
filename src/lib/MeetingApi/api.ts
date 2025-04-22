import API from "../axios";

export const addMeeting = async (
  meetingData: {
    title: string;
    description: string;
  },
  token: string
) => {
  try {
    const res = await API.post("/meeting/add", meetingData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error: any) {
    throw new Error(error.res?.data?.message || "Upload Error");
  }
};

export const getMeetings = async (token: string) => {
  try {
    const response = await API.get("/meeting/getAll");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch users");
  }
};

// export const getNewsletter = async (token: string) => {
//   try {
//     const response = await API.get("/userInfo", {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return response.data;
//   } catch (error: any) {
//     throw new Error(error.response?.data?.message || "Failed to fetch users");
//   }
// };

export const updateMeeting = async (formData: FormData, token: string) => {
  try {
    const response = await API.put("/meeting/update", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to update newsletter"
    );
  }
};

export const deleteMeeting = async (id: string, token: string) => {
  try {
    const response = await API.delete(`/meeting/delete?id=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to delete newsletter"
    );
  }
};
