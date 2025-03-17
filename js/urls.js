
const backend = "http://localhost:8080";

export const urlActivities = backend + "/activities";
export const urlLogin = backend + "/login";
export const urlReservationsById = (id) => backend + "/reservations/" + id;
export const urlReservations = backend + "/reservations";
export const urlTimeSlotsByDate = (date) => backend + "/activities/timeslots?date=" + date;