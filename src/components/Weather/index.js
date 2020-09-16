import React, { useState, useEffect } from "react"
import Description from "./Description"
import Temperature from "./Temperature"
import Icon from "./Icon"
import Humidity from "./Humidity"

const Weather = ({ city }) => {
  const [conditions, setConditions] = useState({})
  const [description, setDescription] = useState("")
  const [iconID, setIconID] = useState("")
  const [location, setLocation] = useState("")

  useEffect(() => {
    const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&&lang=fr`
    fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
        throw new Error("météo pas trouvée")
      })
      .then((data) => {
        console.log(data)
        setDescription(data.weather[0].description)
        setIconID(data.weather[0].icon)
        setLocation(`${data.name}, ${data.sys.country}`)
        setConditions({
          feelsLike: Math.round(data.main.feels_like),
          mainTemp: Math.round(data.main.temp),
          humidity: data.main.humidity,
        })
      })
      .catch((error) => {
        alert(error.message)
      })
  }, [city])

  return (
    !!location && (
      <section className="text-center mb-5">
        <Icon iconID={iconID} />
        <h2 className="mb-4">Conditions météo à {location}</h2>
        <Description description={description} />
        <Temperature
          mainTemp={conditions.mainTemp}
          feelsLike={conditions.feelsLike}
        />
        <Humidity humidity={conditions.humidity} />
      </section>
    )
  )
}

export default Weather
