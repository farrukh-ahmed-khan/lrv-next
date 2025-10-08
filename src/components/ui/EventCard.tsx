import { useState } from "react";
import axios from "axios";

// Define type for Event props
type EventType = {
  _id: string;
  eventname: string;
  description: string;
  date: string;
  image: string;
  myRSVP?: "attended" | "not attended" | null;
};

type EventCardProps = {
  event: EventType;
  token: string;
};

function EventCard({ event, token }: EventCardProps) {
  const [status, setStatus] = useState<"attended" | "not attended" | null>(
    event.myRSVP || null
  );

  const handleRSVP = async (choice: "attended" | "not attended") => {
    try {
      await axios.post(
        "/api/upcoming-events/rsvp",
        { eventId: event._id, status: choice },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus(choice);
    } catch (err) {
      console.error("RSVP failed:", err);
    }
  };

  return (
    <div className="event-card  my-5">
      <h3>{event.eventname}</h3>
      <p>{event.description}</p>
      <p>Date: {new Date(event.date).toLocaleDateString()}</p>
      <img src={event.image} alt={event.eventname} width="200" />

      <div>
        <button
          onClick={() => handleRSVP("attended")}
          disabled={status === "attended"}
        >
          Attending ✅
        </button>
        <button
          onClick={() => handleRSVP("not attended")}
          disabled={status === "not attended"}
        >
          Not Attending ❌
        </button>
      </div>
    </div>
  );
}

export default EventCard;
