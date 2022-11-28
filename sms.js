

const twilio = require('twilio');
require('dotenv').config();

const accountSid = "AC802a63185d59b964470833562cfa2435"; 
const authToken = "844f09591f7cd2da6dcfc4ca7f7f53d0";  

const client = new twilio(accountSid, authToken);

client.messages.create({
    body: 'Ahoy, friend!',
    to: '+21627685563', 
    from: '+12058276690' 
})
.then((message) => console.log(message.sid));