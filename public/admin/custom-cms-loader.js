// public/admin/s3-media-library.js

/**
 * 署名付きURLを利用してS3と連携するDecap CMSメディアライブラリ
 * Cloudinary Media Libraryの構成を参考にしています。
 */

// デフォルトオプション：config.ymlで設定されなかった場合のフォールバック
const defaultOptions = {
  // `config.yml`の`media_library.config`で設定されるべき項目
  apiUrl: '', // Netlify Functionのエンドポイント
  // このライブラリ固有のオプション
  output_filename_only: false,
};

/**
 * ライブラリの初期化を行うメイン関数
 * Decap CMSから呼び出され、メディアライブラリオブジェクトを返す
 */
async function init({ options = {}, handleInsert } = {}) {
  // --- 1. 設定のマージ ---
  const { config: providedConfig = {}, ...integrationOptions } = options;
  const resolvedOptions = { ...defaultOptions, ...providedConfig, ...integrationOptions };

  if (!resolvedOptions.apiUrl) {
    throw new Error("S3 media library requires 'apiUrl' in config.yml");
  }

  // --- 2. メディアライブラリUIの生成 (DOMの準備) ---
  // この部分はCloudinaryの `createMediaLibrary` の役割を自前で実装する部分です
  const mediaLibraryContainer = document.createElement('div');
  mediaLibraryContainer.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background-color: rgba(0,0,0,0.5); z-index: 99999;
    display: none; justify-content: center; align-items: center;
  `;
  const modal = document.createElement('div');
  modal.style.cssText = `
    background-color: white; padding: 20px; border-radius: 8px;
    width: 80%; max-width: 900px; height: 80%; display: flex; flex-direction: column;
  `;
  const modalHeader = document.createElement('div');
  modalHeader.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;';
  const modalTitle = document.createElement('h2');
  modalTitle.textContent = 'S3 Media Library';
  const uploadButton = document.createElement('button');
  uploadButton.textContent = 'Upload New File';
  const closeButton = document.createElement('button');
  closeButton.textContent = 'Close';
  
  modalHeader.append(modalTitle, uploadButton, closeButton);

  const imageGrid = document.createElement('div');
  imageGrid.style.cssText = `
    flex-grow: 1; overflow-y: auto; display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px;
  `;
  const loadingIndicator = document.createElement('p');
  loadingIndicator.textContent = 'Loading...';
  
  modal.append(modalHeader, imageGrid);
  mediaLibraryContainer.appendChild(modal);
  document.body.appendChild(mediaLibraryContainer);

  // ファイルアップロード用の非表示input要素
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.hidden = true;
  document.body.appendChild(fileInput);

  // --- 3. UIの振る舞いとAPI連携の定義 ---

  /**
   * S3からファイルリストを取得してグリッドに表示する
   */
  const fetchAndDisplayFiles = async () => {
    imageGrid.innerHTML = ''; // クリア
    imageGrid.appendChild(loadingIndicator);
    try {
      const response = await fetch(`${resolvedOptions.apiUrl}?action=list`);
      const data = await response.json();
      imageGrid.innerHTML = ''; // ローディング表示を削除
      data.files.forEach(file => {
        const imgContainer = document.createElement('div');
        imgContainer.style.cursor = 'pointer';
        const img = document.createElement('img');
        img.src = file.url;
        img.style.width = '100%';
        img.style.height = '120px';
        img.style.objectFit = 'cover';
        img.onclick = () => {
          // 画像がクリックされたら、そのURLをCMSに挿入
          handleInsert(file.url);
          hideMediaLibrary(); // ライブラリを閉じる
        };
        imgContainer.appendChild(img);
        imageGrid.appendChild(imgContainer);
      });
    } catch (error) {
      console.error('Error loading files from S3:', error);
      imageGrid.innerHTML = '<p>Error loading files.</p>';
    }
  };

  /**
   * ファイルアップロード処理
   */
  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // ボタンを一時的に無効化
    uploadButton.disabled = true;
    uploadButton.textContent = 'Uploading...';

    try {
      // 1. 署名付きURLを取得
      const presignResponse = await fetch(
        `${resolvedOptions.apiUrl}?action=upload&fileName=${encodeURIComponent(file.name)}&fileType=${encodeURIComponent(file.type)}`
      );
      const { signedUrl, publicUrl } = await presignResponse.json();

      // 2. S3へアップロード
      await fetch(signedUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });

      // 3. 成功したらCMSにURLを挿入
      handleInsert(publicUrl);
      hideMediaLibrary();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('File upload failed. Check the console for details.');
    } finally {
      // 状態を元に戻す
      uploadButton.disabled = false;
      uploadButton.textContent = 'Upload New File';
      fileInput.value = '';
    }
  };
  
  // イベントリスナーを設定
  uploadButton.onclick = () => fileInput.click();
  fileInput.onchange = handleUpload;

  // --- 4. メディアライブラリのコントローラーを定義 (show/hide) ---

  const showMediaLibrary = () => {
    mediaLibraryContainer.style.display = 'flex';
    fetchAndDisplayFiles();
  };

  const hideMediaLibrary = () => {
    mediaLibraryContainer.style.display = 'none';
  };
  
  closeButton.onclick = hideMediaLibrary;

  // --- 5. Decap CMSに返す最終的なオブジェクト ---
  // このオブジェクトがCMSのMedia Libraryとして機能する
  return {
    show: () => showMediaLibrary(),
    hide: () => hideMediaLibrary(),
    enableStandalone: () => true,
  };
}

// Cloudinaryの例と同様に、CMSに登録するための最終オブジェクトを定義
const s3MediaLibrary = { name: 's3-custom-ui', init };

// エクスポート（モジュールとして利用する場合）
const DecapCmsMediaLibraryS3 = s3MediaLibrary;

// 作成したライブラリをグローバルなCMSオブジェクトに登録する
CMS.registerMediaLibrary(s3MediaLibrary);

window.addEventListener('DOMContentLoaded', async () => {
    try {
      // config.yml を手動で取得・解析
      const response = await fetch('config.yml');
      if (!response.ok) {
          throw new Error(`Could not load config.yml. Status: ${response.status}`);
      }
      const configText = await response.text();
      const config = jsyaml.load(configText);
  
      // 最後に、解析したconfigオブジェクトを使ってCMSを起動
      CMS.init({ config });
  
    } catch (error) {
      console.error('CMS initialization failed:', error);
    }
  });
