import API from "../axios";


export const getEvents = async () => {
    const res = await API.get("/events/getAll", {
        // headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};

export const createEvent = async (eventname: string, token: string) => {
    const res = await API.post(
        "/events/Add",
        { eventname },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
};

export const addEventDescription = async (
    eventId: string,
    description: string,
    token: string
  ) => {
    const response = await API.post(
      "/events/AddDescription",
      { eventId, description },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  };

export const deleteEvent = async (eventId: string, token: string) => {
  const res = await API.delete(`/events/delete`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: { eventId }, 
  });
  return res.data;
};


export const uploadImageToEvent = async (
  eventId: string,
  formData: FormData,
  token: string
) => {
  const response = await API.post(
    `/events/upload`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};


