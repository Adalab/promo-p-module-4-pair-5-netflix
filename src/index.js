const express = require('express');
const cors = require('cors');
const movies = require('./data/movies.json');

// create and config server
const server = express();
server.use(cors());
server.use(express.json());
server.set('view engine', 'ejs');

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});
//Endpoint

server.get('/movie/:movieId', (req, res) => {
  console.log(req.params);

  const foundMovie = movies.find(
    (eachMovie) => eachMovie.id === req.params.movieId
  );
  res.render('movie', foundMovie);
  console.log(foundMovie);
});

server.get('/movies', (req, res) => {
  const response = movies;
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

server.post('/login', (req, res) => {});

const staticServerPathWeb = './src/public-react'; // En esta carpeta ponemos los ficheros estáticos. Ruta correcta? public o public-react?
server.use(express.static(staticServerPathWeb));

const staticServerPathImages = './src/public-movies-images'; // En esta carpeta ponemos los ficheros estáticos. Ruta correcta? public o public-react?
server.use(express.static(staticServerPathImages));

const staticServerStyles = './src/public-styles'; // En esta carpeta ponemos los ficheros estáticos. Ruta correcta? public o public-react?
server.use(express.static(staticServerStyles));
