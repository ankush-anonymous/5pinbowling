export const getCurrentDate = (): Date => {
  return new Date();
};

export const formatDateForAPI = (date: Date): string => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export const generateTimeSlots = (startTime: string, endTime: string): string[] => {
  const slots: string[] = [];
  const startHour = parseInt(startTime.split(":")[0], 10);
  const endHour = parseInt(endTime.split(":")[0], 10);

  for (let i = startHour; i < endHour; i++) {
    const time = `${i.toString().padStart(2, "0")}:00`;
    slots.push(time);
  }
  return slots;
};

export const isSlotInPast = (dateString: string, time: string): boolean => {
  const now = new Date();
  const slotDateTime = new Date(`${dateString}T${time}:00`);
  
  // Check if the slot time is valid
  if (isNaN(slotDateTime.getTime())) {
    return false;
  }
  
  return slotDateTime < now;
};
