import React, { useState } from "react"
import CityForm from "./components/CityForm"
import Weather from "./components/Weather"

function App() {
  const [city, setCity] = useState("Paris")
  return (
    <div className="container my-4">
      <h1 className="display-3 text-center mb-4">Météo Actuelle</h1>
      <Weather city={city} />
      <CityForm setCity={setCity} />
    </div>
  )
}

export default App
