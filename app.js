/*
=========================================================
背景画像設定
=========================================================
*/

/**
 * ./images/ フォルダー内に置いた画像。
 *
 * ここに画像を追加すると、
 * 背景画像のプルダウンにも追加できる。
 */
const BACKGROUND_IMAGES = [
  {
    label: '猫',
    path: './images/neko.webp'
  },
  {
    label: '女性',
    path: './images/woman.webp'
  },
  {
    label: '男性',
    path: './images/man.webp'
  },
  {
    label: '花',
    path: './images/flower.webp'
  },
  {
    label: '雲',
    path: './images/cloud.webp'
  }
];


/*
=========================================================
Canvas
=========================================================
*/

const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');


/*
=========================================================
HTML要素
=========================================================
*/

const backgroundSelect = document.querySelector('#backgroundSelect');
const backgroundInput = document.querySelector('#backgroundInput');
const textInput = document.querySelector('#textInput');

const xInput = document.querySelector('#xInput');
const yInput = document.querySelector('#yInput');

const rotationInput = document.querySelector('#rotationInput');
const fontSizeInput = document.querySelector('#fontSizeInput');

const downloadButton = document.querySelector('#downloadButton');


/*
=========================================================
状態
=========================================================
*/

/**
 * 現在使用している背景画像。
 *
 * 背景画像が選択されていない場合はnull。
 */
let backgroundImage = null;


/*
=========================================================
背景画像プルダウン
=========================================================
*/

/**
 * 背景画像の選択肢を作成する。
 */
const initializeBackgroundSelect = () => {

  for (const background of BACKGROUND_IMAGES) {

    const option = document.createElement('option');

    option.value = background.path;
    option.textContent = background.label;

    backgroundSelect.appendChild(option);
  }
};


/*
=========================================================
背景画像読み込み
=========================================================
*/

/**
 * 指定された画像を読み込む。
 *
 * @param {string} imagePath
 * @returns {Promise<HTMLImageElement>}
 */
const loadImage = ({ imagePath }) => {
  return new Promise((resolve, reject) => {

    const image = new Image();

    image.addEventListener('load', () => {
      resolve(image);
    });

    image.addEventListener('error', () => {
      reject(new Error(`画像を読み込めませんでした: ${imagePath}`));
    });

    image.src = imagePath;
  });
};


/**
 * 選択された背景画像を読み込む。
 */
const updateBackgroundImage = async () => {

  const imagePath = backgroundSelect.value;

  if (!imagePath) {
    backgroundImage = null;
    render();

    return;
  }

  try {

    backgroundImage = await loadImage({
      imagePath
    });

    render();

  } catch (error) {

    console.error(error);

    backgroundImage = null;

    render();
  }
};


/*
=========================================================
Canvas描画
=========================================================
*/

/**
 * Canvasを初期状態に戻す。
 */
const clearCanvas = () => {

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  /*
   * 背景画像がない場合でも
   * Canvasの領域が分かるように仮の背景色を描画する。
   */
  ctx.fillStyle = '#222';

  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );
};


/**
 * 背景画像をCanvasいっぱいに描画する。
 *
 * 縦横比を維持したまま1920×1080に収め、
 * 余った部分を切り取る。
 */
const drawBackground = () => {

  if (!backgroundImage) {
    return;
  }

  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  const imageWidth = backgroundImage.naturalWidth;
  const imageHeight = backgroundImage.naturalHeight;

  /*
   * Canvasに対して画像をcoverさせるための倍率。
   */
  const scale = Math.max(
    canvasWidth / imageWidth,
    canvasHeight / imageHeight
  );

  const drawWidth = imageWidth * scale;
  const drawHeight = imageHeight * scale;

  /*
   * Canvas中央に配置。
   */
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
 * テキストを描画する。
 */
const drawText = () => {

  const text = textInput.value;

  const x = Number(xInput.value);
  const y = Number(yInput.value);

  const rotation = Number(rotationInput.value);

  const fontSize = Number(fontSizeInput.value);

  /*
   * 座標を原点として回転させる。
   */
  ctx.save();

  ctx.translate(x, y);

  ctx.rotate(
    rotation * Math.PI / 180
  );

  /*
   * 文字設定。
   */
  ctx.font = `bold ${fontSize}px sans-serif`;

  ctx.textBaseline = 'middle';

  /*
   * 文字のアウトライン。
   */
  ctx.lineWidth = 16;

  ctx.strokeStyle = '#000';

  /*
   * 文字本体。
   */
  ctx.fillStyle = '#fff';

  /*
   * translate()によって
   * x=0、y=0が指定した座標になっている。
   */
  ctx.strokeText(
    text,
    0,
    0
  );

  ctx.fillText(
    text,
    0,
    0
  );

  /*
   * Canvasの状態を元に戻す。
   */
  ctx.restore();
};


/**
 * Canvas全体を描画する。
 */
const render = () => {

  clearCanvas();

  drawBackground();

  drawText();
};


/*
=========================================================
イベント
=========================================================
*/

/**
 * 背景画像が変更された。
 */
backgroundSelect.addEventListener(
  'change',
  () => {
    updateBackgroundImage();
  }
);


/**
 * テキストが変更された。
 */
textInput.addEventListener(
  'input',
  () => {
    render();
  }
);


/**
 * X座標が変更された。
 */
xInput.addEventListener(
  'input',
  () => {
    render();
  }
);


/**
 * Y座標が変更された。
 */
yInput.addEventListener(
  'input',
  () => {
    render();
  }
);


/**
 * 回転角度が変更された。
 */
rotationInput.addEventListener(
  'input',
  () => {
    render();
  }
);


/**
 * 文字サイズが変更された。
 */
fontSizeInput.addEventListener(
  'input',
  () => {
    render();
  }
);


/*
=========================================================
PNGダウンロード
=========================================================
*/

downloadButton.addEventListener(
  'click',
  () => {

    canvas.toBlob((blob) => {

      if (!blob) {
        return;
      }

      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');

      link.href = url;
      link.download = 'thumbnail.png';

      link.click();

      URL.revokeObjectURL(url);

    }, 'image/png');
  }
);


/*
=========================================================
初期化
=========================================================
*/

initializeBackgroundSelect();

render();
