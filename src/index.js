const container = document.getElementById("timeContainer");
const searchInput = document.getElementById("citySearch");

let zones = []; 
let displayedZones = []; 

function getUTCOffsetHours(timeZone) {
  const now = new Date();
  const tzString = now.toLocaleString("en-US", { timeZone, hour12: false });
  const tzDate = new Date(tzString);
  return (tzDate.getTime() - now.getTime()) / 3600000;
}

function createClock(z) {
  const div = document.createElement("div");
  div.className = "timezone";
  div.innerHTML = `
    <div class="city">${z.city}</div>
    <div class="clock" id="${z.timeZone.replace(/\//g, '-')}"></div>
  `;
  container.appendChild(div);
}

function updateClocks() {
  const now = new Date();
  displayedZones.forEach(z => {
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
    const clockDiv = document.getElementById(z.timeZone.replace(/\//g, '-'));
    if (clockDiv) clockDiv.textContent = `${timeString} (${utcOffset})`;
  });
}

fetch('./src/defaultZones.json')
  .then(res => res.json())
  .then(data => {
    zones = data;
    displayedZones = [...zones];
    container.innerHTML = '';
    displayedZones.forEach(createClock);
    updateClocks();
  })
  .catch(err => console.error("Failed to load defaultZones.json:", err));

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

searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase().trim();

  if (!query) {
    displayedZones = [...zones];
    container.innerHTML = '';
    displayedZones.forEach(createClock);
    updateClocks();
    return;
  }

  fetch('./src/cities.json')
    .then(res => res.json())
    .then(data => {
      const match = data.find(c => c.city.toLowerCase().includes(query));
      if (match) {
        displayedZones = [match];
        container.innerHTML = '';
        createClock(match);
        updateClocks();
      }
    })
    .catch(err => console.error("Failed to fetch cities.json:", err));
});
