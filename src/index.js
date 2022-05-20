// import libraries
const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');

// set up server
const server = express();
server.use(cors());
server.use(express.json());

// set up EJS (template engine/motor de plantillas) to create dinamic server. Also necessary to create views/ folder to create the templates (movie.ejs in this case).
server.set('view engine', 'ejs');

// data from .json (first exercises)
const users = require('./data/users.json');
const movies = require('./data/movies.json');
// data (from database)
const db = new Database('./src/db/database.db', { verbose: console.log });

// set up port and start the server (express application)
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

//ENDPOINTS:

//this endpoint listens to the changes in URL params. IMPORTANT to set it before static servers. otherwise won't work.
//it is not related to a fetch in front-end. to see each movie, go to the route http://localhost:4000/movie/1 (or 2, 3, 4)
server.get('/movie/:movieId', (req, res) => {
  console.log(req.params);
  const foundMovie = movies.find(
    (eachMovie) => eachMovie.id === req.params.movieId
  );
  res.render(
    'movie' /* route to the specific template inside views */,
    foundMovie
  );
  console.log(foundMovie);
});

/* at first, when data was stored in json instead of database, this was the endpoint to get, filter and sort the movies shown:

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
}); */

//this endpoint receives parameters from fetch in web/src/services/api-movies
server.get('/movies', (req, res) => {
  const sort = req.query.sort;
  if (req.query.gender !== '') {
    const query = db.prepare(
      `SELECT * FROM movies WHERE gender = ? ORDER BY name ${sort}`
    );
    const movies = query.all(req.query.gender);
    res.json(movies);
  } else {
    const query = db.prepare(`SELECT * FROM movies ORDER BY name ${sort}`);
    const movies = query.all();
    res.json(movies);
  }
});

//receives parameters from fetch in web/src/services/api-user (sendLoginToApi)
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

server.post('/sign-up', (req, res) => {
  //antes de insertar a la usuaria en la base de datos, hacemos un select para comprobar si ya existe.
  const query = db.prepare('INSERT INTO users (email, password) VALUES (?, ?)');

  const result = query.run(req.body.email, req.body.password);
  if (result.changes === 1) {
    res.json({
      success: true,
      userId: result.lastInsertRowid,
    });
  } else {
    res.json({
      success: false,
      errorMessage: 'No se ha podido registrar',
    });
  }
});

//static servers set up:
const staticServerPathWeb = './src/public-react';
server.use(express.static(staticServerPathWeb));

const staticServerPathImages = './src/public-movies-images';
server.use(express.static(staticServerPathImages));

const staticServerStyles = './src/public-styles';
server.use(express.static(staticServerStyles));
