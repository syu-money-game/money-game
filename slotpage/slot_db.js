// slot_db.js

let db;                  // sql.js의 DB 객체
let user_id;             // 새로 삽입된 user_id를 저장
let score = 0;           // 점수
let stage_id = 1;        // 1~3
let livepoint = 3;       // 최대 3
let balance = 300000;    // 초기 자금 300,000원
let bet_amount = 0;      // 배팅 금액

// 페이지 로드 시 DB 초기화
window.addEventListener('DOMContentLoaded', initDatabase);

async function initDatabase() {
    // 1) sql.js 초기화
    const SQL = await initSqlJs({
        locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/${file}`
    });
    db = new SQL.Database();
    db.run("PRAGMA foreign_keys = ON;");

    // 2) 테이블 생성
    createTables();

    // 3) 매번 새 판(새 유저) 생성
    createNewUser();

    // 4) UI 갱신
    updateUI();
}

/** 테이블 생성 */
function createTables() {
    // user 테이블
    db.run(`
        CREATE TABLE IF NOT EXISTS user (
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            balance REAL DEFAULT 0,
            livepoint INTEGER DEFAULT 3,
            stage_id INTEGER DEFAULT 1,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // stage_goals 테이블 (이미 있다면 생략 가능)
    db.run(`
        CREATE TABLE IF NOT EXISTS stage_goals (
            stage_id INTEGER PRIMARY KEY,
            target_amount REAL NOT NULL
        );
    `);

    // 기본 stage_goals 삽입
    db.run(`INSERT OR IGNORE INTO stage_goals (stage_id, target_amount) VALUES (1, 1000000);`);
    db.run(`INSERT OR IGNORE INTO stage_goals (stage_id, target_amount) VALUES (2, 10000000);`);
    db.run(`INSERT OR IGNORE INTO stage_goals (stage_id, target_amount) VALUES (3, 100000000);`);
}

/**
 * 새 유저 레코드를 생성하고, 그 user_id를 전역변수에 저장
 * - 매 게임(슬롯 페이지)마다 새로운 user_id 발급
 */
function createNewUser() {
    // 예시: username을 'PlayerN' 형태로 자동 생성
    db.run(`
    INSERT INTO user (username, balance, livepoint, stage_id)
    VALUES (
      'Player' || (SELECT IFNULL(MAX(user_id), 0) + 1 FROM user),
      300000,
      3,
      1
    )
  `);

    // 방금 INSERT된 row의 user_id 가져오기
    const result = db.exec(`SELECT last_insert_rowid() AS new_id`);
    if (result.length > 0 && result[0].values.length > 0) {
        user_id = result[0].values[0][0];  // 새 user_id
    } else {
        user_id = 1; // 혹시 실패 시 기본값
    }

    // 자바스크립트 변수 초기화
    balance = 300000;
    livepoint = 3;
    stage_id = 1;
    score = 0;
    bet_amount = 0;
}

/** UI(하트, 스테이지, 점수, 소지금 등) 갱신 */
function updateUI() {
    // 1) 하트 표시
    const hearts = [
        document.getElementById('heart1'),
        document.getElementById('heart2'),
        document.getElementById('heart3')
    ];
    hearts.forEach((h, i) => {
        h.style.display = (i < livepoint) ? 'inline-block' : 'none';
    });

    // 2) stage, score, balance, bet_amount
    document.getElementById('stage').textContent = stage_id;
    document.getElementById('score').textContent = score;
    document.getElementById('currentMoney').textContent = balance;
    document.getElementById('battingMoney').textContent = bet_amount;
}

/** livepoint 1 감소 -> 0 되면 startpage 이동 */
function loseHeart() {
    livepoint--;
    if (livepoint < 0) livepoint = 0;

    // DB 업데이트 (user_id 사용)
    db.run(`UPDATE user SET livepoint=? WHERE user_id=?`, [livepoint, user_id]);

    updateUI();

    if (livepoint === 0) {
        alert("Game Over. 민성이는 인생 역전에 실패했습니다 ㅠㅠ");
        window.location.href = "../startpage/title.html";
    }
}

/** 점수 추가 -> 스테이지 목표 도달 시 스테이지 업 / 마지막 스테이지면 게임 종료 */
function addScore(amount) {
    score += amount;
    checkStage();
    updateUI();
}

/** stage_goals에 따른 스테이지 변경 */
function checkStage() {
    // 3단계(목표: 100000000) 도달 -> 게임 종료 -> startpage
    if (score >= 100000000 && stage_id < 3) {
        stage_id = 3;
        db.run(`UPDATE user SET stage_id=? WHERE user_id=?`, [stage_id, user_id]);
        alert("Stage 3 클리어! 민성이는 인생 역전에 성공했습니다!!");
        window.location.href = "../startpage/title.html";
        return;
    }
    // 2단계(목표: 10000000) 도달
    else if (score >= 10000000 && stage_id < 3) {
        stage_id = 3;
        db.run(`UPDATE user SET stage_id=? WHERE user_id=?`, [stage_id, user_id]);
        alert("Stage 2 클리어! Stage 3로 이동합니다.");
    }
    // 1단계(목표: 1000000) 도달
    else if (score >= 1000000 && stage_id < 2) {
        stage_id = 2;
        db.run(`UPDATE user SET stage_id=? WHERE user_id=?`, [stage_id, user_id]);
        alert("Stage 1 클리어! Stage 2로 이동합니다.");
    }
}

/** 배팅금액 설정 + balance 차감 */
function placeBet(amount) {
    if (balance < amount) {
        alert("잔액 부족!");
        return;
    }
    bet_amount = amount;
    balance -= amount;

    // DB 업데이트 (user_id 사용)
    db.run(`UPDATE user SET balance=? WHERE user_id=?`, [balance, user_id]);

    updateUI();
}

/** 예시: 슬롯머신 스핀 결과로 랜덤 점수 획득 */
function spinResult() {
    // TODO : 승리 확률/가중치에 맞게 수정
    // TODO : 돈을 잃고 더 이상 배팅 할 금액이 없어지는 경우 게임 종료
    const randomWin = Math.floor(Math.random() * 50000); // 0 ~ 49999
    addScore(randomWin);

    // TODO : NPC에게 걸릴 확률/가중치에 맞게 수정
    const caughtChance = Math.random();
    if (caughtChance < 0.1) {
        loseHeart();
    }
}
