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
