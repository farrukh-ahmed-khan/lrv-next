import API from "../axios";

export const getEvents = async () => {
  const res = await API.get("/upcoming-events/getAll", {
    // headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const RsvpEvents = async () => {
  const res = await API.get("/upcoming-events/rsvp/get", {
    // headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const createEvent = async (
  eventname: string,
  date: string,
  description: string,
  image: File, // <-- single file
  token: string
) => {
  const formData = new FormData();
  formData.append("eventname", eventname);
  formData.append("date", date);
  formData.append("description", description);
  formData.append("image", image); // only one image

  const res = await API.post("/upcoming-events/add", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const editEvent = async (
  eventId: string,
  eventname: string,
  date: string,
  description: string,
  image: File | null,
  token: string
) => {
  const formData = new FormData();
  formData.append("eventname", eventname);
  formData.append("date", date);
  formData.append("description", description);

  if (image) {
    formData.append("image", image);
  }

  const res = await API.put(`/upcoming-events/edit/${eventId}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const deleteEvent = async (eventId: string, token: string) => {
  const res = await API.delete(`/upcoming-events/delete`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: { eventId },
  });
  return res.data;
};
