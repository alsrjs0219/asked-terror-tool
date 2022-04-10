const Axios = require("axios");
const cheerio = require("cheerio");
const request = require("request");
const readline = require("readline");
const { URLSearchParams } = require("url");

const baseSource = "1234567890qwertyuiopasdfghjklzxcvbnm";
const baseUrl = "https://asked.kr";
const baseInstance = Axios.default.create({ timeout: 3000 });
const nameList = ["최준연", "박준호", "정복윤", "이병재", "김정연", "김하온", "오윤서", "이원찬", "장민혁", "김태경", "오태현", "장윤서", "유현민", "유현준", "엄기준", "김가연", "최민혁", "박지훈", "심원석", "오시언", "문윤정", "이원혁", "박준영", "이채연", "박지후", "최진경", "오병민", "박준우", "김준겸", "김민채", "오건민", "이현성", "이채영", "이채우", "최세욱"];
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
    console.clear();
    var url1 = "https://asked.kr/minseo";
    var url1_encode = encodeURI(url1);
    request(url1_encode, (error, response, html) => {
        if (error) {
            console.log("\n\n    [PROCESS RUNNING] ERROR OCCURRED DURING PARSING HTML ->");
            console.log(error);
            return;
        };

        let htmlData = cheerio.load(html);
        let classFollowVal = String(htmlData(".following"));
        classFollowVal = classFollowVal.split("\"")[1].split("_")[1];
        console.log("\n\n    [PROCESS RUNNING] REAL ACC ID PARSE SUCCESS | " + classFollowVal);
        return;
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
            "reg_id": accId,
            "reg_pw": accPw
        }).toString();

        let signUpRes = await baseInstance.post(`${baseUrl}/sing_up.php`, form);
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
    console.log("\n\n    ENTER REAL ACCOUNT ID");

    let rl2 = readline.createInterface(process.stdin, process.stdout);
    let res2 = await new Promise((resolve) => rl2.question("\n    > ", resolve));
    rl2.close();

    let accountId = res2;

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

async function FUNC_QUESTION_ONE(_myProcesNumber, _requestId, _requestContent) {
    let accName = nameList[Math.floor(Math.random() * nameList.length)];
    let accDomain = domainList[Math.floor(Math.random() * domainList.length)];
    let accId = randomString(12);
    let accPw = randomString(8);
    let accMail = `${accId}@${accDomain}`;

    try {
        let form = new URLSearchParams({
            "reg_name": accName,
            "reg_email": accMail,
            "reg_id": accId,
            "reg_pw": accPw
        }).toString();

        let signUpRes = await baseInstance.post(`${baseUrl}/sing_up.php`, form);
        if (signUpRes["data"].toString().includes("질문지가 생성되었습니다")) {
            console.log("[PROCESS RUNNING] REGISTER SUCCESS | " + accName + " | " + accMail + " | " + accPw);
        } else {
            console.log("[PROCESS RUNNING] REGISTER FAIL | " + accName + " | " + accMail + " | " + accPw);
            return;
        };

        let sessionId = getCookie(signUpRes.headers["set-cookie"]);
        let followRequest = await baseInstance.post(`${baseUrl}/query.php?query=0`, `id=${_requestId}&content=${encodeURI(_requestContent)}&makarong_bat=-1&show_user=0`, {
            "headers": {
                "Cookie": sessionId
            }
        });
        if (followRequest["data"] == "\n\n\n\n\n\n\n\n\n\n\nsuccess") {
            console.log("[PROCESS RUNNING] QUESTION SUCCESS | " + accName + " | " + accMail + " | " + accPw);
            countSuccess++;
        } else {
            console.log("[PROCESS RUNNING] QUESTION FAIL | " + accName + " | " + accMail + " | " + accPw + " | REASON : BAD WORD");
            countFail++;
        };
    } catch (e) {
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

    for (var i = 0; i < countTotalFollow; i++) {
        FUNC_QUESTION_ONE(i, accountId, textContent);
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
            "reg_id": accId,
            "reg_pw": accPw
        }).toString();

        let signUpRes = await baseInstance.post(`${baseUrl}/sing_up.php`, form);
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

    console.clear();
    var url1 = "https://asked.kr/" + parseID;
    var url1_encode = encodeURI(url1);
    request(url1_encode, (error, response, html) => {
        try {
            if (error) {
                console.log("\n\n    [PROCESS RUNNING] REAL ACC ID PARSE FAIL | ERROR ->");
                console.log(error);
                return;
            };
    
            let htmlData = cheerio.load(html);
            let classFollowVal = String(htmlData(".following"));
            classFollowVal = classFollowVal.split("\"")[1].split("_")[1];
            console.log("\n\n    [PROCESS RUNNING] REAL ACC ID PARSE SUCCESS | " + classFollowVal);
            return;
        } catch (e) {
            console.log("\n\n    [PROCESS RUNNING] REAL ACC ID PARSE FAIL | ERROR -> UNKNOWN ID");
            return;
        };
    });
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