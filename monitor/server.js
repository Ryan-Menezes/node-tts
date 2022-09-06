require('dotenv').config();

const axios = require('axios');
const TotalVoice = require('totalvoice-node');
const client = new TotalVoice(process.env.TOTALVOICE_API_KEY);

const servers = [
    {
        name: 'Server 1',
        url: 'http://localhost:4001',
        developer: {
            name: 'Ryan Menezes',
            phone: process.env.PHONE,
        },
    },
    {
        name: 'Server 2',
        url: 'http://localhost:4002',
        developer: {
            name: 'Ryan Menezes',
            phone: process.env.PHONE,
        },
    },
];

setInterval(async () => {
    for (const server of servers) {
        await axios({
            url: server.url,
            method: 'GET',
        })
        .then(response => {
            console.log(`${server.name} está no ar`);
        })
        .catch(() => {
            console.log(`${server.name} está fora do ar`);

            const message = `${server.developer.name} o ${server.name} está fora do ar, por favor faça alguma coisa o mais rápido possível`;
            const options = {
                velocidade: 2,
                tipo_voz: 'br-Vitoria',
            };

            client.tts.enviar(server.developer.phone, message, options)
            .then(() => {
                console.log(`O desenvolvedor ${server.developer.name} já foi avisado!`);
            });
        });
    }
}, 1000);
