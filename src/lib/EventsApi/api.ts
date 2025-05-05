import API from "../axios";


export const getEvents = async (token: string) => {
    const res = await API.get("/events/getAll", {
        headers: { Authorization: `Bearer ${token}` }
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
      "/api/events/AddDescription",
      { eventId, description },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  };