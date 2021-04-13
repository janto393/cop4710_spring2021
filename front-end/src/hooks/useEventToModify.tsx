import { useState } from "react";
import { Event } from "../types/eventTypes";

export const useEventToModify = () => {
	const [eventToModify, setEventToModify] = useState<Event | undefined>(undefined);

	return {
		eventToModify,
		setEventToModify
	};
};
