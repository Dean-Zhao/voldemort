// 点击测试按钮轮询方法
function api_testcase_test(){
	let api_no = $("#api_id").attr("data-id");
	let case_no = $("#case_id").attr("data-id");
	let count = $("#tab_validations_form").attr("tct");
	let $btn = $("#testButton").button('loading');
	let interval = setInterval(function(){
		$.ajax({
			type : "Post",
			url : "/api/casetest/"+case_no+"/",
			// data : res,
			// dataType : "json",
			async : false,
			success : function(data) {
				if(data["status"] === 0){
					clearInterval(interval);
					//处理测试结果；
					for (var i = 1; i <= count; i++) {
						if (data["?"][i]===0) {
							$("#va_result"+data["?"][i]).html(data["?"][i]);
							$("#va_check"+data["?"][i]).html('<i class="fa fa-check-circle" aria-hidden="true"></i>');
						}
						else{
							$("#va_result"+data["?"][i]).html(data["?"][i]);
							$("#va_check"+data["?"][i]).html('<i class="fa fa-exclamation-circle" aria-hidden="true"></i>');							
						}
				 	}
					$btn.button('reset');
				} 
			},
			error : function(data) {
				 clearInterval(interval);
				 for (var i = 1; i <= count; i++) {
				 	$("#va_result"+i).html("系统错误");
				 	$("#va_check"+i).html('<i class="fa fa-exclamation-circle" aria-hidden="true"></i>');
				 }
				 $btn.button('reset');
			}
		});
	}, 10);
}