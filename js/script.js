const items = [
    { id: 1, limit: 30, max: 2 },
    { id: 2, limit: 45, max: 2 },
    { id: 3, limit: 45, max: 2 },
    { id: 4, limit: 45, max: 4 },
    { id: 5, limit: 45, max: 4 },
    { id: 6, limit: 75, max: 4 },
    { id: 7, limit: 75, max: 4 },
    { id: 8, limit: 75, max: 4 },
    { id: 9, limit: 75, isBonus: true, ranges: bonus75() },
    { id: 10, limit: 75, isBonus: true, ranges: bonus75() },
    { id: 11, limit: 120, isBonus: true, ranges: bonus120() },
    { id: 12, limit: 120, isBonus: true, ranges: bonus120() },
    { id: 13, limit: 120, isBonus: true, ranges: bonus120() },
    { id: 14, limit: 120, isBonus: true, ranges: bonus120() }
];

function bonus75() {
    return [
        { min: 0, max: 10, score: 7 },
        { min: 11, max: 20, score: 6 },
        { min: 21, max: 30, score: 5 },
        { min: 31, max: 75, score: 4 }
    ];
}

function bonus120() {
    return [
        { min: 0, max: 40, score: 7 },
        { min: 41, max: 60, score: 6 },
        { min: 61, max: 80, score: 5 },
        { min: 81, max: 120, score: 4 }
    ];
}

let currentIndex = 0;
let scoresLog = [];
let timer;
let timeLeft;
let zeroCount = 0;

function initTest() {
    const age = document.getElementById('age-select').value;
    currentIndex = age === "8" ? 2 : 0;
    document.getElementById('setup-area').classList.add('hidden');
    document.getElementById('test-area').classList.remove('hidden');
    loadItem();
}

function loadItem() {
    clearInterval(timer);
    const item = items[currentIndex];
    document.getElementById('item-title').innerText = `البند رقم: ${item.id}`;
    document.getElementById('item-desc').innerText =
        item.id <= 8 ? "تصميم 4 مكعبات" : "تصميم 9 مكعبات";
    document.getElementById('time-info').innerText =
        `الوقت المخصص: ${item.limit} ثانية`;

    document.getElementById('seconds').innerText = item.limit;
    document.getElementById('start-timer-btn').classList.remove('hidden');
    document.getElementById('scoring-section').classList.add('hidden');
    timeLeft = item.limit;
}

function startClock() {
    document.getElementById('start-timer-btn').classList.add('hidden');
    document.getElementById('scoring-section').classList.remove('hidden');
    createButtons();

    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('seconds').innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            nextItem(0, items[currentIndex].limit);
        }
    }, 1000);
}

function createButtons() {
    const container = document.getElementById('buttons-container');
    container.innerHTML = "";
    const item = items[currentIndex];

    if (item.isBonus) {
        const btn = document.createElement('button');
        btn.className = "btn btn-score";
        btn.innerText = "تم بنجاح";
        btn.onclick = () => {
            const spent = item.limit - timeLeft;
            nextItem(calcBonus(item.ranges, spent), spent);
        };
        container.appendChild(btn);
    } else {
        for (let i = 0; i <= item.max; i++) {
            if (item.max === 4 && i > 0 && i < 4) continue;
            const b = document.createElement('button');
            b.className = "btn btn-score";
            b.innerText = `${i} درجة`;
            b.onclick = () => nextItem(i, item.limit - timeLeft);
            container.appendChild(b);
        }
    }

    const fail = document.createElement('button');
    fail.className = "btn btn-fail";
    fail.innerText = "فشل";
    fail.onclick = () => nextItem(0, item.limit - timeLeft);
    container.appendChild(fail);
}

function calcBonus(ranges, time) {
    return ranges.find(r => time >= r.min && time <= r.max)?.score || 0;
}

function nextItem(score, time) {
    clearInterval(timer);
    scoresLog.push({ id: items[currentIndex].id, score, time });

    zeroCount = score === 0 ? zeroCount + 1 : 0;
    if (zeroCount >= 3) return finish("توقف: 3 أصفار متتالية");

    currentIndex++;
    currentIndex < items.length ? loadItem() : finish("اكتمل الاختبار");
}

function finish(reason) {
    document.getElementById('test-area').classList.add('hidden');
    document.getElementById('result-area').classList.remove('hidden');

    const total = scoresLog.reduce((s, i) => s + i.score, 0);
    document.getElementById('final-score').innerText = total;
    document.getElementById('stop-reason').innerText = reason;

    const details = document.getElementById('details-list');
    details.innerHTML = "<strong>تفصيل الأداء:</strong><br>";
    scoresLog.forEach(i => {
        details.innerHTML += `البند ${i.id}: ${i.score} درجة (${i.time} ثانية)<br>`;
    });
}
