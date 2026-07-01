export const getProjectDateRange = (startDate: string, duration: number) => {
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(startDateObj);
  endDateObj.setDate(startDateObj.getDate() + duration * 7);

  return { startDate: startDateObj, endDate: endDateObj };
};
