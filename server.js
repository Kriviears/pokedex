'use strict';


require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const POKEDEX = require('./pokedex.json');
const cors = require('cors');
const helmet = require('helmet');
const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common';

const app = express();

app.use(morgan(morganSetting));
app.use(helmet());
app.use(cors());


app.use(function validateBearerToken(req, res, next){
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization');

  if(!authToken || authToken.split(' ')[1] !== apiToken){
    return res.status(401).json({ error: 'Unauthorized request'});
  }
  next();
});

app.use((error, req, res, next)=>{
  let response;
  if (process.env.NODE_ENV === 'production'){
    response = { error: { message: 'server error'}};
  } else {
    response = { error };
  }
  res.status(500).json(response);
});

const PORT = process.env.PORT || 8000;

const validTypes = [
  'Bug', 'Dark', 'Dragon', 'Electric', 'Fairy', 'Fighting',
  'Fire', 'Flying', 'Ghost', 'Grass', 'Ground', 'Ice',
  'Normal', 'Poison', 'Psychic', 'Rock', 'Steel', 'Water'
];

function handleGetTypes(req, res){
  res.json(validTypes);
}

function handleGetPokemon(req, res){
  let response = POKEDEX.pokemon;
  const { name, type } = req.query;

  if (name){
    response = response.filter(pokemon =>
      pokemon.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  if(type){
    response = response.filter(pokemon =>
      pokemon.type.includes(type)
    );
  }

  res.json(response);
}

app.get('/types', handleGetTypes);

app.get('/pokemon', handleGetPokemon);



app.listen(PORT, ()=>{

});