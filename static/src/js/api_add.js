// api新增界面提交方法
function api_add(){
	var pam = decodeURIComponent($("#add_table_form").serialize());
	console.log(pam);
	$.ajax({
    url:'/api/addApi/',
    type : "Post",
    async: false,
    data: pam,
    dataType: 'json',
    success:function(data)
    {
      var Data = data["msg"];
      var Status = data["status"];
      if (Status===0){
      	 $("#error_message").html(Data);
         $('#process_message').modal({
         keyboard: true
         }); 
      }
      else{
      	 $("#error_message").html(Data);
         $('#process_message').modal({
         keyboard: true
         }); 
      }           
    },
    error:function(data)
    {
      $("#error_mess").html("系统异常！");
      $("#confirm_error").slideDown();
    }
  });
}
// api编辑界面提交方法
function api_edit(){
	var pam = decodeURIComponent($("#edit_table_form").serialize());
	console.log(pam);
	$.ajax({
    url:'/api/addApi/',
    type : "Post",
    async: false,
    data: pam,
    dataType: 'json',
    success:function(data)
    {
      var Data = data["msg"];
      var Status = data["status"];
      if (Status===0){
      	 $("#error_message").html(Data);
         $('#process_message').modal({
         keyboard: true
         }); 
      }
      else{
      	 $("#error_message").html(Data);
         $('#process_message').modal({
         keyboard: true
         }); 
      }           
    },
    error:function(data)
    {
      $("#error_mess").html("系统异常！");
      $("#confirm_error").slideDown();
    }
  });
}