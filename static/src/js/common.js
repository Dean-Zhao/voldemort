/**
插入菜单
**/
function creatmenu(){
	let html=[];
	html.push('<li class="active"><a href="/api/apiList/">API接口管理</a></li>');
	html.push('<li><a href="#">测试数据管理</a></li>');
	html.push('<li><a href="#">测试任务管理</a></li>');
	html.push('<li><a href="#">统计</a></li>');
	let mainObj = $("#menu_area");
	mainObj.empty();
	mainObj.html(html.join(''));
}
// 为菜单插入active
function menu_current(i){
	$("#menu_area").children().eq(i).addClass("active");
}
//加载方法
function loading(id){
  if(id===0){
    $(".loading").css("display","block");
    $(".main").css("display","none");      
  } 
  else if(id===1){
    $(".main").css("display","block");
    $(".loading").css("display","none");
  }  
}
// 退出登陆
function log_off(){
  $.ajax({
    url:'/logout/',
    type : "Post",
    success:function(data)
    {
      var Status = data["status"];
      if (Status===0){
        let url = data["url"];
        window.location.href=url;
       }

      else{
        $("#error_mess").html("系统异常！");
      $("#confirm_error").slideDown();
      }        
    },
    error:function(data)
    {
      $("#error_mess").html("系统异常！");
      $("#confirm_error").slideDown();
    }
  });
}
//卷起内容
function colls(){
  $("#colls").html('<i class="fa fa-caret-down fa-1x" aria-hidden="true"></i>');
}
