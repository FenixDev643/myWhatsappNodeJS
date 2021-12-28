const fs = require('fs');
const { Session } = require('inspector');
const { disconnect } = require('process');
const qrcode = require('qrcode-terminal');

const { Client } = require('whatsapp-web.js');

const SESSION_FILE_PATH = "./session.json";

let sessionData;
if(fs.existsSync(SESSION_FILE_PATH)){
    sessionData = require(SESSION_FILE_PATH);
}

const GoodMessages = ["😮😄🤗","👍😁🤗","😁🤗❤️","👍🤔🤗❤️","😺😸❤️"];

const country_code = "111"; //your country code
const number = 11111111; //your number
const msg = GoodMessages[Math.floor(Math.random() * GoodMessages.length)];

const client = new Client({
    session: sessionData,
});

client.initialize();

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('authenticated', session => {
    sessionData = session;

    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), err => {
        if(err){
            console.error(err);
        }
    })
})

client.on('auth_failure', msg => {
    console.err('Hubo un error en la autenticacion',msg);
})

client.on('ready', () => {
    console.log('CLIENTE LISTO');

    let chatId = country_code + number + "@c.us";

    client.sendMessage(chatId, msg)
                    .then(response => {
                        if(response.id.fromMe){
                            console.log('CLIENTE INICIADO');
                        }
                    })
});

client.on('disconnected', () => {
    console.log('el cliente se desconecto');
})

client.on('message', msg => {
    if(msg.from == "PhoneNumber@c.us" || msg.from == "PhoneNumber@c.us"){
        if(msg.hasMedia){
            setTimeout(() => {  msg.reply(GoodMessages[Math.floor(Math.random() * GoodMessages.length)]) }, 4000);
        }
    }
    if(msg.from.endsWith("-GroupNumber@g.us")){
        if(msg.hasMedia){
            setTimeout(() => {  msg.reply(GoodMessages[Math.floor(Math.random() * GoodMessages.length)]) }, 4000);
        }
    }
    if(msg.from == "PhoneNumber@c.us" && msg.body == "Hola"){ 
        client.sendMessage(msg.from, 'Respuesta en 2 segundos...😁🤗');
        setTimeout(() => {  msg.reply(GoodMessages[Math.floor(Math.random() * GoodMessages.length)]) }, 2000);
    }
    console.log(msg.from);
    console.log(msg.body);
    console.log(msg.hasMedia);
})
