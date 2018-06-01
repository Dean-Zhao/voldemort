//表单必填校验
// api新增界面提交方法
var $b2 = $("#add_table_form");
var $b1 = $("#edit_table_form");
function api_add(){ 
  $b2.data("bootstrapValidator").validate();  
  let flag = $b2.data("bootstrapValidator").isValid();
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
        pop_success(Data);  
      }
      else{
        pop_error(Data); 
      }           
    },
    error:function(data)
    {
      pop_error("系统异常！");
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
        pop_success(Data);  
      }
      else{
        pop_error(Data); 
      }           
    },
    error:function(data)
    {
      pop_error("系统异常！");
    }
  });
}
}