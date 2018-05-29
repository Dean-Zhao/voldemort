//表单必填校验
// api新增界面提交方法
var $me = $("#error_message");
var $mess = $('#process_message');
var $b = $("#add_table_form");
var $b1 = $("#edit_table_form");
function api_add(){ 
  $b.data("bootstrapValidator").validate();  
  let flag = $b.data("bootstrapValidator").isValid();
  if(flag){
   let pam = decodeURIComponent($("#add_table_form").serialize());
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
        $me.html(Data);
        $mess.children().children().children().eq(2).children().attr("onclick","reloadpage()");
        $mess.modal({
         keyboard: true
       }); 
      }
      else{
        $me.html(Data);
        $mess.modal({
         keyboard: true
       }); 
      }           
    },
    error:function(data)
    {
      $me.html("系统异常！");
      $mess.modal({
       keyboard: true
     });
    }
  });
 }
}
// api编辑界面提交方法
function api_edit(){
  $b1.data("bootstrapValidator").validate();
  let flag = $b1.data("bootstrapValidator").isValid();
  if(flag){
	let pam = decodeURIComponent($("#edit_table_form").serialize());
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
        $me.html(Data);
        $mess.children().children().children().eq(2).children().attr("onclick","reloadpage()");
        $mess.modal({
         keyboard: true
       }); 
      }
      else{
        $me.html(Data);
        $mess.modal({
         keyboard: true
       }); 
      }           
    },
    error:function(data)
    {
      $me.html("系统异常！");
      $mess.modal({
       keyboard: true
     });
    }
  });
}
}