import API from "../axios";

// Register a new user
export const registerUser = async (userData: {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  streetAddress?: string;
  phoneNumber?: string;
}) => {
  try {
    const response = await API.post("/auth/register", userData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};

// Login a user
export const loginUser = async (credentials: {
  email: string;
  password: string;
}) => {
  try {
    const response = await API.post("/auth/login", credentials);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

export const getUsers = async (token: string) => {
  try {
    const response = await API.get("/user/getUsers", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch users");
  }
};

export const getMembers = async (token: string) => {
  try {
    const response = await API.get("/user/getMembers", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch users");
  }
};

export const getUser = async (token: string) => {
  try {
    const response = await API.get("/user/userInfo", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch users");
  }
};

export const addMember = async (
  userData: {
    firstname: string;
    lastname: string;
    role: string;
    status: string;
    email: string;
    password: string;
    streetAddress?: string;
    phoneNumber?: string;
    ownerId?: string;
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

export const updateUserStatus = async (
  token: string,
  status: string,
  id: string
) => {
  try {
    const response = await API.put(
      `/updateStatus/${id}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch users");
  }
};

export const updateUserDuesStatus = async (
  token: string,
  paidStatus: string, 
  id: string
) => {
  try {
    const response = await API.put(
      `/dues/update-paid-status/${id}`,
      { paidStatus }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to update due status"
    );
  }
};

export const getAllUsers = async (token: string) => {
  try {
    const response = await API.get("/user/getAllUsers", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch users");
  }
};

export const forgetPassword = async (userData: { email: string }) => {
  try {
    const response = await API.post("/auth/forget", userData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};

export const resetPassword = async ({
  token,
  password,
}: {
  token: string;
  password: string;
}) => {
  try {
    const response = await API.post("/auth/reset-password", {
      token,
      password,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Password reset failed");
  }
};
