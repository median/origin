const UserAgent = require('user-agents');
const request = require(`request-promise-native`);
const fs = require('fs');
const deepcopy = require('deepcopy');
const fetch = require("node-fetch");
const userAgents = new UserAgent();

let list = fs.readFileSync("list.txt", "UTF-8").split(/\r?\n/);
let webhookId = ``;
let webhookToken = ``;
let URL = `https://discordapp.com/api/webhooks/${webhookId}/${webhookToken}`;
let headers = { "Content-Type": "application/json" };

let base_webhook = {
    'embeds': [{
        'fields': [{
            'name': 'Origin Available:',
            'value': undefined,
        }, ],
    }]
}

main();
async function main() {
    for (user of list) {
        await resolve(user);
    }
    main();
}

async function resolve(username) {
    try {
        let data = await request(`https://signin.ea.com/p/ajax/user/checkOriginId?requestorId=portal&originId=${username}`);
        data = JSON.parse(data);

        if (data['status'] == true) {
            console.log(`${username} is free`);
            await notify(username);
            return;
        } else if (data['status'] == false) {
            return console.log(`${username} is taken`);
        }
        console.log('what the hell is wrong here');
        process.exit();
    } catch (e) { console.log(e); }
}

async function notify(username) {
    try {
        webhook = deepcopy(base_webhook);
        webhook['embeds'][0]['color'] = 5287281;
        webhook['embeds'][0]['fields'][0]['value'] = username;

        fetch(URL, { method: 'post', headers: headers, body: JSON.stringify(webhook) });
    } catch (e) {
        console.log(e);
    }
}
