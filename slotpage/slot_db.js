
// slot_db.js
let db;
let user_id;
let score = 0;
let stage_id = 1;
let livepoint = 3;
let balance = 300000; // 초기 자금 300,000원
let bet_amount = 0;   // 누적 배팅 금액

// 심볼별 배당률 정의
const SYMBOLS = {
    grape: { payout: 2 },
    orange: { payout: 2 },
    apple: { payout: 2 },
    bar: { payout: 4 },
    seven: { payout: 7 }
};

window.addEventListener('DOMContentLoaded', initDatabase);

async function initDatabase() {
    try {
        const SQL = await initSqlJs({
            locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/${file}`
        });

        console.log("SQL.js 로드 완료:", SQL);

        db = new SQL.Database();
        db.run("PRAGMA foreign_keys = ON;");

        createTables();
        loadOrCreateUser(); // ✅ 유저 확인 후 없으면 생성
        updateUI();

    } catch (error) {
        console.error("데이터베이스 초기화 중 오류 발생:", error);
    }
}

// 📌 테이블 생성
function createTables() {
    db.run(`
        CREATE TABLE IF NOT EXISTS user (
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            balance REAL DEFAULT 0,
            livepoint INTEGER DEFAULT 3,
            stage_id INTEGER DEFAULT 1,
            score INTEGER DEFAULT 0,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
    `);
}

// 📌 기존 유저 확인 후 없으면 생성
function loadOrCreateUser() {
    const result = db.exec("SELECT * FROM user LIMIT 1");

    if (result.length > 0 && result[0].values.length > 0) {
        // ✅ 기존 유저 정보 불러오기
        const userData = result[0].values[0];
        user_id = userData[0];
        const username = userData[1]; // ✅ username 가져오기
        balance = userData[2];
        livepoint = userData[3];
        stage_id = userData[4];
        score = userData[5];

        console.log(`기존 유저 로드됨: ID=${user_id}, 이름=${username}, 잔액=${balance}`);
        document.getElementById("username").textContent = username; // ✅ username 표시
    } else {
        // 📌 유저가 없으면 새로 생성
        console.log("유저가 존재하지 않음. 새 유저 생성...");
        createNewUser();
    }
}

// 📌 유저 생성 후 즉시 UI 업데이트
function createNewUser() {
    const username = "Player" + Math.floor(Math.random() * 1000); // ✅ 유저네임 랜덤 생성

    db.run(`
        INSERT INTO user (username, balance, livepoint, stage_id)
        VALUES (?, 300000, 3, 1)
    `, [username]);

    // 새 유저 ID 가져오기
    const newUserResult = db.exec(`SELECT last_insert_rowid() AS new_id`);
    if (newUserResult.length > 0 && newUserResult[0].values.length > 0) {
        user_id = newUserResult[0].values[0][0];
        console.log(`새 유저 생성 완료! ID=${user_id}, 이름=${username}`);
    }

    document.getElementById("username").textContent = username; // ✅ username 표시

    balance = 300000;
    livepoint = 3;
    stage_id = 1;
    score = 0;
    bet_amount = 0;
}

function updateUI() {
    const hearts = [document.getElementById('heart1'), document.getElementById('heart2'), document.getElementById('heart3')];
    hearts.forEach((h, i) => {
        h.style.display = (i < livepoint) ? 'inline-block' : 'none';
    });
    document.getElementById('stage').textContent = stage_id;
    document.getElementById('score').textContent = score;
    document.getElementById('currentMoney').textContent = balance;
    document.getElementById('bettingMoney').textContent = bet_amount;
}

function placeBet(amount) {
    if (amount > balance) {
        alert("잔액 부족!");
        return;
    }
    balance -= amount;
    bet_amount += amount;
    db.run(`UPDATE user SET balance=? WHERE user_id=?`, [balance, user_id]);
    updateUI();
}

function spinResult(result1, result2, result3) {
    console.log(`Spin Result: ${result1}, ${result2}, ${result3}`);

    if (result1 === result2 && result2 === result3) {
        const payoutMultiplier = SYMBOLS[result1].payout;
        const winnings = bet_amount * payoutMultiplier;
        balance += winnings;
        score += winnings;
        db.run(`UPDATE user SET balance=?, score=? WHERE user_id=?`, [balance, score, user_id]);
        alert(`승리! ${result1} 3개 일치! ${winnings}원 획득!`);
    }
    bet_amount = 0; // 스핀 후 배팅 금액 초기화
    updateUI();

    if (balance <= 0) {
        alert("돈이 떨어졌습니다! 게임 오버!");
        // window.location.href = "../startpage/title.html";
        window.leverBoost = 0; // 게임 오버 시 초기화
        window.forceTripleMatch = false; // 게임 오버 시 초기화
        gameOver();
    }

    checkStage(); // 스테이지 업데이트
}

function checkStage() {
    if (score >= 100000000 && stage_id === 3) {
        stage_id = 3;
        db.run(`UPDATE user SET stage_id=? WHERE user_id=?`, [stage_id, user_id]);
        alert("Stage 3 클리어! 민성이는 인생 역전에 성공했습니다!!");
        window.location.href = "../startpage/title.html";

        window.resetLeverProbability(); // ✅ 전역 함수 호출

    } 
    else if (score >= 10000000 && stage_id < 3) {
        stage_id = 3;
        db.run(`UPDATE user SET stage_id=? WHERE user_id=?`, [stage_id, user_id]);
        alert("Stage 2 클리어! Stage 3로 이동합니다.");

        window.resetLeverProbability(); // ✅ 전역 함수 호출

        score = 0;
        updateUI();
    } 
    else if (score >= 1000000 && stage_id < 2) {
        stage_id = 2;
        db.run(`UPDATE user SET stage_id=? WHERE user_id=?`, [stage_id, user_id]);
        alert("Stage 1 클리어! Stage 2로 이동합니다.");
        
        window.resetLeverProbability(); // ✅ 전역 함수 호출

        score = 0;
        updateUI();
    }
}

// 전역 함수 내보내기
window.placeBet = placeBet;
window.spinResult = spinResult;