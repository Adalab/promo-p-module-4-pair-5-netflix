const express = require('express');
const cors = require('cors');
const movies = require('./data/movies.json');
const Database = require('better-sqlite3');
const users = require('./data/users.json');

// create and config server
const server = express();
server.use(cors());
server.use(express.json());
server.set('view engine', 'ejs');
const db = new Database('./src/db/database.db', { verbose: console.log });

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

// creamos el endpoint /users de tipo GET

//End points:
//este recibe la petición del fetch de api-movies
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

/* server.get('/movies', (req, res) => {
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

server.post('/sign-up', (req, res) => {
  //antes de insertar a la usuaria en la base de datos, hacemos un select para comprobar si ya existe.
  const query1 = db.prepare(`SELECT * FROM users WHERE email =  ?`);
  const userFound = query1.get(req.body.email);
  if (userFound === undefined) {
    const query2 = db.prepare(
      'INSERT INTO users (email, password) VALUES (?, ?)'
    );
    const result = query2.run(req.body.email, req.body.password);
    console.log(result);
    res.json({
      success: true,
      userId: result.lastInsertRowid,
    });
  } else {
    res.json({
      success: false,
      errorMessage: 'Usuaria ya existente',
    });
  }
});

const staticServerPathWeb = './src/public-react'; // En esta carpeta ponemos los ficheros estáticos. Ruta correcta? public o public-react?
server.use(express.static(staticServerPathWeb));

const staticServerPathImages = './src/public-movies-images'; // En esta carpeta ponemos los ficheros estáticos. Ruta correcta? public o public-react?
server.use(express.static(staticServerPathImages));

const staticServerStyles = './src/public-styles'; // En esta carpeta ponemos los ficheros estáticos. Ruta correcta? public o public-react?
server.use(express.static(staticServerStyles));
