import React from "react"
import useWeather from "../../hooks/useWeather.js"
import Icon from "./Icon"
import Description from "./Description"
import Temperature from "./Temperature"
import Humidity from "./Humidity"

const Weather = ({ city }) => {
  const { conditions, description, iconID, location } = useWeather(city)
  const { feelsLike, mainTemp, humidity } = conditions
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
