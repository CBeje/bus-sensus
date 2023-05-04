export function timeStamp(t) {
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let hour = t.getHours();
  let minutes = t.getMinutes();
  let date = t.getDate();
  let month = months[t.getMonth()];
  let year = t.getFullYear();

  return `${hour}:${minutes},on ${date} ${month} ${year}`;
}
