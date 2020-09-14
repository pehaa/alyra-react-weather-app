import { useState, useEffect } from "react"
const APP_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY

const useWeather = (city) => {
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
        console.log(data)
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
