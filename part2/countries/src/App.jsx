import { useState, useEffect } from "react";
import axios from "axios";
const api_key = import.meta.env.VITE_API_KEY;

const CountryInfo = ({ country }) => {
  const capitalCoordinates = country.capitalInfo.latlng.join(",");

  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    axios
      .get(
        `http://api.weatherapi.com/v1/current.json?q=${capitalCoordinates}&key=${api_key}`
      )
      .then((response) => {
        setWeather(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching weather data:", err);
        setLoading(false);
      });
  }, [capitalCoordinates]);

  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>Capital: {country.capital}</p>
      <p>Area: {country.area}</p>
      <p>Languages:</p>
      <ul>
        {Object.entries(country.languages).map(([key, value]) => (
          <li key={key}>{value}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={country.flags.alt} />
      <h2>Weather in {country.capital}</h2>
      {loading && <p>Loading weather data...</p>}
      {weather && (
        <div>
          <p>Temperature: {weather.current.temp_c} °C</p>
          <p>Condition: {weather.current.condition.text}</p>
          <img
            src={weather.current.condition.icon}
            alt={weather.current.condition.text}
          />
          <p>Wind speed: {weather.current.wind_kph} km/h</p>
        </div>
      )}
    </div>
  );
};

const Countries = ({ countries, handleShowBtn }) => {
  if (!countries || countries.length === 0) return null;

  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  } else if (countries.length > 1) {
    return (
      <ul>
        {countries.map((c) => {
          return (
            <div key={c.name.common}>
              <li>{c.name.common}</li>
              <button value={c.name.common} onClick={handleShowBtn}>
                {" "}
                show
              </button>
            </div>
          );
        })}
      </ul>
    );
  } else {
    const country = countries[0];
    return <CountryInfo country={country} />;
  }
};

function App() {
  const [value, setValue] = useState("");
  const [countries, setCountries] = useState(null);
  const [filteredCountries, setFilteredCountries] = useState([]);

  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => {
        setCountries(response.data);
      });
  }, []);

  const handleCountry = (event) => {
    const inputValue = event.target.value;
    setValue(inputValue);

    if (inputValue.length > 0 && countries) {
      const matches = countries.filter((c) =>
        c.name.common.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredCountries(matches);
    } else {
      setFilteredCountries([]);
    }
  };

  const handleShowBtn = (event) => {
    const countryToShow = countries.filter(
      (c) => c.name.common.toLowerCase() === event.target.value.toLowerCase()
    );
    setFilteredCountries(countryToShow);
  };
  return (
    <>
      <div>
        find countries <input value={value} onChange={handleCountry} />
      </div>
      <div>
        <Countries
          countries={filteredCountries}
          handleShowBtn={handleShowBtn}
        />
      </div>
    </>
  );
}

export default App;
