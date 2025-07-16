// s3-media-library-register.js で登録処理が終わっていることが前提

async function init() {
    // config.yml を手動で取得する
    const response = await fetch('config.yml');
    const configText = await response.text();
    
    // 取得したテキストをYAMLとして解析する
    const config = jsyaml.load(configText);
  
    // 解析したconfigオブジェクトを使って、手動でCMSを初期化する
    CMS.init({ config });
  }
  
  // ページの準備が完了したら、init関数を実行する
  window.addEventListener('DOMContentLoaded', init);