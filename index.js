//api key
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

//event listener
cityInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    const cityToSearch = cityInput.value;
    getWeatherData(cityToSearch);
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

    if (response.ok === false) {
      alert("City not found. Please try again!");
      return;
    }

    const data = await response.json();

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

  let isDayTime = false;
  if (currentTime >= sunriseTime && currentTime < sunsetTime) {
    isDayTime = true;
  }

  cityName.innerText = name;
  mainTemp.innerText = temp + "°C";
  windSpeed.innerText = wind + "m/s";
  feelsLike.innerText = feels + "°";

  const dateObj = new Date();
  const days = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];
  const dayName = days[dateObj.getDay()];

  let hours = dateObj.getHours();
  let minutes = dateObj.getMinutes();
  let ampm = "AM";

  if (hours >= 12) {
    ampm = "PM";
  }
  if (hours > 12) {
    hours = hours - 12;
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
    sunTime.innerText = formatUnixTime(sunsetTime);
    setWeatherIcon(data.weather[0].id, true);
  } else {
    appScreen.classList.add("night-mode");
    greeting.innerText = "GOOD NIGHT";
    sunLabel.innerText = "SUNRISE";
    sunTime.innerText = formatUnixTime(sunriseTime);
    setWeatherIcon(data.weather[0].id, false);
  }
}

function formatUnixTime(unixTime) {
  const date = new Date(unixTime * 1000);
  let h = date.getHours();
  let m = date.getMinutes();
  if (h > 12) h = h - 12;
  if (h === 0) h = 12;
  if (m < 10) m = "0" + m;
  return h + ":" + m;
}

function setWeatherIcon(weatherId, isDay) {
  let emoji = "☁️";

  if (weatherId >= 200 && weatherId < 600) {
    emoji = "🌧️";
  } else if (weatherId >= 600 && weatherId < 700) {
    emoji = "❄️";
  } else if (weatherId === 800) {
    if (isDay) {
      emoji = "☀️";
    } else {
      emoji = "🌙";
    }
  } else if (weatherId > 800) {
    if (isDay) {
      emoji = "⛅";
    } else {
      emoji = "☁️";
    }
  }

  weatherEmoji.innerText = emoji;
}
