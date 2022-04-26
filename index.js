const Axios = require("axios");
const cheerio = require("cheerio");
const request = require("request");
const readline = require("readline");
const { URLSearchParams } = require("url");

const defaultHeaders = {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "ko-KR,ko;q=0.9",
    "Cache-Control": "max-age=0",
    "Connection": "keep-alive",
    "Content-Type": "application/x-www-form-urlencoded",
    "Host": "asked.kr",
    "sec-ch-ua": `" Not A;Brand";v="99", "Chromium";v="100", "Google Chrome";v="100"`,
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": `"Windows"`,
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "same-origin",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.88 Safari/537.36",
    "X-Requested-With": "XMLHttpRequest"
};

const baseSource = "1234567890qwertyuiopasdfghjklzxcvbnm";
const baseUrl = "https://asked.kr";
const baseInstance = Axios.default.create({ timeout: 3000 });
const nameList = ["신민혁", "최원찬", "오준혁", "이민찬", "최준연", "박준호", "정복윤", "이병재", "김정연", "김하온", "오윤서", "이원찬", "장민혁", "김태경", "오태현", "장윤서", "유현민", "유현준", "엄기준", "김가연", "최민혁", "박지훈", "심원석", "오시언", "문윤정", "이원혁", "박준영", "이채연", "박지후", "최진경", "오병민", "박준우", "김준겸", "김민채", "오건민", "이현성", "이채영", "이채우", "최세욱"];
const domainList = ["gmail.com", "yahoo.jp", "naver.com", "daum.net", "hotmail.com", "outlook.com"];
const text_main = `\x1b[33m
    ┌─  ASKED.KR TERROR TOOL ─────────────────────────┐
    │                                                 │
    │  [1] ACCOUNT GENERATION                         │
    │  [2] FOLLOW SPAM                                │
    │  [3] QUESTION SPAM                              │
    │  [4] PARSE REAL ACCOUNT ID                      │
    │                                                 │
    └─────────────────────────────────────────────────┘
`;
let firstLog = false;
let countTotalFollow = 0;
let countSuccess = 0;
let countFail = 0;

function delay(_TIME) {
    return new Promise(resolve => setTimeout(resolve, _TIME));
};

function getCookie(raw) {
    return raw[0].split(" ")[0];
};

function randomString(len) {
    let res = "";
    for (let i = 0; i < len; i++) {
        res += baseSource[random(0, baseSource.length)];
    };
    return res;
};

function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};

async function FUNC_TEST() {
    let accName = nameList[Math.floor(Math.random() * nameList.length)];
    let accDomain = domainList[Math.floor(Math.random() * domainList.length)];
    let accId = randomString(10);
    let accPw = randomString(8);
    let accMail = `${accId}@${accDomain}`;

    try {
        let form = new URLSearchParams({
            "reg_name": accName,
            "reg_email": accMail,
            "reg_ids": accId,
            "reg_pw": accPw
        }).toString();

        let signUpRes = await Axios.post(`${baseUrl}/sing_ups.php`, form,
            {
                "headers": defaultHeaders
            }
        );
        
        if (signUpRes["data"].toString().includes("질문지가 생성되었습니다")) {
            console.log("[PROCESS RUNNING] REGISTER SUCCESS | " + accName + " | " + accMail + " | " + accPw);
        } else {
            console.log("[PROCESS RUNNING] REGISTER FAIL | " + accName + " | " + accMail + " | " + accPw);
            return;
        };

        let sessionId = getCookie(signUpRes.headers["set-cookie"]);
        let questionRequest = await baseInstance.post(`${baseUrl}/query.php?query=5`, `id=community&content=${encodeURI("test")}&makarong_bat=-1&show_user=0`, {
            "headers": {
                "Cookie": sessionId
            }
        });
        console.log(questionRequest);
    } catch (e) {
        console.log(e);
    };
};

function FUNCTION_PARSE_BY_ID(_data_id) {
    return new Promise(async function (resolve) {
        var url = "https://asked.kr/" + _data_id;
        var url_encode = encodeURI(url);

        request(url_encode, (error, response, html) => {
            try {
                if (error) {
                    resolve({
                        "result": "fail",
                        "content": "\n" + error
                    });
                    return;
                };
    
                let htmlData = cheerio.load(html);
                let classFollowVal = String(htmlData(".following"));
                classFollowVal = classFollowVal.split("\"")[1].split("_")[1];
                resolve({
                    "result": "success",
                    "content": classFollowVal
                });
                return;
            } catch (e) {
                resolve({
                    "result": "fail",
                    "content": "\nError : unknown account id"
                });
                return;
            };
        });
    });
};

async function FUNC_FOLLOW_ONE(_myProcesNumber, _requestId) {
    let accName = nameList[Math.floor(Math.random() * nameList.length)];
    let accDomain = domainList[Math.floor(Math.random() * domainList.length)];
    let accId = randomString(12);
    let accPw = randomString(8);
    let accMail = `${accId}@${accDomain}`;

    try {
        let form = new URLSearchParams({
            "reg_name": accName,
            "reg_email": accMail,
            "reg_ids": accId,
            "reg_pw": accPw
        }).toString();

        let signUpRes = await Axios.post(`${baseUrl}/sing_ups.php`, form,
            {
                "headers": defaultHeaders
            }
        );
        if (signUpRes["data"].toString().includes("질문지가 생성되었습니다")) {
            console.log("[PROCESS RUNNING] REGISTER SUCCESS | " + accName + " | " + accMail + " | " + accPw);
        } else {
            console.log("[PROCESS RUNNING] REGISTER FAIL | " + accName + " | " + accMail + " | " + accPw);
            return;
        };

        let sessionId = getCookie(signUpRes.headers["set-cookie"]);
        let followRequest = await baseInstance.post(`${baseUrl}/query.php?query=22`, `num=${_requestId}`, {
            "headers": {
                "Cookie": sessionId
            }
        });
        if (followRequest["data"] == "\n\n\n\n\n\n\n\n\n\n\nsuccess") {
            console.log("[PROCESS RUNNING] FOLLOW SUCCESS | " + accName + " | " + accMail + " | " + accPw);
            countSuccess++;
        } else {
            console.log("[PROCESS RUNNING] FOLLOW FAIL | " + accName + " | " + accMail + " | " + accPw);
            countFail++;
        };
    } catch (e) {
        console.log("[PROCESS RUNNING] REQUEST ERROR | " + accName + " | " + accMail + " | " + accPw);
        countFail++;
    };

    if ((_myProcesNumber + 1) == countTotalFollow) {
        console.log(`[PROCESS RUNNING] PROCESS COMPLETE | TARGET : ${countTotalFollow} | SUCCESS : ${countSuccess} | FAIL : ${countFail}`);
    };
};

async function FUNC_FOLLOW() {
    console.clear();
    console.log("\n\n    ENTER FOLLOW COUNT");

    let rl = readline.createInterface(process.stdin, process.stdout);
    let res = await new Promise((resolve) => rl.question("\n    > ", resolve));
    rl.close();

    countTotalFollow = res;
    countTotalFollow *= 1;

    console.clear();
    console.log("\n\n    ENTER ACCOUNT ID (ACC ID / REAL ID)");

    let rl2 = readline.createInterface(process.stdin, process.stdout);
    let res2 = await new Promise((resolve) => rl2.question("\n    > ", resolve));
    rl2.close();

    let accountId;

    if (isNaN(res2)) {
        let parseRes = await FUNCTION_PARSE_BY_ID(res2);

        if (parseRes["result"] == "success") {
            accountId = parseRes["content"];
        } else if (parseRes["result"] == "fail") {
            console.log("\n\n    [PROCESS RUNNING] REAL ACC ID PARSE FAIL | ERROR ->");
            console.log(parseRes["content"]);
            return;
        };
    } else {
        accountId = res2;
    };

    console.clear();
    console.log("\n\n    ENTER DELAY COUNT (MS) | 0 FOR BULK FOLLOW");

    let rl3 = readline.createInterface(process.stdin, process.stdout);
    let res3 = await new Promise((resolve) => rl3.question("\n    > ", resolve));
    rl3.close();

    let delayCount = res3;
    delayCount *= 1;

    console.clear();

    for (var i = 0; i < countTotalFollow; i++) {
        FUNC_FOLLOW_ONE(i, accountId);
        await delay(delayCount);
    };
};

async function FUNC_QUESTION_ONE(_myProcesNumber, _requestId, _requestContent, _data_anonymity) {
    let accName = nameList[Math.floor(Math.random() * nameList.length)];
    let accDomain = domainList[Math.floor(Math.random() * domainList.length)];
    let accId = randomString(12);
    let accPw = randomString(8);
    let accMail = `${accId}@${accDomain}`;

    try {
        let form = new URLSearchParams({
            "reg_name": accName,
            "reg_email": accMail,
            "reg_ids": accId,
            "reg_pw": accPw
        }).toString();

        let signUpRes = await Axios.post(`${baseUrl}/sing_ups.php`, form,
            {
                "headers": defaultHeaders
            }
        );
        if (signUpRes["data"].toString().includes("질문지가 생성되었습니다")) {
            console.log("[PROCESS RUNNING] REGISTER SUCCESS | " + accName + " | " + accMail + " | " + accPw);
        } else {
            console.log("[PROCESS RUNNING] REGISTER FAIL | " + accName + " | " + accMail + " | " + accPw);
            console.log(signUpRes);
            return;
        };

        let sessionId = getCookie(signUpRes.headers["set-cookie"]);
        let questionRequest = await baseInstance.post(`${baseUrl}/query.php?query=100`, `id=${_requestId}&content=${encodeURI(_requestContent)}&makarong_bat=-1&show_user=${_data_anonymity}`, {
            "headers": {
                "Cookie": sessionId
            }
        });
        if (questionRequest["data"] == "\n\n\n\n\n\n\n\n\n\n\nsuccess") {
            console.log("[PROCESS RUNNING] QUESTION SUCCESS | " + accName + " | " + accMail + " | " + accPw);
            countSuccess++;
        } else {
            console.log("[PROCESS RUNNING] QUESTION FAIL | " + accName + " | " + accMail + " | " + accPw + " | REASON : BAD WORD");
            countFail++;
        };
    } catch (e) {
        console.log(e);
        console.log("[PROCESS RUNNING] REQUEST ERROR | " + accName + " | " + accMail + " | " + accPw);
    };

    if ((_myProcesNumber + 1) == countTotalFollow) {
        console.log(`[PROCESS RUNNING] PROCESS COMPLETE | TARGET : ${countTotalFollow} | SUCCESS : ${countSuccess} | FAIL : ${countFail}`);
    };
};

async function FUNC_QUESTION() {
    console.clear();
    console.log("\n\n    ENTER REQUEST COUNT");

    let rl = readline.createInterface(process.stdin, process.stdout);
    let res = await new Promise((resolve) => rl.question("\n    > ", resolve));
    rl.close();

    countTotalFollow = res;
    countTotalFollow *= 1;

    console.clear();
    console.log("\n\n    ENTER ACCOUNT ID");

    let rl2 = readline.createInterface(process.stdin, process.stdout);
    let res2 = await new Promise((resolve) => rl2.question("\n    > ", resolve));
    rl2.close();

    let accountId = res2;

    console.clear();
    console.log("\n\n    ENTER QUESTION CONTENT");

    let rl3 = readline.createInterface(process.stdin, process.stdout);
    let res3 = await new Promise((resolve) => rl3.question("\n    > ", resolve));
    rl3.close();

    let textContent = res3;

    console.clear();
    console.log("\n\n    ENTER DELAY COUNT (MS) | 0 FOR BULK QUESTION");

    let rl4 = readline.createInterface(process.stdin, process.stdout);
    let res4 = await new Promise((resolve) => rl4.question("\n    > ", resolve));
    rl4.close();

    let delayCount = res4;
    delayCount *= 1;

    console.clear();
    console.log("\n\n    ENTER ANONYMITY (0 : HIDE / 1 : PUBLIC)");

    let rl5 = readline.createInterface(process.stdin, process.stdout);
    let res5 = await new Promise((resolve) => rl5.question("\n    > ", resolve));
    rl5.close();

    let anony = res5;
    anony *= 1;

    console.clear();

    for (var i = 0; i < countTotalFollow; i++) {
        FUNC_QUESTION_ONE(i, accountId, textContent, anony);
        await delay(delayCount);
    };
};

async function FUNC_GEN_ONE(_myProcesNumber) {
    let accName = nameList[Math.floor(Math.random() * nameList.length)];
    let accDomain = domainList[Math.floor(Math.random() * domainList.length)];
    let accId = randomString(12);
    let accPw = randomString(8);
    let accMail = `${accId}@${accDomain}`;

    try {
        let form = new URLSearchParams({
            "reg_name": accName,
            "reg_email": accMail,
            "reg_ids": accId,
            "reg_pw": accPw
        }).toString();

        let signUpRes = await Axios.post(`${baseUrl}/sing_ups.php`, form,
            {
                "headers": defaultHeaders
            }
        );
        if (signUpRes["data"].toString().includes("질문지가 생성되었습니다")) {
            console.log("[PROCESS RUNNING] REGISTER SUCCESS | " + accName + " | " + accMail + " | " + accPw);
        } else {
            console.log("[PROCESS RUNNING] REGISTER FAIL | " + accName + " | " + accMail + " | " + accPw);
            return;
        };
    } catch (e) {
        console.log("[PROCESS RUNNING] REQUEST ERROR | " + accName + " | " + accMail + " | " + accPw);
        countFail++;
    };

    if ((_myProcesNumber + 1) == countTotalFollow) {
        console.log(`[PROCESS RUNNING] PROCESS COMPLETE | TARGET : ${countTotalFollow} | SUCCESS : ${countSuccess} | FAIL : ${countFail}`);
    };
};

async function FUNC_GEN() {
    console.clear();
    console.log("\n\n    ENTER ACCOUNT COUNT");

    let rl = readline.createInterface(process.stdin, process.stdout);
    let res = await new Promise((resolve) => rl.question("\n    > ", resolve));
    rl.close();

    countTotalFollow = res;
    countTotalFollow *= 1;

    console.clear();
    console.log("\n\n    ENTER DELAY COUNT (MS) | 0 FOR BULK GEN");

    let rl2 = readline.createInterface(process.stdin, process.stdout);
    let res2 = await new Promise((resolve) => rl2.question("\n    > ", resolve));
    rl2.close();

    let delayCount = res2;
    delayCount *= 1;

    console.clear();

    for (var i = 0; i < countTotalFollow; i++) {
        FUNC_GEN_ONE(i);
        await delay(delayCount);
    };
};

async function FUNC_PARSE() {
    console.clear();
    console.log("\n\n    ENTER ACCOUNT ID");

    let rl = readline.createInterface(process.stdin, process.stdout);
    let res = await new Promise((resolve) => rl.question("\n    > ", resolve));
    rl.close();

    let parseID = res;

    console.clear();

    let parseRes = await FUNCTION_PARSE_BY_ID(parseID);

    if (parseRes["result"] == "success") {
        console.log("\n\n    [PROCESS RUNNING] REAL ACC ID PARSE SUCCESS | " + parseRes["content"]);
    } else if (parseRes["result"] == "fail") {
        console.log("\n\n    [PROCESS RUNNING] REAL ACC ID PARSE FAIL | ERROR ->");
        console.log(parseRes["content"]);
    };
};

async function FUNC_MAIN() {
    console.clear();
    console.log(text_main);

    if (firstLog == false) {
        firstLog = true;
        FUNC_MAIN();
        return;
    };

    let rl = readline.createInterface(process.stdin, process.stdout);
    let res = await new Promise((resolve) => rl.question("    > ", resolve));
    rl.close();

    let mode = res.trim();

    if (mode == "1") {
        FUNC_GEN();
    } else if (mode == "2") {
        FUNC_FOLLOW();
    } else if (mode == "3") {
        FUNC_QUESTION();
    } else if (mode == "4") {
        FUNC_PARSE();
    } else if (mode == "5") {
        FUNC_TEST();
    } else {
        FUNC_MAIN();
        return;
    };
};

FUNC_MAIN();
