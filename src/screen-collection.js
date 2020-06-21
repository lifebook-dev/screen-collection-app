//もろもろの定数
const fs = require('fs');
const parse = require('csv-parse/lib/sync');
const puppeteer = require("puppeteer");

let emulateDevices = '';
let basicUser = '';
let basicPass = '';
const DEFAULT_VIEWPORT = {
  width: 1200,
  height: 1000,
  deviceScaleFactor: 1,
};
const WAIT_FOR = 3000; // ページ描画の待機時間（ミリ秒）

const button = document.querySelector('.js-button');

button.addEventListener('click', function (clickEvent) {


  //バリデーション
  if($('#selectedfile').val() === ''){
    alert('CSVファイルを指定してください')
    return false
  }

  if($('#selectedfolder').val() === ''){
    alert('保存フォルダを指定してください')
    return false
  }

  if($('#selecteddevice').val() !== 'pc'){
    emulateDevices = puppeteer.devices[$('#selecteddevice').val()]
  }

  if($('#basicUser').val() === '' && $('#basicPass').val() === ''){
    basicUser = $('#basicUser').val();
    basicPass = $('#basicPass').val();
  }


  let file = $('#selectedfile').val()

  let $modal;
  $modal = $('#modal');
  $modal.fadeIn(300);
  $modal.find('.refinemodal-wrap').scrollTop(0);

  //全体の処理を包括
  !(async() => {
    try {

      const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: DEFAULT_VIEWPORT,
        ignoreDefaultArgs: ['--disable-extensions'],
      });

      //CSVファイル読み取り
      const options = { columns: true };
      const records = readCsvSync(file,options);
      const totall  = records.length

      for (let i = 0; i < totall; i++) {
        await screenshotPageScroll(browser,records[i].url,records[i].title,i+1,totall);
      }

      $('#loadingImage').hide()
      $('.running-info').hide()
      $('#runningTitle').text('finshed!')

      await browser.close();

    } catch (e) {
      console.error(e)
    }
  })()

})


/**
 * ページスクロールし、ページ全体のスクショ取得
 * @param browser
 * @param url
 * @param title
 * @param number
 * @param all
 * @returns {Promise<void>}
 */
async function screenshotPageScroll(browser,url,title,number,all) {
  const context = await browser.createIncognitoBrowserContext();

  const page = await context.newPage();

  //エミュレーターの指定
  if(emulateDevices !== ''){
    await page.emulate(emulateDevices);//エミュレートするデバイスを指定
  }

  //Basic認証の設定
  if(basicUser !== '' && basicPass !== ''){
    await page.authenticate({ username: basicUser, password: basicPass });
  }

  await page.goto(url, {waitUntil: 'networkidle2'});

  await page.evaluate(() => {
    let lastScrollTop = document.scrollingElement.scrollTop;

    // ページ全長を取得
    const scroll = () => {
      document.scrollingElement.scrollTop += 100;
      if (document.scrollingElement.scrollTop !== lastScrollTop) {
        lastScrollTop = document.scrollingElement.scrollTop;
        requestAnimationFrame(scroll);
      }
    };
    scroll();
  });

  await page.waitFor(WAIT_FOR); // ページ描画の待機

  let selectedfolder = $('#selectedfolder').val()

  //スクショ撮って、保存
  await page.screenshot({
    path: selectedfolder+'/'+title+'.png',
    fullPage: true
  });

  //進捗メッセージ
  $('.running-info').html('title:  '+title+' done <br>' + number+'/'+all+' finshed!')

  await context.close();
  return;
}

/**
 * CSVファイル読み取り
 * @param filename
 * @param options
 */
function readCsvSync(filename, options) {
  const content = fs.readFileSync(filename).toString();
  return parse(content, options);
}