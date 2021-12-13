const wrapper = document.querySelector(".wrapper"),
      inputPart = wrapper.querySelector(".input-part"),
      infoTxt = inputPart.querySelector(".info-text"),
      inputField = inputPart.querySelector("input"),
      locationBtn = inputPart.querySelector("button"),
      wIcon = wrapper.querySelector(".weather-part img"),
      arrowBack = wrapper.querySelector("header i");

let api;
inputField.addEventListener("keyup", e => {
    // if user pressed enter btn and input value is not empty
    if(e.key == "Enter" && inputField.value != "") {
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener("click", () => {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
});

function onSuccess(position) {
    const {latitude, longitude} = position.coords; // getting latitude and longitude on user device from coords obj
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=2ecf8b9f6c971adb46a550b77dd72ad2`;
    fetchData();
}

function onError(error) {
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

function requestApi(city) {
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=2ecf8b9f6c971adb46a550b77dd72ad2`;
    fetchData();
}

function fetchData() {
    infoTxt.innerText = "Getting weather details...";
    infoTxt.classList.add("pending");
    // getting api response and returning it with parsing into js obj and in another
    // then function calling weatherDetails() function with passing api result as an argument 
    fetch(api).then(response => response.json()).then(result => weatherDetails(result));
}

function weatherDetails(info) {
    if (info.cod == "404") {
        infoTxt.classList.replace("pending", "error");
        infoTxt.innerText = `${inputField.value} isn't a valid city name`;
    } else {
        // let's get required properties value from the info object
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {feels_like, humidity, temp} = info.main;

        if (id == 800) {
            wIcon.src = "assets/images/WeatherIcons/clear.svg"
        } else if (id >= 200 && id <= 232) {
            wIcon.src = "assets/images/WeatherIcons/strom.svg"
        } else if (id >= 600 && id <= 622) {
            wIcon.src = "assets/images/WeatherIcons/snow.svg"
        } else if (id >= 701 && id <= 781) {
            wIcon.src = "assets/images/WeatherIcons/haze.svg"
        } else if (id >= 801 && id <= 804) {
            wIcon.src = "assets/images/WeatherIcons/cloud.svg"
        } else if ((id >= 300 && id <= 321) || id >= 500 && id <= 531) {
            wIcon.src = "assets/images/WeatherIcons/cloud.svg"
        }
        // let's pass value to a particular html element
        wrapper.querySelector(".temp .numb").innerText = Math.floor(temp);
        wrapper.querySelector(".weather").innerText = description;
        wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
        wrapper.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        wrapper.querySelector(".humidity span").innerText = `${humidity}`;
        console.log(temp);
        infoTxt.classList.remove("pending", "error");
        wrapper.classList.add("active");
        console.log(info);
    }
}

arrowBack.addEventListener("click", () => {
    wrapper.classList.remove("active")
});