const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

const DEPENDENT = process.env.URL_DEPENDENCY;
let drink1 = process.env.DRINK1;
let dessert1 = process.env.DESSERT1;
let drink2 = process.env.DRINK2;
let dessert2 = process.env.DESSERT2;
let drinkDisplay = drink1;
let dessertDisplay = dessert1;
let drink2Display = 'error';
let dessert2Display = 'error';

async function init(){
    if (DEPENDENT) {
        try {
            const response = await axios.get(process.env.URL_DEPENDENCY);
            drink2Display = response.data.drink2;
            dessert2Display = response.data.dessert2;
        } catch (error) {
            console.error(`Error fetching from ${process.env.URL_DEPENDENCY}:`, error);
        }
    }
    else{
        drinkDisplay = drink2;
        dessertDisplay = dessert2;
        drink2Display = '';
        dessert2Display = '';
    }
}

init();

app.get('/', (req, res) => {
    res.send(`Drink1: ${drinkDisplay}, Dessert1: ${dessertDisplay}, Drink2: ${drink2Display}, Dessert2: ${dessert2Display}`);
});

app.get('/json', (req, res) => {
  res.json({ drinkDisplay, dessertDisplay });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
