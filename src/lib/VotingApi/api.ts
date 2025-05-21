import API from "../axios";

export const getAll = async (token: string) => {
  try {
    const response = await API.get("/voting/getAll", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch users");
  }
};

export const addnominee = async (
  userData: {
    firstname: string;
    lastname: string;
    role: string;
    email: string;
    streetAddress?: string;
  },
  token: string
) => {
  try {
    const response = await API.post("/user/add-member", userData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};

export const voteCandidate = async (nomineeId: number, token: string) => {
  try {
    const response = await API.post("/user/add-member", nomineeId, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};
