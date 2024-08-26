// console.log('hello');
// const API_KEY = "95d11df7f13ba108ca3eea0ec342ba6e";


// async function showWeather(){
//     let city = "hathras";
    // const responce = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

//     const data = await responce.json();
//     console.log("weather data:->" + data);

//     let newPara = document.createElement('p');
//     newPara.textContent = `${data?.main?.temp.toFixed()}℃`

//     document.body.appendChild(newPara);
// };

// showWeather();

/* start   */

const userTab = document.querySelector("[data-userweather]");
const searchTab = document.querySelector("[data-searchweather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");

const searchForm = document.querySelector("[data-searchform]");
const loadingScreen = document.querySelector(".loading-container");


const userInfoContainer = document.querySelector(".user-info-container");


// initialy variable need
let oldTab = userTab;

const API_Key = "eb5e6d94f2c9781718bf3393b780949c";
oldTab.classList.add("current-tab");

function switchTab(newTab) {

    if (newTab != oldTab) {
        oldTab.classList.remove("current-tab");

        oldTab = newTab;
        oldTab.classList.add("current-tab");


        if (!searchForm.classList.contains("active")) {
            // kya search form wala container is invisible ,if yes then make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            // main pahle search wale tab pr the ,ab your weather tab visible karna ha 

            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
           
            // ab main your weather tab me agya hu ,toh eather bhui display karna padega ,so lets check local storage first 
            getFromSessionStorage();
        }
    }

};


userTab.addEventListener("click",()=>{
     //  pass clicked tab as input parameter
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    //  pass clicked tab as input parameter
    switchTab(searchTab);
});

// check if coordinates are already preant in session storage

function getFromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if (!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }

};

async function fetchUserWeatherInfo(coordinates){
    const {Latitude, Longitude} = coordinates;
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");

    // API call 
    try {
        const responce = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${Latitude}&lon=${Longitude}&appid=${API_Key}&units=metric`);
        const data = await responce.json();
        loadingScreen.classList.remove("active");
        
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);

    }
    catch (err) {
        loadingScreen.classList.remove("active")

    }
};

function renderWeatherInfo(weatherInfo) {
    // firstly we have to fetch the elements

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    
    const weatherIcon = document.querySelector("[data-weatherIcon]");


    const temp = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windspeed]");

    const humidity = document.querySelector("[data-humidity]");

    const cloudiness = document.querySelector("[data-cloudiness]");


    // fetch value from weatherInfo object and put it UI elements

    cityName.innerText = weatherInfo?.name;

    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;

    desc.innerText = weatherInfo?.weather?.[0]?.description;
 

    weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;


    temp.innerText =`${weatherInfo?.main?.temp}℃` ;

    windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;

    humidity.innerText =  `${weatherInfo?.main?.humidity}%`; 

    cloudiness.innerText =  `${weatherInfo?.clouds?.all}%`;  ;



};

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);

        } 
        else {
        // hw show an alert for no geolocation suppor available
        

    }
};

function showPosition(position) {
    const userCoordinates = {
        Latitude: position.coords.latitude,
        Longitude: position.coords.longitude,
    };
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

};


const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);



// fetch search Weather part

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if (cityName === "")
        return;
    else
    fetchSearchWeatherInfo(cityName);
     
});

 async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");


    try{
        const responce = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_Key}&units=metric`);

        const data =  await responce.json();
       
        loadingScreen.classList.remove("active");
        
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);


    }
    catch(err){


    }
    
    

 };




