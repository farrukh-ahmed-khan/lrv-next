import API from "../axios";

// Register a new user
export const uploadContactForms = async (userData: {
  fullName: string;
  email: string;
  phone?: string;
  message?: string;
}) => {
  try {
    const response = await API.post("/contact", userData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};

export const getContactForms = async () => {
  try {
    const response = await API.get("/contact");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch users");
  }
};

export const deleteContactForms = async (id: string) => {
  try {
    const response = await API.delete(`/contact/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch users");
  }
};
