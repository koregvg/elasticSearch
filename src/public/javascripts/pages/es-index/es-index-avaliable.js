function checkAdd(cb) {
	var num = 0;

	$(".unnull").each(function (i, ele) {
		var t = 0;
		var s = 0;
		UnnullClear($(this));
		if ($(this).find("input").val() == "") {
			num++;
			t = 1;
		}
		if ($(this).find("select").val() == 0) {
			num++;
			s = 1;
		}
		if (t == 1) {
			AddError(ele, "此处为必填项");
		}
		if (s == 1) {
			AddError(ele, "此处为必填项");
		}
	});

	if (num == 0) {
		$("#aye").button('loading');
		setTimeout(cb,1000);
	}

	function UnnullClear(ele) {

		if ($(ele).find("span").eq(0).text()!="") {
			RmError(ele,"");
		}
	}

	function AddError(ele, text) {
		$(ele).find("span").eq(0).text(text);
	}

	function RmError(ele, text) {
		$(ele).find("span").eq(0).text(text);
	}
}

module.exports=checkAdd;