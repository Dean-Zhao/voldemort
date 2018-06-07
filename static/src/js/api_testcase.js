// import {loading} from "./common.js"
var api_id=$("#api_id").attr("data-id");
// 解码  
function decodeUnicode(str) {  
  str = str.replace(/\\/g, "%");  
  return unescape(str);  
}
// 查询方法
function case_query(id) {
  $.ajax({
    type : "Get",
    url : "/api/caselist",
    data : {
      "id" : id
    },
    dataType : "json",
    success : function(data) {
      case_createTable(data);
    },
    error : function(data) {
      pop_error("系统异常！");
    }
  });
}  
// 创建列表
function case_createTable(data) {
  let html = [];  
  console.log(data.length);
  if (data["cases"].length >= 1) {                        
    html.push('<table class="table table-hover">');
    html.push('<thead><tr><th style="width:150px;">用例名</th><th style="width:150px;">用例标签</th><th style="width:150px;">headers</th><th style="width:150px;">cookies</th><th style="width:150px;">parameters</th><th style="width:150px;">validation</th><th style="width:150px;">修改人</th><th style="width:200px;">操作</th></tr></thead><tbody>');
    for (let i = 0; i < data.cases.length; i++) {
      html.push('<tr><td id='+data.cases[i].id+'>'+data.cases[i].name+'</td>');
      html.push('<td>'+data.cases[i].tag+'</td>');
      html.push('<td>'+data.cases[i].headers+'</td>');
      html.push('<td>'+data.cases[i].cookies+'</td>');
      html.push('<td>'+data.cases[i].parameter+'</td>');
      html.push('<td>'+data.cases[i].validation+'</td>');
      html.push('<td>'+data.cases[i].user+'</td>');
      html.push('<td><button type="button" class="btn btn-link table_btn_lef" id="account_pwd_edit'+i+'" onClick="caseEdit(this)">编辑</button><button type="button" class="btn btn-link table_btn_lef" id="account_pwd_copy'+i+'" onClick="caseCopy(this)"> 复制</button><button type="button" class="btn btn-link table_btn_lef" id="account_pwd_reset'+i+'" onClick="caseDelete_pop(this)"> 删除</button><button type="button" class="btn btn-link table_btn_lef" id="delete_account'+i+'" onClick="caseTest(this)">测试</button></td>');
      html.push('</tr>');
    }
    html.push('</tbody></table>');
    let mainObj = $('#center_content_table');
    mainObj.empty();
    mainObj.html(html.join(''));
  }
  else{
    nodata_img("center_content_table",1);
  }
   loading(1);
  };
//跳转编辑界面
function caseEdit(id){
  let case_id = $(id).parent().parent().children().eq(0).attr("id");
  window.location.href = "/api/cases/"+case_id+"/";
}

//复制
function caseCopy(id){
  let case_id = $(id).parent().parent().children().eq(0).attr("id");
  $.ajax({
    url:"/api/case/copy/"+case_id,
    type : "Post",
    success:function(data)
    {
      var Status = data["status"];
      var msg = data["msg"];
      if (Status==0){
        pop_success(msg);
        case_query(api_id);
      }
      else{
      	pop_error(msg);
      }
    },
    error:function(data) 
    {
      pop_error("系统异常！");
    }
  });
}
//删除弹出
function caseDelete_pop(id){
  let case_id = $(id).parent().parent().children().eq(0).attr("id");
  $me3.attr("data",case_id);
  $mess3.slideDown();
}
//删除
function caseDelete(id){
 $mess3.slideUp();
 case_id = $("#warning_mess").attr("data");
 $.ajax({
  url:"/api/case/delete/"+case_id,
  type : "Post",
  success:function(data)
  {
    var Status = data["status"];
    var msg = data["msg"];
    if (Status==0){
      pop_success(msg);
      case_query(api_id);
    }
    else{
     pop_error(msg);
   }
 },
 error:function(data) 
 {
  pop_error("系统异常！");
}
});
}

//进入用例测试界面方法
function caseTest(id){
  let case_id = $(id).parent().parent().children().eq(0).attr("id");
  window.location.href = "/api/casetest/"+case_id+"/";
}
