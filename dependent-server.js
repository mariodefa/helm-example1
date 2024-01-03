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

//----------------FUNCTIONS---------------------

async function requestSecondChoices(attempts) {
    try {
        const response = await axios.get(process.env.URL_DEPENDENCY);
        drink2Display = response.data.drinkDisplay;
        dessert2Display = response.data.dessertDisplay;
        console.log('success '+ response.data);
    } catch (error) {
        console.error(`Attemp to reach ${process.env.URL_DEPENDENCY} number:`, attempts);
        throw error; // Lanzamos el error para que pueda ser capturado en init()
    }
}

function noSecondChoices() {
    drinkDisplay = drink2;
    dessertDisplay = dessert2;
    drink2Display = '';
    dessert2Display = '';
}

async function init(){
    let attempts = 0;
    while (attempts < 3) {
        try {
            if (DEPENDENT) {
                await requestSecondChoices(attempts);
                break;
            } else {
                noSecondChoices();
                break;
            }
        } catch (error) {
            attempts++;
            if (attempts < 3) {
                console.log(`Attempt ${attempts} failed. Retrying in 3 seconds...`);
                await new Promise(resolve => setTimeout(resolve, 3000));
            } else {
                console.log(`Attempt ${attempts} failed. No more retries.`);
            }
        }
    }
}
//-------------------------------------

init();

app.get('/', (req, res) => {
    res.send(`Drink1: ${drinkDisplay}, Dessert1: ${dessertDisplay}, Drink2: ${drink2Display}, Dessert2: ${dessert2Display}`);
});

app.get('/json', (req, res) => {
  res.json({ drinkDisplay, dessertDisplay });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});
