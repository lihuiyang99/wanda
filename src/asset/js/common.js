$(function() {
	//全局替换#
	replaceAlink();
});

//==========================================================
//延时执行常配合resize使用
//==========================================================

function delay_exec(id, wait_time, callback_f) {
	if(typeof window['delay_exec'] === "undefined")
		window['delay_exec'] = [];
	if(typeof window['delay_exec'][id] !== "undefined")
		clearTimeout(window['delay_exec'][id]);
	window['delay_exec'][id] = setTimeout(callback_f, wait_time);
};

//==========================================================
//全局替换空链接
//==========================================================

function replaceAlink() {
	$.each($("a"), function(index, value) {
		var aHref = $(this).attr("href");
		if(aHref == "javascript:void(0)" || aHref == "" || aHref == "#") {
			$(this).removeAttr("target");
			$(this).attr("href", "javascript:void(0)");
		}
	})
};

//==========================================================
//左右翻页，html文件名称p1.html...p100.html
//==========================================================

document.onkeydown = chang_page

function chang_page(ev) {
	var evt = ev || window.event;
	var arr = /(\d+)-?(\d*).html/g.exec(window.location.pathname);
	var numarr = arr[0].split(".");
	var countdesc = parseInt(numarr[0]) - 1 > 0 ? parseInt(numarr[0]) - 1 : 1;
	var countasc = parseInt(numarr[0]) + 1;
	if(evt.keyCode == 37 || evt.keyCode == 33) location.href = window.location.pathname.replace(arr[0], countdesc + '.html');
	if(evt.keyCode == 39 || evt.keyCode == 34) location.href = window.location.pathname.replace(arr[0], countasc + '.html');
}

//==========================================================
//模拟alert
//==========================================================
var alertStr, alertStr2, alertStr3;

function alert(txt) {
	alertStr = '<div class="alert">';
	alertStr += '<div class="alertInner">';
	alertStr += '<h2>';
	alertStr2 = '</h2>';
	alertStr2 += '<a href="javascript:;">好</a>';
	alertStr2 += '</div></div>';
	alertStr3 = alertStr + txt + alertStr2;
	$("body").append(alertStr3);
	var wh = $(window).height()
	var thisH = $(".alertInner").height()
	$(".alertInner").css("top", (wh - thisH) / 2)
	$(".alert a").on("click", function() {
		$(this).parent().parent().remove();
	})
}
//==========================================================
//模拟confirm
//==========================================================
function confirmTest(tit, con, yes, no, type, url) {
	var confirmStr = '';
	confirmStr += '<div class="confirmeBox">';
	confirmStr += '<div class="confirmeBoxInner">';
	confirmStr += '<h2>' + tit + '</h2>';
	confirmStr += '<div>' + con + '</div>';
	confirmStr += '<p class="btnGroup"><a href="javascript:;" class="true">' + yes + '</a><a href="javascript:;" class="false">' + no + '</a></p>';
	confirmStr += '</div></div>';
	$("body").append(confirmStr);
	$(".confirmeBox").show();
	$(".confirmeBox .true").on('click', function() {
		if(type == 1) {
			window.location.href = url;
		} else {
			return true;
		}
	});
	$(".confirmeBox .false").on('click', function() {
		$(".confirmeBox").remove();
		return false;
	});
}

//rem响影适配
(function(doc, win) {
	var docEl = doc.documentElement,
		resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
		recalc = function() {
			var clientWidth = docEl.clientWidth;
			if(!clientWidth) return;
			docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
		};

	if(!doc.addEventListener) return;
	win.addEventListener(resizeEvt, recalc, false);
	doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);