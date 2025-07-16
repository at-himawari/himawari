// このスクリプトは、index.htmlで先に読み込まれたグローバルな「CMS」オブジェクトが存在することを前提としています。

/**
 * S3メディアライブラリの実際の機能を持つオブジェクトを作成する関数
 * @param {object} options - config.yml の media_library セクションの内容
 */
function createS3MediaLibrary(options) {
  const apiUrl = options.config.apiUrl;

  return {
    name: "s3_signed",
    config: options.config,

    async upload(file) {
      const presignResponse = await fetch(
        `${apiUrl}?action=upload&fileName=${encodeURIComponent(
          file.name
        )}&fileType=${encodeURIComponent(file.type)}`
      );
      if (!presignResponse.ok) {
        throw new Error(
          `Failed to get pre-signed URL: ${await presignResponse.text()}`
        );
      }
      const { signedUrl, key, publicUrl } = await presignResponse.json();

      await fetch(signedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      return {
        id: key,
        name: file.name,
        url: publicUrl,
        size: file.size,
        file,
      };
    },

    async delete(mediaFile) {
      if (!mediaFile.id) {
        throw new Error("File ID is missing.");
      }
      const deleteResponse = await fetch(
        `${apiUrl}?action=delete&key=${encodeURIComponent(mediaFile.id)}`
      );
      if (!deleteResponse.ok) {
        throw new Error(
          `Failed to delete file: ${await deleteResponse.text()}`
        );
      }
    },

    async list() {
      const response = await fetch(`${apiUrl}?action=list`);
      if (!response.ok) {
        throw new Error(`Failed to list files: ${await response.text()}`);
      }
      const data = await response.json();
      return { files: data.files };
    },

    async getMedia() {
      return [];
    },

    enableStandalone: () => true,
  };
}

/**
 * Decap CMSにライブラリを登録するためのオブジェクト
 */
const s3MediaLibrary = {
  // この `name` は config.yml の `media_library.name` と一致する必要はありません。
  // CMSは登録時に `init` が返すオブジェクトの `name` を正として使います。
  name: "s3_signed",
  init: function ({ options }) {
    // CMSから渡されるオブジェクトから `options` を取り出し、
    // それを元にライブラリのインスタンスを作成して返す。
    return createS3MediaLibrary(options);
  },
};


// 作成したライブラリをグローバルなCMSオブジェクトに登録する
CMS.registerMediaLibrary(s3MediaLibrary);
