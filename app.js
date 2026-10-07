const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

const backgroundInput = document.querySelector("#backgroundInput");
const textInput = document.querySelector("#textInput");
const downloadButton = document.querySelector("#downloadButton");

// 現在選択されている背景画像。
// 画像が選択されていない場合はnull。
let backgroundImage = null;

/**
 * Canvasを初期状態に戻す。
 */
const clearCanvas = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 背景画像がない場合でも確認しやすいように
  // 仮の背景色を描画する。
  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

/**
 * 背景画像をCanvasいっぱいに描画する。
 *
 * 縦横比を維持したまま1920×1080に収める。
 * 余った部分は切り取る方式。
 */
const drawBackground = () => {
  if (!backgroundImage) {
    return;
  }

  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  const imageWidth = backgroundImage.naturalWidth;
  const imageHeight = backgroundImage.naturalHeight;

  // Canvasに対して画像をcoverさせるための倍率を計算。
  const scale = Math.max(
    canvasWidth / imageWidth,
    canvasHeight / imageHeight
  );

  const drawWidth = imageWidth * scale;
  const drawHeight = imageHeight * scale;

  // 中央配置。
  const x = (canvasWidth - drawWidth) / 2;
  const y = (canvasHeight - drawHeight) / 2;

  ctx.drawImage(
    backgroundImage,
    x,
    y,
    drawWidth,
    drawHeight
  );
};

/**
 * サムネイル全体を描画する。
 */
const render = () => {
  clearCanvas();

  drawBackground();

  // 文字列を描画。
  const text = textInput.value;

  ctx.font = "bold 100px sans-serif";
  ctx.textBaseline = "middle";

  // 文字のアウトライン。
  ctx.lineWidth = 16;
  ctx.strokeStyle = "#000";

  // 文字本体。
  ctx.fillStyle = "#fff";

  // 左側に配置。
  const x = 120;
  const y = canvas.height / 2;

  ctx.strokeText(text, x, y);
  ctx.fillText(text, x, y);
};

/**
 * ローカル画像を読み込む。
 *
 * ここではサーバーへのアップロードは行わない。
 * File APIでブラウザ内に読み込んでいるだけ。
 */
backgroundInput.addEventListener("change", () => {
  const file = backgroundInput.files[0];

  if (!file) {
    backgroundImage = null;
    render();
    return;
  }

  const imageUrl = URL.createObjectURL(file);

  const image = new Image();

  image.addEventListener("load", () => {
    backgroundImage = image;

    // Blob URLは読み込みが終わったら解放する。
    URL.revokeObjectURL(imageUrl);

    render();
  });

  image.src = imageUrl;
});

/**
 * 文字列が変更されたら即座に再描画する。
 */
textInput.addEventListener("input", () => {
  render();
});

/**
 * Canvasの内容をPNGとしてダウンロードする。
 */
downloadButton.addEventListener("click", () => {
  canvas.toBlob((blob) => {
    if (!blob) {
      return;
    }

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "thumbnail.png";

    link.click();

    URL.revokeObjectURL(url);
  }, "image/png");
});

// 最初の状態を描画。
render();
