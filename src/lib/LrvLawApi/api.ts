import API from "../axios";

export const addLrvlaw = async (formData: FormData, token: string) => {
  try {
    const res = await API.post("/lrvLaw/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error: any) {
    throw new Error(error.res?.data?.message || "Upload Error");
  }
};

export const getLrvlaws = async (token: string) => {
  try {
    const response = await API.get("/lrvLaw/getAll");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch users");
  }
};


export const updateLrvlaw = async (formData: FormData, token: string) => {
  try {
    const response = await API.put("/lrvLaw/update", formData, {
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

export const deleteLrvlaw = async (id: string, token: string) => {
  try {
    const response = await API.delete(`/lrvLaw/delete?id=${id}`, {
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
