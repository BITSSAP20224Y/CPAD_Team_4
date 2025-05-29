import DoctorAvailability from "../models/appointment_model.js";

const generate30MinSlots = (start = "10:00", end = "16:00") => {
    const slots = [];
    let [hour, minute] = start.split(":").map(Number);
    const [endHour, endMinute] = end.split(":").map(Number);
  
    while (hour < endHour || (hour === endHour && minute < endMinute)) {
      const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      slots.push({
        time,
        isBooked: false,
        patient: null
      });
  
      minute += 30;
      if (minute >= 60) {
        hour += 1;
        minute = 0;
      }
    }
  
    return slots;
  }


const createDoctorAvailabilitySlots = async (doctorId, date) => {
  const existing = await DoctorAvailability.findOne({ doctorId, date });
  if (existing) {
    throw new Error("Availability already exists for this doctor on this date.");
  }

  const availability = new DoctorAvailability({
    doctorId,
    date,
    slots: generate30MinSlots()
  });

  await availability.save();
  return availability;
}

export default createDoctorAvailabilitySlots;