/**
 * 署名付きURLを利用してS3と連携するDecap CMSメディアライブラリ (UI改善版)
 * Cloudinary Media Libraryの構成を参考にしています。
 */

// デフォルトオプション：config.ymlで設定されなかった場合のフォールバック
const defaultOptions = {
  // `config.yml`の`media_library.config`で設定されるべき項目
  apiUrl: "", // Netlify Functionのエンドポイント
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
  const resolvedOptions = {
    ...defaultOptions,
    ...providedConfig,
    ...integrationOptions,
  };

  if (!resolvedOptions.apiUrl) {
    throw new Error("S3 media library requires 'apiUrl' in config.yml");
  }

  // --- 状態管理用変数 ---
  let selectedFile = null; // 選択中のファイル情報を保持

  // --- 2. メディアライブラリUIの生成 (DOMの準備) ---
  const mediaLibraryContainer = document.createElement("div");
  mediaLibraryContainer.id = "s3-media-library";
  mediaLibraryContainer.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background-color: rgba(0, 0, 0, 0.6); z-index: 10000;
    display: none; justify-content: center; align-items: center;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  `;

  const modal = document.createElement("div");
  modal.style.cssText = `
    background-color: #f9f9f9; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    width: 90%; max-width: 1200px; height: 85%;
    display: flex; flex-direction: column; overflow: hidden;
  `;

  // ヘッダー
  const modalHeader = document.createElement("div");
  modalHeader.style.cssText = `
    display: flex; justify-content: space-between; align-items: center;
    padding: 15px 25px; border-bottom: 1px solid #e0e0e0; background-color: #fff;
  `;
  const modalTitle = document.createElement("h2");
  modalTitle.textContent = "S3 Media Library";
  modalTitle.style.cssText = "font-size: 1.2rem; margin: 0; color: #333;";
  const closeButton = document.createElement("button");
  closeButton.textContent = "×";
  closeButton.style.cssText = `
    background: none; border: none; font-size: 2rem; color: #888; cursor: pointer;
    line-height: 1; padding: 0;
  `;

  modalHeader.append(modalTitle, closeButton);

  // メインコンテンツエリア (グリッドとサイドバー)
  const modalContent = document.createElement("div");
  modalContent.style.cssText = "display: flex; flex-grow: 1; min-height: 0;"; // min-height for flexbox scroll

  // ファイルグリッド
  const gridContainer = document.createElement("div");
  gridContainer.style.cssText = "flex: 3; overflow-y: auto; padding: 20px;";
  const imageGrid = document.createElement("div");
  imageGrid.style.cssText = `
    display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 15px;
  `;
  gridContainer.appendChild(imageGrid);

  // 詳細サイドバー
  const sidebar = document.createElement("div");
  sidebar.style.cssText = `
    flex: 1; background-color: #fff; border-left: 1px solid #e0e0e0;
    padding: 20px; display: flex; flex-direction: column;
  `;

  const sidebarContent = document.createElement("div");
  sidebarContent.innerHTML = `<p style="color: #888;">Select a file to see details.</p>`;
  sidebar.appendChild(sidebarContent);

  // フッター
  const modalFooter = document.createElement("div");
  modalFooter.style.cssText = `
    padding: 15px 25px; border-top: 1px solid #e0e0e0; background-color: #fff;
    display: flex; justify-content: flex-end; align-items: center; gap: 10px;
  `;
  const uploadButton = document.createElement("button");
  uploadButton.textContent = "Upload New File";
  uploadButton.className = "s3-media-button primary"; // class for styling
  const insertButton = document.createElement("button");
  insertButton.textContent = "Insert Selected";
  insertButton.className = "s3-media-button";
  insertButton.disabled = true;

  // ボタン用の共通スタイルを追加
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
    .s3-media-button {
      padding: 8px 16px; border-radius: 5px; border: 1px solid #ccc;
      background-color: #fff; cursor: pointer; font-weight: 500;
      transition: background-color 0.2s, border-color 0.2s;
    }
    .s3-media-button:hover { background-color: #f0f0f0; }
    .s3-media-button.primary {
      background-color: #3b82f6; color: white; border-color: #3b82f6;
    }
    .s3-media-button.primary:hover { background-color: #2563eb; }
    .s3-media-button:disabled {
      background-color: #e0e0e0; border-color: #e0e0e0;
      color: #999; cursor: not-allowed;
    }
    .img-container.selected {
      box-shadow: 0 0 0 3px #3b82f6; border-radius: 5px;
    }
    .loader {
      width: 48px; height: 48px; border: 5px solid #FFF;
      border-bottom-color: #3b82f6; border-radius: 50%;
      display: inline-block; box-sizing: border-box;
      animation: rotation 1s linear infinite; margin: auto;
    }
    @keyframes rotation { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  `;
  document.head.appendChild(styleSheet);

  modalFooter.append(uploadButton, insertButton);
  modalContent.append(gridContainer, sidebar);
  modal.append(modalHeader, modalContent, modalFooter);
  mediaLibraryContainer.appendChild(modal);
  document.body.appendChild(mediaLibraryContainer);

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.multiple = true; // 複数選択を許可
  fileInput.hidden = true;
  document.body.appendChild(fileInput);

  // --- 3. UIの振る舞いとAPI連携の定義 ---

  /**
   * 選択されたファイルの詳細をサイドバーに表示する
   */
  const updateSidebar = () => {
    if (selectedFile) {
      const fileName = selectedFile.key || selectedFile.url.split('/').pop();
      sidebarContent.innerHTML = `
        <h3 style="margin-top:0; margin-bottom: 15px; font-size: 1rem;">File Details</h3>
        <img src="${selectedFile.url}" style="width: 100%; height: auto; max-height: 200px; object-fit: contain; border: 1px solid #eee; margin-bottom: 15px;">
        <p style="margin: 5px 0; font-size: 0.9rem; word-break: break-all;"><strong>Name:</strong> ${fileName}</p>
        <p style="margin: 5px 0; font-size: 0.9rem;"><strong>URL:</strong> <input type="text" value="${selectedFile.url}" readonly style="width: 100%; padding: 5px; border: 1px solid #ccc; font-size: 0.8rem;"></p>
      `;
      insertButton.disabled = false;
    } else {
      sidebarContent.innerHTML = `<p style="color: #888;">Select a file to see details.</p>`;
      insertButton.disabled = true;
    }
  };

  /**
   * グリッド内の画像の選択状態を更新する
   */
  const updateGridSelection = () => {
    document.querySelectorAll(".img-container").forEach((container) => {
      if (selectedFile && container.dataset.key === selectedFile.key) {
        container.classList.add("selected");
      } else {
        container.classList.remove("selected");
      }
    });
  };

  /**
   * S3からファイルリストを取得してグリッドに表示する
   */
  const fetchAndDisplayFiles = async () => {
    imageGrid.innerHTML = `<div class="loader"></div>`;
    try {
      const response = await fetch(`${resolvedOptions.apiUrl}?action=list`);
      const data = await response.json();
      imageGrid.innerHTML = "";
      data.files.forEach((file) => {
        const imgContainer = document.createElement("div");
        imgContainer.className = "img-container";
        imgContainer.dataset.key = file.key; // 識別子としてキーを使用
        imgContainer.style.cssText = `
            cursor: pointer; padding: 5px; border: 1px solid transparent;
            transition: all 0.2s; position: relative;
        `;
        imgContainer.addEventListener(
          "mouseenter",
          () => (imgContainer.style.backgroundColor = "#eee")
        );
        imgContainer.addEventListener(
          "mouseleave",
          () => (imgContainer.style.backgroundColor = "transparent")
        );

        const img = document.createElement("img");
        img.src = file.url;
        img.style.cssText = `
            width: 100%; height: 120px; object-fit: cover;
            display: block; border-radius: 4px;
        `;
        const fileName = document.createElement("p");
        fileName.textContent = file.key;
        fileName.style.cssText = `
            font-size: 0.8rem; text-align: center; margin-top: 5px;
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        `;

        imgContainer.onclick = () => {
          selectedFile = file;
          updateSidebar();
          updateGridSelection();
        };

        imgContainer.append(img, fileName);
        imageGrid.appendChild(imgContainer);
      });
    } catch (error) {
      console.error("Error loading files from S3:", error);
      imageGrid.innerHTML = `<p style="color: #d32f2f;">Error loading files. Check console for details.</p>`;
    }
  };

  /**
   * ファイルアップロード処理
   */
  const handleUpload = async (files) => {
    if (!files || files.length === 0) return;

    uploadButton.disabled = true;
    uploadButton.textContent = `Uploading ${files.length} file(s)...`;
    let lastUploadedUrl = null;

    try {
      for (const file of files) {
        // 1. 署名付きURLを取得
        const presignResponse = await fetch(
          `${
            resolvedOptions.apiUrl
          }?action=upload&fileName=${encodeURIComponent(
            file.name
          )}&fileType=${encodeURIComponent(file.type)}`
        );
        const { signedUrl, publicUrl } = await presignResponse.json();

        // 2. S3へアップロード
        await fetch(signedUrl, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        });

        lastUploadedUrl = publicUrl; // 最後にアップロードしたURLを記録
      }

      // 3. 成功したらリストを更新
      await fetchAndDisplayFiles();
      // (オプション) アップロードしたばかりのファイルを選択状態にする
      // この実装はAPIがファイルキーを返す必要があるため、今回は省略
      alert(`${files.length} file(s) uploaded successfully!`);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("File upload failed. Check the console for details.");
    } finally {
      // 状態を元に戻す
      uploadButton.disabled = false;
      uploadButton.textContent = "Upload New File";
      fileInput.value = "";
    }
  };

  // ドラッグ&ドロップのイベントリスナー
  const setupDragAndDrop = () => {
    const dropZone = modalContent; // ドロップエリア
    dropZone.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.style.backgroundColor = "#eef2ff";
    });
    dropZone.addEventListener("dragleave", (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.style.backgroundColor = ""; // 元の色に戻す
    });
    dropZone.addEventListener("drop", (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.style.backgroundColor = "";
      const files = e.dataTransfer.files;
      handleUpload(files);
    });
  };

  // イベントリスナーを設定
  uploadButton.onclick = () => fileInput.click();
  fileInput.onchange = (e) => handleUpload(e.target.files);
  insertButton.onclick = () => {
    if (selectedFile) {
      handleInsert(selectedFile.url);
      hideMediaLibrary();
    }
  };
  setupDragAndDrop();

  // --- 4. メディアライブラリのコントローラーを定義 (show/hide) ---

  const showMediaLibrary = () => {
    mediaLibraryContainer.style.display = "flex";
    // 表示時に状態をリセット
    selectedFile = null;
    updateSidebar();
    updateGridSelection();
    insertButton.disabled = true;
    fetchAndDisplayFiles();
  };

  const hideMediaLibrary = () => {
    mediaLibraryContainer.style.display = "none";
  };

  closeButton.onclick = hideMediaLibrary;

  // --- 5. Decap CMSに返す最終的なオブジェクト ---
  return {
    show: showMediaLibrary,
    hide: hideMediaLibrary,
    enableStandalone: () => true,
  };
}

// Cloudinaryの例と同様に、CMSに登録するための最終オブジェクトを定義
const s3MediaLibrary = { name: "s3_signed", init };

// グローバルなCMSオブジェクトに登録
if (window.CMS) {
  CMS.registerMediaLibrary(s3MediaLibrary);
}

// config.ymlの読み込みとCMSの初期化 (変更なし)
window.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/admin/config.yml");
    if (!response.ok) {
      throw new Error(`Could not load config.yml. Status: ${response.status}`);
    }
    const configText = await response.text();
    // js-yamlライブラリが読み込まれていることを想定
    const config = jsyaml.load(configText);
    CMS.init({ config });
  } catch (error) {
    console.error("CMS initialization failed:", error);
  }
});
