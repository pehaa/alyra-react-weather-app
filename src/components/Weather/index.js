import React from "react"

const Weather = ({ city }) => {
  return (
    <section className="text-center mb-5">
      <h2 className="mb-4">Conditions météo à {city}</h2>
    </section>
  )
}

export default Weather
