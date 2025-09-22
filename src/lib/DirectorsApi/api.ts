import API from "../axios";


export const getDirectors = async () => {
    const res = await API.get("/directors/getAll", {
        // headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};

export const createDirector = async (
  directorname: string,
  designation: string,
  description: string,
  image: File, 
  token: string
) => {
  const formData = new FormData();
  formData.append("directorname", directorname);
  formData.append("designation", designation);
  formData.append("description", description);
  formData.append("image", image);

  const res = await API.post("/directors/add", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};



export const deleteEvent = async (directorId: string, token: string) => {
  const res = await API.delete(`/directors/delete`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: { directorId }, 
  });
  return res.data;
};



