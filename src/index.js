const express = require('express');
const cors = require('cors');
const movies = require('./data/movies.json');
const users = require('./data/users.json');

// create and config server
const server = express();
server.use(cors());
server.use(express.json());

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});
//End points:
//este recibe la petición del fetch de api-movies
server.get('/movies', (req, res) => {
  const response = movies;
  console.log(movies);
  const genderFilterParam = req.query.gender ? req.query.gender : '';
  console.log(genderFilterParam);
  const sortParam = req.query.sort;
  console.log(sortParam);

  res.json(
    response
      .filter((movie) => {
        if (genderFilterParam !== '') {
          return movie.gender === genderFilterParam;
        } else {
          return response;
        }
      })
      .sort((a, b) => {
        if (sortParam === 'asc') {
          if (a.title < b.title) {
            return -1;
          }
          if (a.title > b.title) {
            return 1;
          }
          return 0;
        } else if (sortParam === 'desc') {
          if (b.title < a.title) {
            return -1;
          }
          if (b.title > a.title) {
            return 1;
          }
          return 0;
        }
      })
  );
});

//este recibe la petición del fetch de api-user
server.post('/login', (req, res) => {
  console.log(req.body);
  const userFound = users.find(
    (user) =>
      user.email === req.body.email && user.password === req.body.password
  );
  console.log(userFound);
  if (userFound !== undefined) {
    res.json({
      success: true,
      userId: userFound.id,
    });
  } else {
    res.json({
      success: false,
      errorMessage: 'Usuaria/o no encontrada/o',
    });
  }
});

const staticServerPathWeb = './src/public-react'; // En esta carpeta ponemos los ficheros estáticos. Ruta correcta? public o public-react?
server.use(express.static(staticServerPathWeb));

const staticServerPathImages = './src/public-movies-images'; // En esta carpeta ponemos los ficheros estáticos. Ruta correcta? public o public-react?
server.use(express.static(staticServerPathImages));
