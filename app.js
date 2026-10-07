/*
=========================================================
背景画像設定
=========================================================
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
 * 現在Canvasに表示する背景画像。
 */
let backgroundImage = null;


/**
 * 任意画像用のObject URL。
 */
let backgroundObjectUrl = null;


/*
=========================================================
登録画像
=========================================================
*/

/**
 * 登録画像のプルダウンを作成する。
 */
const initializeBackgroundSelect = () => {

  for (const background of BACKGROUND_IMAGES) {

    const option = document.createElement('option');

    option.value = background.path;
    option.textContent = background.label;

    backgroundSelect.appendChild(option);
  }
};


/**
 * 登録画像を読み込む。
 *
 * @param {object} params
 * @param {string} params.imagePath
 * @returns {Promise<HTMLImageElement>}
 */
const loadImage = ({ imagePath }) => {

  return new Promise((resolve, reject) => {

    const image = new Image();

    image.addEventListener('load', () => {
      resolve(image);
    });

    image.addEventListener('error', () => {
      reject(
        new Error(`画像を読み込めませんでした: ${imagePath}`)
      );
    });

    image.src = imagePath;
  });
};


/**
 * 登録画像を選択したときの処理。
 */
const updateBackgroundFromSelect = async () => {

  const imagePath = backgroundSelect.value;

  if (!imagePath) {

    backgroundImage = null;

    render();

    return;
  }

  try {

    const image = await loadImage({
      imagePath
    });

    backgroundImage = image;

    render();

  } catch (error) {

    console.error(error);

    backgroundImage = null;

    render();
  }
};


/*
=========================================================
任意画像
=========================================================
*/

/**
 * 任意画像を選択したときの処理。
 */
const updateBackgroundFromFile = () => {

  const file = backgroundInput.files[0];

  if (!file) {
    return;
  }

  /*
   * 以前のObject URLを解放する。
   */
  if (backgroundObjectUrl) {

    URL.revokeObjectURL(backgroundObjectUrl);

    backgroundObjectUrl = null;
  }

  /*
   * ローカルファイルから
   * ブラウザ内だけで使用するURLを作る。
   */
  backgroundObjectUrl = URL.createObjectURL(file);

  const image = new Image();

  image.addEventListener('load', () => {

    backgroundImage = image;

    render();
  });

  image.addEventListener('error', () => {

    console.error(
      `任意画像を読み込めませんでした: ${file.name}`
    );

    backgroundImage = null;

    render();
  });

  image.src = backgroundObjectUrl;
};


/*
=========================================================
Canvas
=========================================================
*/

/**
 * Canvasをクリアする。
 */
const clearCanvas = () => {

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

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
 */
const drawBackground = () => {

  if (!backgroundImage) {
    return;
  }

  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  const imageWidth = backgroundImage.naturalWidth;
  const imageHeight = backgroundImage.naturalHeight;

  const scale = Math.max(
    canvasWidth / imageWidth,
    canvasHeight / imageHeight
  );

  const drawWidth = imageWidth * scale;
  const drawHeight = imageHeight * scale;

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

  ctx.save();

  ctx.translate(x, y);

  ctx.rotate(
    rotation * Math.PI / 180
  );

  ctx.font = `bold ${fontSize}px sans-serif`;

  ctx.textBaseline = 'middle';

  ctx.lineWidth = 16;
  ctx.strokeStyle = '#000';

  ctx.fillStyle = '#fff';

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

  ctx.restore();
};


/**
 * Canvas全体を再描画する。
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
 * 登録画像が選択された。
 */
backgroundSelect.addEventListener(
  'change',
  () => {

    /*
     * 任意画像の選択を解除する。
     */
    backgroundInput.value = '';

    updateBackgroundFromSelect();
  }
);


/**
 * 任意画像が選択された。
 */
backgroundInput.addEventListener(
  'change',
  () => {

    /*
     * 登録画像の選択を解除する。
     */
    backgroundSelect.value = '';

    updateBackgroundFromFile();
  }
);


/**
 * テキスト変更。
 */
textInput.addEventListener(
  'input',
  () => {
    render();
  }
);


/**
 * X座標変更。
 */
xInput.addEventListener(
  'input',
  () => {
    render();
  }
);


/**
 * Y座標変更。
 */
yInput.addEventListener(
  'input',
  () => {
    render();
  }
);


/**
 * 回転角度変更。
 */
rotationInput.addEventListener(
  'input',
  () => {
    render();
  }
);


/**
 * 文字サイズ変更。
 */
fontSizeInput.addEventListener(
  'input',
  () => {
    render();
  }
);


/*
=========================================================
ダウンロード
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
