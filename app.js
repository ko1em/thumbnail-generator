```javascript
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
    label: '背景1',
    path: './images/background01.jpg'
  },
  {
    label: '背景2',
    path: './images/background02.jpg'
  },
  {
    label: '背景3',
    path: './images/background03.jpg'
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
 */
let backgroundImage = null;

/**
 * 現在作成している一時URL。
 *
 * 任意画像を選択したときに使用する。
 */
let backgroundObjectUrl = null;


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
画像読み込み
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
      reject(
        new Error(`画像を読み込めませんでした: ${imagePath}`)
      );
    });

    image.src = imagePath;
  });
};


/**
 * 現在の一時URLを解放する。
 */
const revokeBackgroundObjectUrl = () => {

  if (!backgroundObjectUrl) {
    return;
  }

  URL.revokeObjectURL(backgroundObjectUrl);

  backgroundObjectUrl = null;
};


/*
=========================================================
登録画像
=========================================================
*/

/**
 * プルダウンで選択された登録画像を読み込む。
 */
const updateBackgroundImageFromSelect = async () => {

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
任意画像
=========================================================
*/

/**
 * PCから選択した任意画像を読み込む。
 */
const updateBackgroundImageFromFile = () => {

  const file = backgroundInput.files[0];

  if (!file) {
    return;
  }

  /*
   * 以前の一時URLがあれば解放する。
   */
  revokeBackgroundObjectUrl();

  /*
   * 選択したローカルファイルから
   * ブラウザ内で一時URLを作成する。
   */
  backgroundObjectUrl = URL.createObjectURL(file);

  const image = new Image();

  image.addEventListener('load', () => {

    backgroundImage = image;

    render();
  });

  image.addEventListener('error', () => {

    console.error(
      `画像を読み込めませんでした: ${file.name}`
    );

    backgroundImage = null;

    revokeBackgroundObjectUrl();

    render();
  });

  image.src = backgroundObjectUrl;
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
 * 登録画像が変更された。
 */
backgroundSelect.addEventListener(
  'change',
  () => {

    /*
     * 登録画像を選択した場合、
     * 任意画像の選択状態を解除する。
     */
    backgroundInput.value = '';

    revokeBackgroundObjectUrl();

    updateBackgroundImageFromSelect();
  }
);


/**
 * 任意画像が選択された。
 */
backgroundInput.addEventListener(
  'change',
  () => {

    if (!backgroundInput.files[0]) {
      return;
    }

    /*
     * 任意画像を選択した場合、
     * 登録画像の選択状態を解除する。
     */
    backgroundSelect.value = '';

    updateBackgroundImageFromFile();
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
```
