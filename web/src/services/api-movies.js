// login

const getMoviesFromApi = (params) => {
  console.log(params);
  console.log('Se están pidiendo las películas de la app');
  // CAMBIA ESTE FETCH PARA QUE APUNTE A UN ENDPOINT DE TU SERVIDOR, PIENSA SI DEBE SER GET O POST, PIENSA QUÉ DATOS DEBES ENVIAR, ETC

  return fetch(
    `http://localhost:4000/movies?gender=${params.gender}&sort=${params.sort}`
  )
    .then((response) => response.json())
    .then((data) => {
      // CAMBIA EL CONTENIDO DE ESTE THEN PARA GESTIONAR LA RESPUESTA DEL SERVIDOR Y RETORNAR AL COMPONENTE APP LO QUE NECESITA
      return {
        success: true,
        movies: data,
      };
    });
};

const objToExport = {
  getMoviesFromApi: getMoviesFromApi,
};

export default objToExport;
