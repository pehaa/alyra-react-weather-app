import React from "react"

const Temperature = ({ mainTemp, feelsLike }) => {
  return (
    <p>
      <b>température</b> {mainTemp}&deg;C - ressentie {feelsLike}&deg;C
    </p>
  )
}

export default Temperature
