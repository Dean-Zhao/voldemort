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
			dataType : "json",
			async : false,
			success : function(data) {
				let result = data["result"];
				let mes = data["message"];
				let count = result["count"];
				let response = JSON.stringify(data["result"]["response"]);
				let html = [];
				let mainObj = $('#tab_validations_form');
				if(data["status"] === 0){
					clearInterval(interval);
					//处理测试结果；
					$("#case_response").html(response);
					for (var i = 0; i < count; i++) {
						let desc = result["vals"][i]["is_pass"];
						if (desc == 1) {
							html.push('<div class="form-group case_info_detail" id="validations_area">');
							html.push('<span class="key_name">'+result["vals"][i]["key"]+'</span>');
							html.push('<span class="key_value">'+result["vals"][i]["exp_value"]+'</span>');
							html.push('<span class="key_result">'+result["vals"][i]["value"]+'</span>');
							html.push('<span class="pull-right"><i class="fa fa-check-circle" aria-hidden="true"></i></span>');
							html.push('</div>');
						}
						else{
							html.push('<div class="form-group case_info_detail" id="validations_area">');
							html.push('<span class="key_name">'+result["vals"][i]["key"]+'</span>');
							html.push('<span class="key_value">'+result["vals"][i]["exp_value"]+'</span>');
							html.push('<span class="key_result">'+result["vals"][i]["value"]+'</span>');
							html.push('<span class="pull-right"><i class="fa fa-exclamation-circle" aria-hidden="true"></i></span>');
							html.push('</div>');
						}
				 	}
					$btn.button('reset');
					mainObj.empty();
					mainObj.html(html.join(''));
				} 
				else {
					clearInterval(interval);
					//处理测试结果；
					$("#case_response").html(JSON.stringify(data));
					for (var i = 0; i < count; i++) {
						html.push('<div class="form-group case_info_detail" id="validations_area">');
						html.push('<span class="key_name">'+result["vals"][i]["key"]+'</span>');
						html.push('<span class="key_value">'+result["vals"][i]["exp_value"]+'</span>');
						html.push('<span class="key_result">'+mes+'</span>');
						html.push('<span class="pull-right"><i class="fa fa-exclamation-circle" aria-hidden="true"></i></span>');
						html.push('</div>');
				 	}
					$btn.button('reset');
					mainObj.empty();
					mainObj.html(html.join(''));
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
	}, 100);
}