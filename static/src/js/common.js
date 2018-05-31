/**
插入菜单
**/
var $me = $("#error_mess");
var $mess = $('#confirm_error');
var $me1 = $("#error_mess");
var $mess1 = $('#confirm_error');
var $me2 = $("#sucess_mess");
var $mess2 = $('#confirm_sucess');
var $me3 = $("#warning_mess");
var $mess3 = $('#confirm_warning');

function creatmenu(){
	let html=[];
	html.push('<li class="active"><a href="/api/apiList/">API接口管理</a></li>');
	html.push('<li><a href="javascript:void(0)" disabled="disabled">测试数据管理</a></li>');
	html.push('<li><a href="/plan">测试计划管理</a></li>');
  html.push('<li><a href="#">测试任务 <span class="badge" id="task_num"></span></a></li>');
	html.push('<li><a href="#">统计</a></li>');
	let mainObj = $("#menu_area");
	mainObj.empty();
	mainObj.html(html.join(''));
}
// 为菜单插入active
function menu_current(i){
  $b=$("#menu_area").children();
  $b.removeClass("active");
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
        $me.html("系统异常！");
        $mess.slideDown();
      }        
    },
    error:function(data)
    {
      $me.html("系统异常！");
      $mess.slideDown();
    }
  });
}
//卷起内容
function colls(){
  $("#colls").html('<i class="fa fa-caret-down fa-1x" aria-hidden="true"></i>');
}
 //页面刷新方法
  $(".refresh_page").click(function(){
    location.reload();
  });
//页面刷新
function reloadpage(){
  location.reload();
}
//关闭pop
function close_pop(){
    $(".alert").slideUp();
    // location.reload();
 } 
 //关闭pop only for 新增计划
function close_pop1(){
    $(".alert").slideUp();
    window.location.href="/plan";
 } 
 // 退出登陆
 $("#logoff").click(function(){
   log_off();
 });
