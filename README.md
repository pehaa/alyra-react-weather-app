# Weather App

## Components folder

Voici la structure du projet. Un peu plus tard, nous allons ajouter d'autres components dans `Weather`.

```bash
src
├── App.css
├── App.js
├── components
│   ├── CityForm.js
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
import CityForm from "./components/CityForm"

function App() {
  const [city, setCity] = useState("Paris")
  return (
    <div className="container my-4">
      <h1 className="display-3 text-center mb-4">Météo Actuelle</h1>
      <Weather city={city} />
      <CityForm />
    </div>
  )
}

export default App
```

**Attention** Ici, nous mettons `import Weather from "./components/Weather"`. Si `./components/Weather.js` n'est pas trouvé, `./components/Weather/index.js` va être cherché.

## Weather component

Voici notre component `Weather` de départ

```javascript
// src/components/Weather.js
import React from "react"

const Weather = ({ city }) => {
  return (
    <section className="text-center mb-5">
      <h2 className="mb-4">Conditions météo à {city}</h2>
    </section>
  )
}

export default Weather
```

Nous allons utiliser `useEffect` afin de "fetch" les données concernant la météo actuelle dans notre `city` (initiallement Paris)

Voici l'url que nous allons utiliser :

```javascript
const API_KEY = "votrekeyici"
const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&&lang=fr`
```

Nous mettons dans notre component :

```javascript
// src/components/Weather.js
import React, { useEffect } from "react"
const API_KEY = "..."

const Weather = ({ city }) => {
  useEffect(() => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&&lang=fr`

    fetch(url)
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
      <h2 className="mb-4">Conditions météo à {city}</h2>
    </section>
  )
}

export default Weather
```

Quelle informations de `data` allons nous utiliser ? Nous pouvons opter pour :

- **conditions :**

```javascript
{
  feelsLike: Math.round(data.main.feels_like),
  mainTemp: Math.round(data.main.temp),
  humidity: data.main.humidity,
}
```

- **description :** `data.weather[0].description`
- **icon :** `data.weather[0].icon`
- **location :** `data.name`, `data.sys.country`

## Décomposer Weather en plus de composants

Voici la nouvelle structure des fichiers

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
│       ├── humidity.css # css pour Humidity
│       └── index.js
├── index.css
├── index.js
├── serviceWorker.js
└── setupTests.js
```

Notre component `Weather` devient

```javascript
// src/components/Weather/index.js

import React, { useState, useEffect } from "react"
import Icon from "./Icon"
import Description from "./Description"
import Temperature from "./Temperature"
import Humidity from "./Humidity"

const API_KEY = ".."

const Weather = ({ city }) => {
  const [conditions, setConditions] = useState({})
  const [description, setDescription] = useState("")
  const [iconID, setIconID] = useState("")
  const [location, setLocation] = useState("")

  useEffect(() => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&&lang=fr`

    fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
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
    !!location && (
      <section className="text-center">
        <Icon iconID={iconID} />
        <h2 className="mb-4">Conditions météo à {location}</h2>
        <Description description={description} />
        <Temperature mainTemp={mainTemp} feelsLike={feelsLike} />
        <Humidity humidity={humidity} />
      </section>
    )
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

## CityForm Component

Nous allons maintenant mettre à jour `city`, suite à event "submit" de notre formulaire.

```javascript
import React from "react"

const CityForm = ({ setCity }) => {
  const submitHandler = (e) => {
    e.preventDefault()
    setCity(e.target.elements.city.value)
    e.target.reset()
  }
  return (
    <form onSubmit={submitHandler}>
      <div className="input-group mb-2">
        <label className="input-group-text" htmlFor="city">
          Choisissez une ville
        </label>
        <input className="form-control" id="city" required />
      </div>
    </form>
  )
}

export default CityForm
```

## (optionnel) useWeather custom hook

Nous pouvons bouger la fonctionnalité de fetch dans sa propre fonction (custom hook).

```bash
mkdir src/hooks
touch src/hooks/useWeather.js
```

```javascript
// src/hooks/useWeather.js
import { useState, useEffect } from "react"
const API_KEY = ".."

const useWeather = (city) => {
  const [conditions, setConditions] = useState({})
  const [description, setDescription] = useState("")
  const [iconID, setIconID] = useState("")
  const [location, setLocation] = useState("")

  const API_KEY = ".."

  useEffect(() => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&&lang=fr`

    fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
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
  return {
    conditions,
    description,
    iconID,
    location,
  }
}

export default useWeather
```

et finalement dans `Weather`

```javascript
// src/components/Weather/index.js
import React, { useState, useEffect } from "react"
import Icon from "./Icon"
import Description from "./Description"
import Temperature from "./Temperature"
import Humidity from "./Humidity"
import useWeather from "../hooks/useWeather"

const Weather = ({ city }) => {
  const { conditions, description, iconID, location } = useWeather(city)

  return (
    !!location && (
      <section className="text-center">
        <Icon iconID={iconID} />
        <h2 className="mb-4">Conditions météo à {location}</h2>
        <Description description={description} />
        <Temperature mainTemp={mainTemp} feelsLike={feelsLike} />
        <Humidity humidity={humidity} />
      </section>
    )
  )
}

export default Weather
```
