////////////////////////////////////////////////////
// UA判定 //
////////////////////////////////////////////////////
var userAgent = navigator.userAgent;
var UA_Android = (userAgent.indexOf('Android') > -1)? true:false;
var UA_Android_version = parseFloat(userAgent.slice(userAgent.indexOf('Android')+8, userAgent.indexOf('Android')+11),10);
var UA_iPhone = (userAgent.indexOf('iPhone') > -1)? true:false;
var UA_iPod = (userAgent.indexOf('iPod') > -1)? true:false;
var UA_iPad = (userAgent.indexOf('iPad') > -1)? true:false;
var UA_IE11 = (userAgent.indexOf('MSIE 11.0') > -1)?true:false;

var UA_SP = false;
var UA_PC = false;
if (navigator.userAgent.indexOf('iPhone') !== -1) {
var UA_SP = true;
}else if (navigator.userAgent.indexOf('Android') > -1 && navigator.userAgent.indexOf('Mobile') > -1){
var UA_SP = true;
} else if (navigator.userAgent.indexOf('iPad') !== -1) {
var UA_PC = true;
} else if (navigator.userAgent.indexOf('Android') > -1 && navigator.userAgent.indexOf('Mobile') < 0) {
var UA_PC = true;
} else {
var UA_PC = true;
}

///////////////////////////////////////////////////////
////デバイス幅判定の変数///
///////////////////////////////////////////////////////
var deviceType;
var isFixed = false;
var isPagetop = false;
var BREAKPOINT1 = 768;
var BREAKPOINT2 = 1180;


///////////////////////////////////////////////////////
////DOM CONTENT LOADED///
///////////////////////////////////////////////////////
$(document).ready(function () {

	///////////////////////////////////////////////////////
	////デバイス幅判定の処理///
	///////////////////////////////////////////////////////
	//ドキュメント読み込み時
	setDeviceType();

	//リサイズ時
	$(window).on('resize',function(){
		setDeviceType();
	});

	function setDeviceType(){
		var winW = window.innerWidth;
		if(winW >= BREAKPOINT2){//1180以上
			changeToPc();//pc
		} else if (winW < BREAKPOINT2 &&  BREAKPOINT1 < winW){//1180以下、768以上
			changeToTab();//tab
		} else if (winW <= BREAKPOINT1){//768以下
			changeToSp();//sp
		}
	}

	//pcに切り替わった時の処理
	function changeToPc(){
		if(deviceType != 'pc'){
			deviceType = 'pc';
			changeToOther();
			console.log('pc');
		}
	}

	//Tabに切り替わった時の処理
	function changeToTab(){
		if(deviceType != 'tab'){
			deviceType = 'tab';
			changeToOther();
			console.log('tab');
		}
	}

	//spに切り替わった時の処理
	function changeToSp(){
		if(deviceType != 'sp'){
			deviceType = 'sp';
			changeToOther();
			console.log('sp');
		}
	}

	//切り替えが起こった際に処理したい内容を記述
	function changeToOther(){

		//ヘッダーの調整
		adjustHeader();

		//スクロールの高さを再設定
		setTimeout(scrollAdjust,300);
	}

	///////////////////////////////////////////////////////
	////ページ中のモーダル表示 ///
	///////////////////////////////////////////////////////

	var $modal; //ブラウザバックで閉じる用にモーダルを変数に格納
	var willremove = false; //ブラウザバックで閉じた際に要素を削除するかのフラグ

	//用意しておいたモーダルウィンドウを表示する
	$('.modal-refine').click(function(ev){
		ev.preventDefault();
		if(!$(this).hasClass('refinebtn-disabled')){
			var target = $(this).attr('data-target');
			$modal = $('#' + target);
			$modal.fadeIn(300);
			$modal.find('.refinemodal-wrap').scrollTop(0);

			//ブラウザバック用
			willremove = false;
			pushHistory();
		}
	});

	$('.modal-close, .refinemodal-bottom-close, .refinemodal-bottom-btn').click(function(){
		closeModal();
	});


	///////////////////////////////////////////////////////
	////アコーディオン///
	///////////////////////////////////////////////////////

	$('.accordion-title').click(function(){
		if($(this).hasClass('is-active')){
			$(this).removeClass('is-active');
			$(this).next('.accordion-box').find('.accordion-box-inner').removeClass('is-active');
			$(this).next('.accordion-box').slideUp();
		} else {
			$(this).addClass('is-active');
			$(this).next('.accordion-box').slideDown();
			$(this).next('.accordion-box').find('.accordion-box-inner').addClass('is-active');
		}
	});

	//ハッシュで見出しのidが指定されている場合は表示時にアコーディオンを開く
	if(location.hash!=""){
		$('.accordion-title'+location.hash).addClass('is-active');
		$('.accordion-title'+location.hash).find('.accordion-box-inner').removeClass('is-active');
		$('.accordion-title'+location.hash).next('.accordion-box').show();
	}

	$('.js-more').click(function(ev){
		ev.preventDefault();
		if($(this).hasClass('is-active')){
			$($(this).attr('data-target')).addClass('disnone');
			$(this).removeClass('is-active');
			$(this).text($(this).data('text-before'));
		} else {
			$($(this).attr('data-target')).removeClass('disnone');
			$(this).addClass('is-active');
			$(this).text($(this).data('text-after'));
		}
	});

	///////////////////////////////////////////////////////
	////【共通】スクロール処理 ///
	///////////////////////////////////////////////////////

	//初期設定
	var scTop;
	var toolTrigger1,toolTrigger2,headerTrigger1,Tool1,Tool2;

	function scrollAdjust(){
		toolTrigger1 = 150;
		toolTrigger2 = $(document).height() - $(window).height() - $('.l-footer').height() + 55;
		//headerTrigger1 = $('.l-header-inner').offset().top;
		Tool1 = false;
		Tool2 = false;
		//console.log($(document).height());
		//console.log($(window).height());
		//console.log($('.l-footer').height());
		//console.log(toolTrigger2);
	}

	///////////////////////////////////////////////////////
	////  リスト型アコーディオンの開閉 ///
	///////////////////////////////////////////////////////

	//アコーディオンリスト要素の外に開閉するボックスがある場合（単純移行対応）
	$('.accordion-list-item-title.no-li').next('div').addClass('accordion-list-item-box');
	if($('.accordion-list-item-title.no-li').length){
		$('.accordion-list-item-box').filter(":last").after('<hr class="mt-0">');
	}

	//ハッシュで見出しのidが指定されている場合は表示時にアコーディオンを開く
	if(location.hash!=""){
		$('.accordion-list-item-title.no-li'+location.hash).addClass('is-active');
		$('.accordion-list-item-title.no-li'+location.hash).next('div').show();
	}

	//クリック時に開閉する
	$('.accordion-list-item-title').click(function(){
		var $this = $(this);
		if($this.hasClass('is-active')){
			$this.next('.accordion-list-item-box').slideUp();
			setTimeout(function(){
				$this.removeClass('is-active');
			},300);
		} else {
			$this.next('.accordion-list-item-box').slideDown();
			setTimeout(function(){
				$this.addClass('is-active');
			},300);
		}
	});

	//PC
	function adjustHeader(){
	}


});
