// 文章の取得 => APIを利用し非同期でランダムな文章を取得する
// 時間がかかるのでメインスレッドと切り離してAPIを取得する：非同期処理
const RANDOM_SENTENCE_URL_API = "https://api.quotable.io/random";

// データ取得関数の作成
// function GetRandomSentence() {
//   return fetch(RANDOM_SENTENCE_URL_API)
//     .then((response) => response.json())
//     .then((data) => data.content);
// }
async function GetRandomSentence() {
  const response = await fetch(RANDOM_SENTENCE_URL_API);
  const data = await response.json();
  return data.content;
}
// console.log(GetRandomSentence());

// 文章を取得しディスプレイに表示する, タイピングした文字と1文字ずつ比較して表示内容を変化させる
  // ■async : 非同期関数を定義 Promiseのthen処理を簡潔に記述できる
    // return promiseInstance
  // ■await : let resolvedValue = await promiseInstanse; Promise内のresolveの実引数の値を取り出す(resolvedValue)
    // 上記の記述形式でPromiseStatusがsettled(fulfilled || rejected)になるまで後続コードの実行を待機する
    // asyncとセットで使用 
const typeDisplay = document.querySelector("#typeDisplay"); // 表示箇所取得
const typeInput = document.querySelector("#typeInput"); // タイプ箇所取得
const timer = document.querySelector("#timer"); // タイマー取得

const typeSound = new Audio("./audio/typing-sound.mp3");
const incorrectSound = new Audio("./audio/wrong.mp3");
const correctSound = new Audio("./audio/correct.mp3");

async function RenderNextSentence() {
  const len = 100;
  let sentence = await GetRandomSentence();
  if(sentence.length > len) sentence = sentence.substring(0, len) + '...';
  // typeDisplay.textContent = sentence;
  typeDisplay.innerHTML = "";
  let oneText = sentence.split(''); // 1文字ずつ分割して配列化
  oneText.forEach(character => { // 1文字ずつsapnタグでラップ
    const characterSpan = document.createElement("span");
    characterSpan.textContent = character;
    typeDisplay.append(characterSpan); // 文字列挿入, Element.append(variable);
  });

  // 文章入れ替え時にtextarea内の文章をクリアする
  typeInput.value = null; // Inputタグの入力内容はvalueで取得する

  // タイマーリセット
  StartTimer();
}
RenderNextSentence();

let startTime;
let originTime = 5;
function StartTimer() {
  timer.innerText = originTime;
  startTime = new Date(); // 現在時刻
  // console.log(startTime);
  setInterval(() => {
    if(timer.innerText <= 0) {
      TimeUp(); // TimeUpした際の処理
    } else {
      timer.innerText = originTime - getTimerTime(); // originTimeから経過した時間を減算する
    }
  }, 1000);
}

function getTimerTime() {
  return Math.floor( (new Date() - startTime) / 1000 );
}

function TimeUp() {
  // console.log("next sentence");
  RenderNextSentence();
}


// Inputテキストの正誤判定
typeInput.addEventListener("input", () => {
  // タイプサウンド実装
  typeSound.play();
  typeSound.currentTime = 0;

  const sentence = typeDisplay.querySelectorAll("span");
  const arrayValue = typeInput.value.split("");

  let correct = true;
  sentence.forEach((characterSpan, index) => { // 比較、判定
    if (arrayValue[index] === undefined) { // 初期値設定
      characterSpan.classList.remove("correct");
      characterSpan.classList.remove("incorrect");
      correct = false;
    } else if (characterSpan.textContent === arrayValue[index]) {
      characterSpan.classList.add("correct");
      characterSpan.classList.remove("incorrect");
    } else {
      characterSpan.classList.add("incorrect");
      characterSpan.classList.remove("correct");
      correct = false;
      incorrectSound.volume = 0.3;
      incorrectSound.play();
      incorrectSound.currentTime = 0;
    }
  });

  if (correct) {
    correctSound.play();
    correctSound.currentTime = 0;
    RenderNextSentence();
  }
});