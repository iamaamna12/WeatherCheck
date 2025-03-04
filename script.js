const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const body = document.body;

async function getWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod !== 200) {
            alert("City not found. Please try again.");
            return;
        }

        // Update UI with weather data
        document.getElementById("city").innerText = data.name;
        updateTemperature(data.main.temp);
        document.getElementById("desc").innerText = data.weather[0].description;

        // 🌤 Change background based on weather condition
        changeBackground(data.weather[0].main);

        // 🎬 GSAP Animations
        gsap.from(".container", { duration: 1, opacity: 0, y: -20 });
        gsap.from("#temp", { duration: 1, scale: 0.5, opacity: 0, delay: 0.2 });
        gsap.from("#desc", { duration: 1.2, opacity: 0, delay: 0.5 });
        gsap.from("footer", { duration: 1, opacity: 0, y: 20, ease: "power2.out" });
        gsap.from(".socials a", { duration: 1, opacity: 0, y: 10, stagger: 0.2, ease: "power2.out" });

    } catch (error) {
        console.error("Error fetching weather data:", error);
        alert("Something went wrong. Please try again.");
    }
}

// Function to change background dynamically
function changeBackground(weather) {
    let bgImage;

    switch (weather) {
        case "Clear":
            bgImage = "url('images/clear-sky.jpg')";
            break;
        case "Clouds":
            bgImage = "url('images/cloudy.jpg')";
            break;
        case "Rain":
            bgImage = "url('images/rainy.jpg')";
            break;
        case "Snow":
            bgImage = "url('images/snowy.jpg')";
            break;
        case "Haze":
        case "Smoke":
            bgImage = "url('images/haze.jpg')";
            break;
        default:
            bgImage = "url('images/clear-sky.jpg')";
    }

    // Animate background change
    gsap.to(document.body, { 
        backgroundImage: bgImage, 
        backgroundSize: "cover", 
        backgroundPosition: "center center",
        duration: 1, 
        ease: "power2.inOut" 
    });
}

// Function to animate the default background
function animateDefaultBackground() {
    gsap.to("body", {
        backgroundPosition: "100% 100%",
        duration: 50,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
    });
}

// Call animation function on page load
animateDefaultBackground();

// Function to animate clouds
function animateClouds() {
    gsap.to("#cloud1", { x: "120vw", duration: 50, repeat: -1, ease: "linear" });
    gsap.to("#cloud2", { x: "120vw", duration: 65, repeat: -1, delay: 3, ease: "linear" });
    gsap.to("#cloud3", { x: "120vw", duration: 70, repeat: -1, delay: 5, ease: "linear" });
    gsap.to("#cloud4", { x: "120vw", duration: 65, repeat: -1, delay: 8, ease: "linear" });
    gsap.to("#cloud5", { x: "120vw", duration: 50, repeat: -1, delay: 10, ease: "linear" });
}

// Call function on page load
animateClouds();

// Function to update temperature with correct styling
function updateTemperature(newTemp) {
    document.getElementById("temp").innerHTML = `
        <span class="big-temp">${newTemp}</span>
        <span class="degree">°C</span>
    `;
}

const resetBtn = document.getElementById("resetBtn");

// Modify search function to show Reset button after first search
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeather(city);
        document.querySelector(".clouds").style.display = "none"; // Hide clouds
        resetBtn.style.display = "block"; // Show Reset button
    } else {
        alert("Please enter a city name.");
    }
});

// Also show Reset button when the user presses "Enter"
cityInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        const city = cityInput.value.trim();
        if (city) {
            getWeather(city);
            document.querySelector(".clouds").style.display = "none"; // Hide clouds
            resetBtn.style.display = "block"; // Show Reset button
        } else {
            alert("Please enter a city name.");
        }
    }
});

// Reset button functionality
resetBtn.addEventListener("click", () => {
    // Clear input field
    cityInput.value = "";

    // Reset UI elements
    document.getElementById("city").innerText = "Weather in..";
    document.getElementById("temp").innerText = " ";
    document.getElementById("desc").innerText = " ";

    // Restore default background
    gsap.to(document.body, { 
        backgroundImage: "url('images/clear-sky.jpg')", 
        duration: 1, 
        ease: "power2.inOut" 
    });

    // Show floating clouds again
    document.querySelector(".clouds").style.display = "block";

    // Hide Reset button again
    resetBtn.style.display = "none";

    // Animate container again
    gsap.from(".container", { duration: 1, opacity: 0, y: -20 });
});

