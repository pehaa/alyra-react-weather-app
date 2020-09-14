# Weather App

## Step 0

```bash
npx create-react-app react-weather-app
cd react-weather-app
```

## Step 1 - src/index.js

installer et importer bootstrap5

```bash
yarn add bootstrap@next
```

```javascript
// src/index.js

import React from "react"
import ReactDOM from "react-dom"
import "bootstrap/dist/css/bootstrap.css"
import App from "./App"
// ... rien ne change ensuite
```

## public et public/index.html

Personnaliser (title, langue, meta, icons, manifest....)

## Components folder

Nous allons placer tous les components dans un nouveau dossier `components`. Voici la structure que nous allons créer :

```bash
src
├── App.css
├── App.js
├── components
│   └── Weather
│       └── index.js
├── index.css
├── index.js
├── logo.svg
├── serviceWorker.js
└── setupTests.js
```

## App.js

Pour l'instant nous allons afficher des conditions météo pour Paris. Mais dans la version finale, un formulaire permettra de choisir la destination. En prévision de cela, nous allons créer une state variable `city`

```javascript
/* src/App.js */
import React, { useState } from "react"
import Weather from "./components/Weather"

function App() {
  const [city, setCity] = useState("Paris")
  return (
    <div className="container my-4">
      <h1 className="display-3 text-center mb-4">Météo Actuelle</h1>
      <Weather city={city} />
    </div>
  )
}

export default App
```

**Attention** Ici, nous mettons `import Weather from "./components/Weather"`. Si `./components/Weather.js` n'est pas trouvé, `./components/Weather/index.js` va être cherché.

## Weather component

```javascript
import React, { useState, useEffect } from "react"
const APP_KEY = "..."

const Weather = ({ city }) => {
  const [conditions, setConditions] = useState({})
  const [description, setDescription] = useState("")
  const [iconID, setIconID] = useState("")
  const [location, setLocation] = useState("")

  useEffect(() => {
    const query = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APP_KEY}&units=metric&&lang=fr`
    fetch(query)
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
        throw new Error("météo untrouvable")
      })
      .then((data) => {
        console.log(data)
      })
      .catch((error) => {
        alert(error.message)
      })
  }, [city])

  return (
    <section className="text-center">
      <h2 className="mb-4">Conditions météo à Paris</h2>
    </section>
  )
}

export default Weather
```

Quelle informations de `data` allons nous utiliser ? Nous pouvons opter pour :

- ** conditions : **

```javascript
{
  feelsLike: Math.round(data.main.feels_like),
  mainTemp: Math.round(data.main.temp),
  humidity: data.main.humidity,
}
```

- ** description : ** `data.weather[0].description`
- ** icon : ** `data.weather[0].icon`
- ** location : ** `data.name`, `data.sys.country`

## .env

Ce n'est pas une bonne idée de laisser les clés API dans le fichier que nous partageons via github. Les variables globales, les clés sont souvent gardées dans un fichier `.env` dans la racine du projet (`.env` est inclue dans `.gitignore`)

```bash
touch .env
```

```
# .env
REACT_APP_OPENWEATHER_API_KEY= "votrekeyvientici"
```

Ensuite, dans `Weather.js` nous allons avoir accès à notre key en tant qu `process.env.REACT_APP_OPENWEATHER_API_KEY`

## Step 6 Décomposer Weather en plus de composants

Voici la structure des fichiers

```bash
src
├── App.js
├── components
│   ├── CityForm.js
│   └── Weather
│       ├── Description.js
│       ├── Humidity.js
│       ├── Icon.js
│       ├── Temperature.js
│       └── index.js
├── index.css
├── index.js
├── serviceWorker.js
└── setupTests.js
```

Notre compenent `Weather` devient

```javascript
// src/components/Weather/index.js

import React, { useState, useEffect } from "react"
import Icon from "./Icon"
import Description from "./Description"
import Temperature from "./Temperature"
import Humidity from "./Humidity"

const APP_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY

const Weather = ({ city }) => {
  const [conditions, setConditions] = useState({})
  const [description, setDescription] = useState("")
  const [iconID, setIconID] = useState("")
  const [location, setLocation] = useState("")

  useEffect(() => {
    const query = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APP_KEY}&units=metric&&lang=fr`
    fetch(query)
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
        console.log(response)
        throw new Error("météo untrouvable")
      })
      .then((data) => {
        setLocation(`${data.name}, ${data.sys.country}`)
        setConditions({
          feelsLike: Math.round(data.main.feels_like),
          mainTemp: Math.round(data.main.temp),
          humidity: data.main.humidity,
        })
        setDescription(data.weather[0].description)
        setIconID(data.weather[0].icon)
      })
      .catch((error) => {
        setLocation("")
        alert(error.message)
      })
  }, [city])
  return (
    <>
      {!!location && (
        <section className="text-center">
          <Icon iconID={iconID} />
          <h2 className="mb-4">Conditions météo à {location}</h2>
          <Description description={description} />
          <Temperature mainTemp={mainTemp} feelsLike={feelsLike} />
          <Humidity humidity={humidity} />
        </section>
      )}
    </>
  )
}

export default Weather
```

## Description

```javascript
// src/components/Weather/Description.js
import React from "react"

const Description = ({ description }) => {
  return <p>{description}</p>
}

export default Description
```

## Temperature

```javascript
// src/components/Weather/Temperature.js
import React from "react"

const Temperature = ({ mainTemp, feelsLike }) => {
  return (
    <p>
      <b>température</b> {mainTemp}&deg;C - ressentie {feelsLike}&deg;C
    </p>
  )
}

export default Temperature
```

## Icon

```javascript
// src/components/Weather/Temperature.js
import React from "react"

const Icon = ({ iconID }) => {
  return (
    !!iconID && (
      <img
        src={`http://openweathermap.org/img/wn/${iconID}@4x.png`}
        alt=""
        width="100"
        height="100"
      />
    )
  )
}

export default Icon
```

## Humidity

```javascript
// src/components/Weather/Humidity.js
import React from "react"
import "./humidity.css"

const Humidity = ({ humidity }) => {
  return (
    <>
      <p>
        <b>humidité</b> {humidity}%
      </p>
      <div
        className="humidity"
        style={{ backgroundSize: `${humidity}% auto` }}
      />
    </>
  )
}

export default Humidity
```

avec

```css
/* src/components/Weather/humidity.css */
.humidity {
  color: #1565c0;
  box-shadow: inset 0 0 0 1px white;
  height: 1rem;
  border: 1px solid;
  border-radius: 0.25rem;
  transition: 1s;
  background-image: linear-gradient(
    to right,
    currentcolor 100%,
    transparent 100%
  );
  background-size: 0% auto;
  background-repeat: no-repeat;
}
```

## useWeather custom hook

## Step 8 CityForm Component

A vous de jouer !
