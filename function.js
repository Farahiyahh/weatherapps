
let weather = {
    "apikey": "01963741fc0e99a7acde56b46b625383",
    fetchWeather: function(city) {
        fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + this.apikey)
            .then((response) => response.json())
            .then((data) => {
                this.displayWeather(data);
                this.fetchHourlyForecast(city);
            })
            .catch(error => {
                console.error('Error fetching current weather: ', error);
                alert('Error fetching current weather data. Please try again.');
            });
    },

    fetchHourlyForecast: function(city) {
        fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=metric&appid=" + this.apikey)
            .then((response) => response.json())
            .then((data) => this.displayHourlyForecast(data.list))
            .catch(error => {
                console.error('Error fetching current forecast data: ', error);
                alert('Error fetching current forecast data. Please try again.');
            });
    },

    displayWeather: function(data) {
        const { name } = data;
        const { icon, description } = data.weather[0];
        const { temp, humidity } = data.main;
        const { speed } = data.wind;
        console.log(name, icon, description, temp, humidity, speed);
        document.querySelector(".city").innerText = "Weather in " + name;
        document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = temp + "°C";
        document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
        document.querySelector(".wind").innerText = "Wind speed: " + speed + "km/h";
        document.querySelector(".weather").classList.remove("loading");
        document.body.style.backgroundImage = "url('https://source.unsplash.com/1600x900/?" + name + "')";
    },

    search: function() {
        this.fetchWeather(document.querySelector(".search-bar").value);
    },

    displayHourlyForecast: function(hourlyData) {
        const hourlyForecastDiv = document.querySelector('.hourly-forecast');
        hourlyForecastDiv.innerHTML = '';
        const next24hours = hourlyData.slice(0, 5);

        next24hours.forEach(item => {
            const dateTime = new Date(item.dt * 1000);
            const hour = dateTime.getHours();
            const temp = item.main.temp;
            const iconCode = item.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

            const hourlyItem = document.createElement('div');
            hourlyItem.classList.add('hourly-item');
            hourlyItem.innerHTML = `
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temp}°C</span>
            `;

            hourlyForecastDiv.appendChild(hourlyItem);
        });
    }
};

document.querySelector("#searchButton").addEventListener("click", function() {
    weather.search();
});

document.querySelector(".search-bar").addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        weather.search();
    }
});

weather.fetchWeather("Kuching");
