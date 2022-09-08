require('dotenv').config();

const axios = require('axios');
const TotalVoice = require('totalvoice-node');
const client = new TotalVoice(process.env.TOTALVOICE_API_KEY);

const boss = {
    name: 'Adm',
    phone: process.env.BOSS_PHONE,
};

const servers = [
    {
        name: 'Server 1',
        url: 'http://localhost:4001',
        developer: {
            name: 'Ryan Menezes',
            phone: process.env.DEV_PHONE,
        },
    },
    {
        name: 'Server 2',
        url: 'http://localhost:4002',
        developer: {
            name: 'Ryan Menezes',
            phone: process.env.DEV_PHONE,
        },
    },
];

const notifications = [

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

            const message = `${server.developer.name} o ${server.name} está fora do ar, por favor faça alguma coisa o mais rápido possível. Digite um se você vai fazer alguma coisa ou dois se não pode fazer nada!`;
            const options = {
                velocidade: 2,
                tipo_voz: 'br-Vitoria',
                resposta_usuario: true,
            };

            client.tts.enviar(server.developer.phone, message, options)
            .then(response => {
                console.log(`O desenvolvedor ${server.developer.name} já foi avisado!`);

                notifications.push({
                    id: response.dados.id,
                    server,
                    status: 'pending',
                });
            });
        });
    }
}, 5000);

setInterval(() => {
    for (const notification of notifications) {
        if (notification.status === 'pending') {
            client.tts.buscar(notification.id).then(response => {
                let message = null;

                switch (response.dados.resposta) {
                    case '1':
                        message = `O ${notification.server.name} está fora do ar, o desenvolvedor ${notification.server.developer.name} já foi avisado e vai fazer alguma coisa!`;
                        notification.status = 'success';
                        break;
                    case '2':
                        message = `O ${notification.server.name} está fora do ar, o desenvolvedor ${notification.server.developer.name} já foi avisado e não pode fazer nada!`;
                        notification.status = 'success';
                        break;    
                }

                if (message) {
                    console.log(message);

                    const options = {
                        velocidade: 2,
                        tipo_voz: 'br-Ricardo',
                    };
        
                    client.tts.enviar(boss.phone, message, options)
                    .then(response => {
                        console.log(`O desenvolvedor ${notification.server.developer.name} já foi avisado!`);
                    });
                }
            });
        }
    }
}, 5000);
