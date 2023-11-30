import React, { useEffect, useState } from "react";
const App = () => {
  const [markers, setMarkers] = useState([]);
  const [coordinates, setCoordinates] = useState([]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyD4tfTifmGsrDzN0goqfnsLo1gwE5A4f3s&v=3.exp&libraries=geometry,drawing,places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      initMap();
    };
    script.onerror = () => {
      console.error("Error cargando el script de Google Maps.");
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const initMap = () => {
    const map = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat: 6.638105, lng: -75.7852 },
      zoom: 8,
    });

    map.addListener("click", (event) => {
      const { latLng } = event;
      const lat = latLng.lat();
      const lng = latLng.lng();

      const newMarker = new window.google.maps.Marker({
        position: { lat, lng },
        map,
      });

      setMarkers((prevMarkers) => [...prevMarkers, newMarker]);

      setCoordinates((prevCoordinates) => [
        ...prevCoordinates,
        { lat: lat.toFixed(6), lng: lng.toFixed(6) },
      ]);
    });
  };

  const handleSaveLocations = async() => {
    console.log("Guardando ubicaciones:", coordinates);
    await fetch("http://localhost:8081/ubicacion/create", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        acopioLatitud: coordinates[0].lat,
        acopioLongitud: coordinates[0].lng,
        restauranteLatitud: coordinates[1].lat,
        restauranteLongitud: coordinates[1].lng,
        residenciaLatitud: coordinates[2].lat,
        residenciaLongitud: coordinates[2].lng,
      }),
    });
    setMarkers([]);
    setCoordinates([]);
  };

  return (
    <div>
      <div id="map" style={{ width: "100%", height: "400px" }} />
      <div>
        <h2>Coordenadas:</h2>
        {coordinates.map((coord, index) => (
          <div key={index}>
            <h3>Ubicación {index + 1}</h3>
            <div>
              <label>Latitud:</label>
              <input type="text" value={coord.lat} readOnly />
            </div>
            <div>
              <label>Longitud:</label>
              <input type="text" value={coord.lng} readOnly />
            </div>
          </div>
        ))}
      </div>
      <button onClick={handleSaveLocations}>Guardar</button>
    </div>
  );
};

export default App;
