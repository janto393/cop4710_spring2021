import { Event } from "../types/eventTypes";
import { useState } from "react";

export const useEvent = () => {
  const [event, setEvent] = useState<Event | undefined>(undefined);

  return {
    event,
    setEvent,
  };
};
