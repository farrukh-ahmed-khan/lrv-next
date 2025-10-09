import API from "../axios";

export const getLibrarys = async () => {
  const res = await API.get("/gallery/getAll", {
    // headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const createLibrary = async (libraryname: string, token: string) => {
  const res = await API.post(
    "/gallery/Add",
    { libraryname },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const deleteLibrary = async (libraryId: string, token: string) => {
  const res = await API.delete(`/gallery/delete`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: { libraryId },
  });
  return res.data;
};

export const uploadImageToLibrary = async (
  formData: FormData,
  token: string
) => {
  const response = await API.post(`/gallery/upload`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteUploadimage = async (
  libraryId: string,
  imageUrl: string,
  token: string
) => {
  const res = await API.delete(`/events/deleteImages`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      libraryId,
      imageUrl,
    },
  });
  return res.data;
};
