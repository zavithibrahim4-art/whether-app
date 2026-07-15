const apiKey = "5cb516159f08bb9a43343edd928d3feb";

const cityInput = document.getElementById("city-input");
const cityName = document.getElementById("city-name");
const dateTime = document.getElementById("date-time");
const mainTemp = document.getElementById("main-temp");
const greeting = document.getElementById("greeting");
const sunLabel = document.getElementById("sun-label");
const sunTime = document.getElementById("sun-time");
const windSpeed = document.getElementById("wind-speed");
const feelsLike = document.getElementById("feels-like");
const appScreen = document.getElementById("app-screen");
const weatherEmoji = document.getElementById("weather-emoji");

cityInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    const city = cityInput.value.trim();

    if (city !== "") {
      getWeatherData(city);
    }

    cityInput.value = "";
  }
});

async function getWeatherData(city) {
  try {
    const url =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&appid=" +
      apiKey +
      "&units=metric";

    const response = await fetch(url);

    if (!response.ok) {
      alert("City not found!");
      return;
    }

    const data = await response.json();

    console.log(data);

    updateUI(data);
  } catch (error) {
    console.log(error);
    alert("Something went wrong!");
  }
}

function updateUI(data) {
  const name = data.name;
  const temp = Math.round(data.main.temp);
  const wind = Math.round(data.wind.speed);
  const feels = Math.round(data.main.feels_like);

  const currentTime = data.dt;
  const sunriseTime = data.sys.sunrise;
  const sunsetTime = data.sys.sunset;

  const isDayTime =
    currentTime >= sunriseTime && currentTime < sunsetTime;

  cityName.innerText = name;
  mainTemp.innerText = temp + "°C";
  windSpeed.innerText = wind + " m/s";
  feelsLike.innerText = feels + "°";

  const cityDate = new Date((data.dt + data.timezone) * 1000);

  const days = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];

  const dayName = days[cityDate.getUTCDay()];

  let hours = cityDate.getUTCHours();
  let minutes = cityDate.getUTCMinutes();

  let ampm = "AM";

  if (hours >= 12) {
    ampm = "PM";
  }

  if (hours > 12) {
    hours -= 12;
  }

  if (hours === 0) {
    hours = 12;
  }

  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  dateTime.innerText = dayName + " " + hours + ":" + minutes + " " + ampm;

  if (isDayTime) {
    appScreen.classList.remove("night-mode");
    greeting.innerText = "GOOD MORNING";
    sunLabel.innerText = "SUNSET";
    sunTime.innerText = formatUnixTime(sunsetTime, data.timezone);
    setWeatherIcon(data.weather[0].id, true);
  } else {
    appScreen.classList.add("night-mode");
    greeting.innerText = "GOOD NIGHT";
    sunLabel.innerText = "SUNRISE";
    sunTime.innerText = formatUnixTime(sunriseTime, data.timezone);
    setWeatherIcon(data.weather[0].id, false);
  }
}

function formatUnixTime(unixTime, timezone) {
  const date = new Date((unixTime + timezone) * 1000);

  let hours = date.getUTCHours();
  let minutes = date.getUTCMinutes();

  let ampm = "AM";

  if (hours >= 12) {
    ampm = "PM";
  }

  if (hours > 12) {
    hours -= 12;
  }

  if (hours === 0) {
    hours = 12;
  }

  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  return hours + ":" + minutes + " " + ampm;
}

function setWeatherIcon(weatherId, isDay) {
  let emoji = "☁️";

  if (weatherId >= 200 && weatherId < 600) {
    emoji = "🌧️";
  } else if (weatherId >= 600 && weatherId < 700) {
    emoji = "❄️";
  } else if (weatherId === 800) {
    emoji = isDay ? "☀️" : "🌙";
  } else if (weatherId > 800) {
    emoji = isDay ? "⛅" : "☁️";
  }

  weatherEmoji.innerText = emoji;
}