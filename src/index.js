const remote = require('electron').remote;
const Dialog = remote.dialog;
const browserWindow = remote.BrowserWindow;
const fsExtra = require('fs-extra');

$('#folderSelect').click(() => {
    let result = Dialog.showOpenDialog(null, {
        properties: ['openDirectory'],
        title: '保存先フォルダ',
        defaultPath: '.'
    }, (folderNames) => {
        console.log(folderNames);
    });

    result.then(function(value){
        $('#selectedfolder').val(value['filePaths'])
        $('#selectedfolderdisplay').text(value['filePaths'])
    });
});


$('#fileSelect').click(() => {
    let result = Dialog.showOpenDialog(null, {
        properties: ['openFile'],
        title: 'CSVファイル',
        defaultPath: '.',
        filters: [
            {name: 'CSVファイル', extensions: ['csv']},
        ]
    }, (fileNames) => {
        console.log(fileNames);
    });

    result.then(function(value){
        $('#selectedfile').val(value['filePaths'])
        $('#selectedfiledisplay').text(value['filePaths'])

    });
});

function urlopen(url){
    const {shell} = require('electron');
    shell.openExternal(url);
}

$('.modal-close, .refinemodal-bottom-close, .refinemodal-bottom-btn').click(function(){
    closeModal();
});

function closeModal() {

    let $modal;
    $modal = $('#modal');

    //イベントリスナーを無効にする
    window.removeEventListener('popstate',null);

    //モーダルを非表示にする
    if($modal && $modal.length > 0){
        $modal.fadeOut(300);
        $modal.remove();
    }
}