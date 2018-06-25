// 操作key value 的新增与删除
//获取profile内容
function profile_getpams(){
	let a=$("#t_case_name").val();
	let b=$("input[name='inlineRadioOptions']:checked").val();
	let c=$("input[name='inlineRadioOptions1']:checked").val();
	let map={case_name:a,case_type:b,case_enctype:c}
   	return map;	
}
// 此处代码可优化，参数化
// headers新增条目
function header_addpam(id){
	let hcount = $("#tab_headers_form").attr("tct");
	hcount = parseInt(hcount) + 1;
	let x=$(id).attr("ct");
	$("#headers_area"+x).after('<div class="form-group pam_value" id="headers_area'+hcount+'"><div class="pull-left"><input type="text" class="form-control key_name" id="header_name'+hcount+'" placeholder="请输入参数key" value="" maxlength="1000"><input type="text" class="form-control key_value" id="header_value'+hcount+'" placeholder="请输入参数value" value="" maxlength="1000"></div><div class="pam_button pull-right"><button type="button" class="btn btn-default btn-circle" onclick="header_addpam(this)" ct="'+hcount+'"><i class="fa fa-plus" aria-hidden="true"></i></button> <button type="button" class="btn btn-default btn-circle" onclick="header_delpam(this)" ct="'+hcount+'"><i class="fa fa-remove" aria-hidden="true"></i></button></div></div>');    
	$("#tab_headers_form").attr("tct",hcount);
	$("#tab_headers_form").children().eq(0).children().eq(1).children().eq(1).removeAttr("disabled");
}
// headers删除条目
function header_delpam(id){
	let v=$(id).attr("ct");
	$("#headers_area"+v).remove();
	let m=$("#tab_headers_form").children().eq(1).attr("id");
	if(m === undefined){
		$("#tab_headers_form").children().eq(0).children().eq(1).children().eq(1).attr("disabled","disabled");
	}
}
//获取headers内容
function headers_getpams(){
	let a=$("#tab_headers_form").attr("tct");
	let map={};
	for (let i = 1; i <= a; i++) {
		let c=$("#header_name"+i).val();
		let d=$("#header_value"+i).val();
			if(c === ""){
				continue;
			}
			else{
				map[c]=d;
			}			
		}   
   	return map;	
}
// cookies新增条目
function cookies_addpam(id){
	let hcount = $("#tab_cookies_form").attr("tct");
	hcount = parseInt(hcount) + 1;
	let x=$(id).attr("ct");
	$("#cookies_area"+x).after('<div class="form-group pam_value" id="cookies_area'+hcount+'"><div class="pull-left"><input type="text" class="form-control key_name" id="cookies_name'+hcount+'" placeholder="请输入参数key" value="" maxlength="1000"><input type="text" class="form-control key_value" id="cookies_value'+hcount+'" placeholder="请输入参数value" value="" maxlength="1000"></div><div class="pam_button pull-right"><button type="button" class="btn btn-default btn-circle" onclick="cookies_addpam(this)" ct="'+hcount+'"><i class="fa fa-plus" aria-hidden="true"></i></button> <button type="button" class="btn btn-default btn-circle" onclick="cookies_delpam(this)" ct="'+hcount+'"><i class="fa fa-remove" aria-hidden="true"></i></button></div></div>');    
	$("#tab_cookies_form").attr("tct",hcount);
	$("#tab_cookies_form").children().eq(0).children().eq(1).children().eq(1).removeAttr("disabled");
}
// cookies删除条目
function cookies_delpam(id){
	let v=$(id).attr("ct");
	$("#cookies_area"+v).remove();
	let m=$("#tab_cookies_form").children().eq(1).attr("id");
	if(m === undefined){
		$("#tab_cookies_form").children().eq(0).children().eq(1).children().eq(1).attr("disabled","disabled");
	}
}
//获取cookies内容
function cookies_getpams(){
	let a=$("#tab_cookies_form").attr("tct");
	let map={};
	for (let i = 1; i <= a; i++) {
		let c=$("#cookies_name"+i).val();
		let d=$("#cookies_value"+i).val();
		if(c === ""){
			continue;
		}
		else{
			map[c]=d;
		}	
	}
   	return map;	
}
// pams新增条目
function pams_addpam(id){
	let hcount = $("#tab_pams_form").attr("tct");
	hcount = parseInt(hcount) + 1;
	let x=$(id).attr("ct");
	$("#pams_area"+x).after('<div class="form-group pam_value" id="pams_area'+hcount+'"><div class="pull-left"><input type="text" class="form-control key_name" id="pams_name'+hcount+'" placeholder="请输入参数key" value="" maxlength="1000"><input type="text" class="form-control key_value" id="pams_value'+hcount+'" placeholder="请输入参数value" value="" maxlength="1000"></div><div class="pam_button pull-right"><button type="button" class="btn btn-default btn-circle" onclick="pams_addpam(this)" ct="'+hcount+'"><i class="fa fa-plus" aria-hidden="true"></i></button> <button type="button" class="btn btn-default btn-circle" onclick="pams_delpam(this)" ct="'+hcount+'"><i class="fa fa-remove" aria-hidden="true"></i></button></div></div>');    
	$("#tab_pams_form").attr("tct",hcount);
	$("#tab_pams_form").children().eq(0).children().eq(1).children().eq(1).removeAttr("disabled");
}
// pams删除条目
function pams_delpam(id){
	let v=$(id).attr("ct");
	$("#pams_area"+v).remove();
	let m=$("#tab_pams_form").children().eq(1).attr("id");
	if(m === undefined){
		$("#tab_pams_form").children().eq(0).children().eq(1).children().eq(1).attr("disabled","disabled");
	}
}
//获取 pams 内容
function pams_getpams(){
	let a=$("#tab_pams_form").attr("tct");
	let map={};
	for (let i = 1; i <= a; i++) {
		let c=$("#pams_name"+i).val();
		let d=$("#pams_value"+i).val();
		if(c===""){
			continue;
		}
		else{
			map[c]=d;
		}	
	}
   	return map;	
}
// //pam是否生成token处理
// function pams_apivalidate(){
// 	let a=$("input[name='inlineRadioOptions1']:checked").val();
// 	let pams_map={};
// 	if (a=="201"){
// 		let b=pams_getpams();
// 		mock(b);
// 	}
// 	else{
// 		pams_map=pams_getpams();
// 	}
// 	return pams_map;
// }
// validations新增条目
function validations_addpam(id){
	let hcount = $("#tab_validations_form").attr("tct");
	hcount = parseInt(hcount) + 1;
	let x=$(id).attr("ct");
	$("#validations_area"+x).after('<div class="form-group pam_value" id="validations_area'+hcount+'"><div class="pull-left"><input type="text" class="form-control key_name" id="validations_name'+hcount+'" placeholder="请输入参数key" value="" maxlength="1000"><input type="text" class="form-control key_value" id="validations_value'+hcount+'" placeholder="请输入参数value" value="" maxlength="1000"></div><div class="pam_button pull-right"><button type="button" class="btn btn-default btn-circle" onclick="validations_addpam(this)" ct="'+hcount+'"><i class="fa fa-plus" aria-hidden="true"></i></button> <button type="button" class="btn btn-default btn-circle" onclick="validations_delpam(this)" ct="'+hcount+'"><i class="fa fa-remove" aria-hidden="true"></i></button></div></div>');    
	$("#tab_validations_form").attr("tct",hcount);
	$("#tab_validations_form").children().eq(0).children().eq(1).children().eq(1).removeAttr("disabled");
}
// validations删除条目
function validations_delpam(id){
	let v=$(id).attr("ct");
	$("#validations_area"+v).remove();
	let m=$("#tab_validations_form").children().eq(1).attr("id");
	if(m === undefined){
		$("#tab_validations_form").children().eq(0).children().eq(1).children().eq(1).attr("disabled","disabled");
	}
}
//获取 validations 内容
function validations_getpams(){
	let a=$("#tab_validations_form").attr("tct");
	let map={};
	for (let i = 1; i <= a; i++) {
		let c=$("#validations_name"+i).val();
		let d=$("#validations_value"+i).val();
		if(c==""){
			continue;
		}
		else{
			map[c]=d;
		}	
	}
   	return map;	
}
//获取用例的整体内容并提交
function case_getpams(){
	let $b = $("#tab_profile_form");
	$b.data("bootstrapValidator").validate();  
	let flag = $b.data("bootstrapValidator").isValid();
	let api_id = $("#api_id").attr("data-id");
	if(flag){
		let map={},result={};
		let a=$("#t_case_name").val();
		map["profile"]=profile_getpams();
		map["headers"]=headers_getpams();
		map["cookies"]=cookies_getpams();
		map["parameters"]=pams_getpams();
		map["validations"]=validations_getpams();
		map["api_id"]= api_id
		map["case_id"]=$("#case_id").attr("data-id");
		let res=JSON.stringify(map);
		console.log(res);
		console.log(a);
		if(a!=""){	
			$.ajax({
				type : "Post",
				url : "/api/addCase/",
				data : res,
				dataType : "json",
				async : false,
				success : function(data) {	
					var Status = data["status"];
					var msg = data["msg"];
					$("#case_add_btn").attr("disabled","disabled");
					if (Status==0){
		
						pop_success_reload(msg,"/api/",api_id,"/cases/");
					}
					else{
						pop_error(msg);
						let resetbtn = function(){
							$("#case_add_btn").removeAttr("disabled");
						}
						setTimeout(resetbtn,2500);
					}
				},
				error : function(data) {
					pop_error("系统异常！");  
				}
			});
		}
		else{
			pop_error("必填项未填写！");
		}
	}
}




