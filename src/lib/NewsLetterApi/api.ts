import API from "../axios";

export const addNewsletter = async (formData: FormData, token: string) => {
  try {
    const res = await API.post("/newsletter/upload", formData, {
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

export const getNewsletters = async (token: string) => {
  try {
    const response = await API.get("/newsletter/getAll");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch users");
  }
};

export const getNewsletter = async (token: string) => {
  try {
    const response = await API.get("/userInfo", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch users");
  }
};

export const updateNewsletter = async (formData: FormData, token: string) => {
  try {
    const response = await API.put("/newsletter/update", formData, {
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

export const deleteNewsletter = async (id: string, token: string) => {
  try {
    const response = await API.delete(`/newsletter/delete?id=${id}`, {
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
