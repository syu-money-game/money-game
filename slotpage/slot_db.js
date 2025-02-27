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
    const SQL = await initSqlJs({
        locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/${file}`
    });
    db = new SQL.Database();
    db.run("PRAGMA foreign_keys = ON;");

    createTables();
    createNewUser();
    updateUI();
}

function createTables() {
    db.run(`
        CREATE TABLE IF NOT EXISTS user (
                                            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                                            username TEXT NOT NULL UNIQUE,
                                            balance REAL DEFAULT 0,
                                            livepoint INTEGER DEFAULT 3,
                                            stage_id INTEGER DEFAULT 1,
                                            score REAL DEFAULT 0,
                                            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
    `);
    db.run(`
        CREATE TABLE IF NOT EXISTS stage_goals (
                                                   stage_id INTEGER PRIMARY KEY,
                                                   target_amount REAL NOT NULL
        );
    `);
    db.run(`INSERT OR IGNORE INTO stage_goals (stage_id, target_amount) VALUES (1, 1000000);`);
    db.run(`INSERT OR IGNORE INTO stage_goals (stage_id, target_amount) VALUES (2, 10000000);`);
    db.run(`INSERT OR IGNORE INTO stage_goals (stage_id, target_amount) VALUES (3, 100000000);`);
}

function createNewUser() {
    db.run(`
        INSERT INTO user (username, balance, livepoint, stage_id, score)
        VALUES (
                   'Player' || (SELECT IFNULL(MAX(user_id), 0) + 1 FROM user),
                   300000,
                   3,
                   1,
                   0
               )
    `);
    const result = db.exec(`SELECT last_insert_rowid() AS new_id`);
    user_id = result.length > 0 && result[0].values.length > 0 ? result[0].values[0][0] : 1;

    balance = 300000;
    livepoint = 3;
    stage_id = 1;
    score = 0;
    bet_amount = 0;
    window.leverBoost = 0; // 새 유저 생성 시 초기화
    window.forceTripleMatch = false; // 새 유저 생성 시 초기화
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
    if (score >= 100000000 && stage_id < 3) {
        stage_id = 3;
        db.run(`UPDATE user SET stage_id=? WHERE user_id=?`, [stage_id, user_id]);
        alert("Stage 3 클리어! 민성이는 인생 역전에 성공했습니다!!");
        window.location.href = "../startpage/title.html";
        window.leverBoost = 0; // 스테이지 클리어 시 초기화
        window.forceTripleMatch = false; // 스테이지 클리어 시 초기화
    } else if (score >= 10000000 && stage_id < 2) {
        stage_id = 2;
        db.run(`UPDATE user SET stage_id=? WHERE user_id=?`, [stage_id, user_id]);
        alert("Stage 1 클리어! Stage 2로 이동합니다.");
        window.leverBoost = 0; // 스테이지 변경 시 초기화
        window.forceTripleMatch = false; // 스테이지 변경 시 초기화
    }
}

// 전역 함수 내보내기
window.placeBet = placeBet;
window.spinResult = spinResult;