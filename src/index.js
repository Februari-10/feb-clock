const zones = [
  { city: "Baker Island", timeZone: "Etc/GMT+12" },
  { city: "Pago Pago", timeZone: "Pacific/Pago_Pago" },
  { city: "Honolulu", timeZone: "Pacific/Honolulu" },
  { city: "Anchorage", timeZone: "America/Anchorage" },
  { city: "Los Angeles", timeZone: "America/Los_Angeles" },
  { city: "Denver", timeZone: "America/Denver" },
  { city: "Mexico City", timeZone: "America/Mexico_City" },
  { city: "New York", timeZone: "America/New_York" },
  { city: "Caracas", timeZone: "America/Caracas" },
  { city: "Buenos Aires", timeZone: "America/Argentina/Buenos_Aires" },
  { city: "South Georgia", timeZone: "Atlantic/South_Georgia" },
  { city: "Azores", timeZone: "Atlantic/Azores" },
  { city: "London", timeZone: "Europe/London" },
  { city: "Stockholm", timeZone: "Europe/Stockholm" },
  { city: "Athens", timeZone: "Europe/Athens" },
  { city: "Moscow", timeZone: "Europe/Moscow" },
  { city: "Dubai", timeZone: "Asia/Dubai" },
  { city: "Karachi", timeZone: "Asia/Karachi" },
  { city: "New Delhi", timeZone: "Asia/Kolkata" },
  { city: "Dhaka", timeZone: "Asia/Dhaka" },
  { city: "Bangkok", timeZone: "Asia/Bangkok" },
  { city: "Beijing", timeZone: "Asia/Shanghai" },
  { city: "Tokyo", timeZone: "Asia/Tokyo" },
  { city: "Adelaide", timeZone: "Australia/Adelaide" },
  { city: "Sydney", timeZone: "Australia/Sydney" },
  { city: "Nouméa", timeZone: "Pacific/Noumea" },
  { city: "Auckland", timeZone: "Pacific/Auckland" },
  { city: "Apia", timeZone: "Pacific/Apia" },
  { city: "Kiritimati", timeZone: "Pacific/Kiritimati" }
];

const container = document.getElementById("timeContainer");

zones.forEach(z => {
  const div = document.createElement("div");
  div.className = "timezone";
  div.innerHTML = `
    <div class="city">${z.city}</div>
    <div class="clock" id="${z.timeZone.replace(/\//g, '-')}"></div>
  `;
  container.appendChild(div);
});

function getUTCOffsetHours(timeZone) {
  const now = new Date();
  const tzString = now.toLocaleString("en-US", { timeZone: timeZone, hour12: false });
  const tzDate = new Date(tzString);
  return (tzDate.getTime() - now.getTime()) / 3600000;
}

function updateClocks() {
  const now = new Date();

  zones.forEach(z => {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: z.timeZone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    });

    const timeString = formatter.format(now);

    const offset = getUTCOffsetHours(z.timeZone);
    const sign = offset >= 0 ? "+" : "-";
    const hours = String(Math.floor(Math.abs(offset))).padStart(2, "0");
    const minutes = String(Math.round((Math.abs(offset) % 1) * 60)).padStart(2, "0");
    const utcOffset = `UTC${sign}${hours}:${minutes}`;

    document.getElementById(z.timeZone.replace(/\//g, '-')).textContent =
      `${timeString} (${utcOffset})`;
  });
}

updateClocks();
setInterval(updateClocks, 1000);

let secondsElapsed = 0;
const timerDiv = document.getElementById("sessionTimer");

function updateSessionTimer() {
  secondsElapsed++;
  const hours = String(Math.floor(secondsElapsed / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((secondsElapsed % 3600) / 60)).padStart(2, '0');
  const seconds = String(secondsElapsed % 60).padStart(2, '0');
  timerDiv.textContent = `Time on site: ${hours}:${minutes}:${seconds}`;
}

setInterval(updateSessionTimer, 1000);
