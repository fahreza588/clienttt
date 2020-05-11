const fetch =  require('node-fetch');
const readlineSync = require("readline-sync");
const fs = require("async-file");
const chalk = require("chalk");
const moment = require("moment");
const delay = require('delay');
const { URLSearchParams } = require('url');


// Who is Me?
// I'am as creator (www.yarzc0de.co.id)
// U need me can contact me to fb.com/yarzcode
// Module Install :
// npm install --save node-fetch tough-cookie fetch-cookie readline-sync url async-file chalk cheerio moment string delay

const getCookie = () => new Promise((resolve, reject) => {
    var headers = {
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.122 Safari/537.36',
        'Referer': 'https://www.blibli.com/'
    };
    fetch("https://www.blibli.com/", {
        method: 'GET',
        headers: headers
    })
    .then(async res => {
        const result = {
            "body": await res.text(),
            "cookies": res.headers.raw()['set-cookie']
        }
        resolve(result);
    })
    .catch(err => {
        reject(err)
    })
});

const doLogin = (email, pass) => new Promise((resolve, reject) => {
    var headers = {
        'Accept': 'application/json',
        'User-Agent': 'BlibliAndroid/6.9.0(2632) 1bc030d3-068f-44df-a3a8-977b4752484f Dalvik/2.1.0 (Linux; U; Android 5.1.1; G011A Build/LMY48Z)',
        'Accept-Language': 'id',
        'channelId': 'android',
        'storeId': '10001',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': '168',
        'Host': 'account.blibli.com',
        'Connection': 'close',
        'Accept-Encoding': 'gzip, deflate',
        'X-NewRelic-ID': 'VQQGWFRSDxACVFNbBQQHUA=='
    };
    var params = new URLSearchParams();
    params.append("grant_type", "password")
    params.append("scope", "write");
    params.append("username", email)
    params.append("password", pass)
    params.append("client_id", "6354c4ea-9fdf-4480-8a0a-b792803a7f11")
    params.append("client_secret", "XUQpvvcxxyjfb7KG");
    fetch("https://account.blibli.com/gdn-oauth/token", {
        method: 'POST',
        headers: headers,
        body: params
    })
    .then(async res => {
        const result = {
            "body": await res.json(),
            "cookies": res.headers.raw()['set-cookie']
        }
        resolve(result);
    })
    .catch(err => {
        reject(err)
    })
});

const joinRefferal = (token) => new Promise((resolve, reject) => {
    var headers = {
        'Accept': 'application/json',
        'User-Agent': 'BlibliAndroid/6.9.0(2632) 1bc030d3-068f-44df-a3a8-977b4752484f Dalvik/2.1.0 (Linux; U; Android 5.1.1; G011A Build/LMY48Z)',
        'Accept-Language': 'id',
        'Content-Type': 'application/json; charset=UTF-8',
        'channelId': 'android',
        'storeId': '10001',
        'Authorization': 'bearer '+token,
        'Host': 'www.blibli.com',
        'Connection': 'close',
        'Accept-Encoding': 'gzip, deflate',
        'X-NewRelic-ID': 'VQQGWFRSDxACVFNbBQQHUA=='
    };
    
    fetch("https://www.blibli.com/backend/member-voucher/referral/parent/join", {
        method: 'GET',
        headers: headers
    })
    .then(async res => {
        const result = {
            "body": await res.json(),
            "cookies": res.headers.raw()['set-cookie']
        }
        resolve(result);
    })
    .catch(err => {
        reject(err)
    })
});

process.env.TZ = 'Asia/Jakarta'; // Timezone

(async() => {

    const fileList = await readlineSync.question("Enter List File : ");
    if(await fs.exists(fileList) !== true) {
        console.log(chalk`{bold.red Oops! File not found }`)
        process.exit(1);
    }
    const sesi = await readlineSync.question("Sesi (1/2/3) : ");
    // Sesi 1 : 08 - 09
    // Sesi 2 : 12 - 13
    // Sesi 3 : 18 - 19
    if(sesi === "1") {
        global.h1 = 07;
        global.h2 = 08;
    } else if(sesi === "2") {
        global.h1 = 11;
        global.h2 = 12;
    } else if(sesi === "3") {
        global.h1 = 17;
        global.h2 = 18;
    } else {
        console.log("Your Session typing is not found, please check your entered sesi!")
        process.exit(1);
    }
    const data = await fs.readFile(fileList, 'utf-8');
    const fExplode = data.split("\n");
    const listAccount = [];
    
    for(let i=0; i<fExplode.length; i++) {
        const splitting = await fExplode[i].split("|");
        if(splitting[0] === "" || splitting[1] === "") {
            continue;
        }
        var email = await splitting[0].trim();
        var password = await splitting[1].trim();
        const login = await doLogin(email, password);
        if(login.body.access_token !== null) {
            console.log(chalk`[${moment().format("HH:mm:ss")}] ${email} -> Success to login. [{bold.green OK}]`);
            listAccount[i] = [];
            listAccount[i]['email'] = email;
            listAccount[i]['password'] = password;
            listAccount[i]['token'] = login.body.access_token;
        } else {
            console.log(chalk`[${moment().format("HH:mm:ss")}] ${email} -> Failed to login. [{bold.red ${login.body.error}}]`);
        }
    } 
    if(await fs.exists("success.txt") !== true) {
        await fs.createWriteStream("success.txt");
    }
    if(await fs.exists("logsfailed.txt") !== true) {
        await fs.createWriteStream("logsfailed.txt");
    }
    let seconds = 1;
    console.log("");
    console.log("");
    do {
        setWhile = true
        const hari = new Date()
        if(await hari.getHours() === h1 && await hari.getMinutes() > 58 || await hari.getHours() === h2 && await hari.getMinutes() < 60) {
            setWhile = false
            for(let s=0; s<listAccount.length; s++) {
                const join= await joinRefferal(listAccount[s]['token']);
                if(join.body.code === 200) {
                    fs.appendFile(
                        `success.txt`,
                        `[${moment().format("HH:mm:ss")}] ${listAccount[s]['email']}|${listAccount[s]['password']}\n`,
                        "utf-8"
                    );    
                    console.log(chalk`[${moment().format("HH:mm:ss")}] ${listAccount[s]['email']} [{bold.green OK}]`)
                } else {
                    fs.appendFile(
                        `logsfailed.txt`,
                        `[${moment().format("HH:mm:ss")}] ${listAccount[s]['email']}|${listAccount[s]['password']} -> ${JSON.stringify(join.body)}\n`,
                        "utf-8"
                    );     
                    console.log(chalk`[${moment().format("HH:mm:ss")}] ${listAccount[s]['email']} [{bold.red ${join.body.status}}]`)
                    if(join.body.status === "PARENT_INELIGIBLE" || join.body.status == "BAD_REQUEST" || join.body.status == "ERROR") {
                        s--;
                    } else {
                        continue;
                    }
                }
            }
        } else {
            setWhile = true
            process.stdout.write('\033c');
            console.log(`[ ${moment().format("HH:mm:ss")} ] ${seconds} Seconds Reached - List Name : ${fileList} - Bot will started at ${h1}:59:00`)
            seconds++;
            await delay(1000)
        }
    } while(setWhile);
})();

// listAccount.forEach(async function(data) {
//     const join = await joinRefferal(data['cookie']);
//     if(join.body.code === 200) {
//         console.log(chalk`[ ${moment().format("HH:mm:ss")} ] ${data['email']} [{bold.green OK}]`)
//     } else {
//         console.log(chalk`[${moment().format("HH:mm:ss")}] ${data['email']} [{bold.red ${join.body.status}}]`)
//     }
// })
