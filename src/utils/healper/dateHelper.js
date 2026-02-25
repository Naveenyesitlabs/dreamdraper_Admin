export const formatDateUSA = (dateValue, timestamp = false) => {
  if (!dateValue) return null;

  if (timestamp) {
    const date = new Date(dateValue);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');

    return `${month}/${day}/${year} ${hour}:${minute}`;


  } else {
    console.log('dateValue:', dateValue);
    const date = new Date(dateValue);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    console.log('day:', day, 'month:', month, 'year:', year);
    return `${month}/${day}/${year}`;
  }
};