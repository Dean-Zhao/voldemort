// 查询方法
function query(currPage, limit) {
    var currPage = 1;
    var keywords = $("#keywords").val();
    var project = $("#proj option:selected").attr("value");
    var userId = $("#creator option:selected").attr("value");
        $.ajax({
          type : "Get",
          url : "/plan/query",
          data : {
            "currPage" : currPage,
            "kw" : keywords,
            "userId" : userId,
            "project" : project
            },
          dataType : "json",
          success : function(data) {
            var data_content = data["data"];
            var totalCount = data["count"];//数据总条数
            var showCount = 10;//显示的页数
            var limit = 10;//每页显示的数据条数
            createTable(1, limit, totalCount, data_content);
            $("#fenye").extendPagination(
            {
              totalCount : totalCount,
              showCount : showCount,
              limit : limit,
              callback : function(currPage,limit,totalCount) {
                $.ajax({
                  type : "Get",
                  url : "/plan/query",
                  data : {
                    "currPage" : currPage,
                    "kw" : keywords,
                    "userId" : userId,
                    "project" : project
                  },
                  dataType : "json",
                  success : function(data) {
                    let data_content1 = data["data"];
                    createTable(currPage,limit,totalCount,data_content1);
                  },
                  error : function(data) {
                    pop_error("系统异常！");
                    // query(currPage,limit);
                  }
                });
              }
            });
          },
          error : function(data) {
           pop_error("系统异常！");  
          }
        });
  }  
// 创建列表
function createTable(currPage,limit, totalCount, data) {
    let html = [], showNum = limit;
    if (totalCount - (currPage * limit) < 0) {
      showNum = totalCount - ((currPage - 1) * limit);  
    }                          
    html.push('<table class="table table-hover">');
    html.push('<thead><tr><th style="width:300px;">计划名称</th><th style="width:150px;">所属项目</th><th style="width:100px;">创建人</th><th style="width:190px;">备注</th><th style="width:190px;">最近测试时间</th><th style="width:100px;">状态</th><th style="width:220px;">操作</th></tr></thead><tbody>');
    for (let i = 0; i < showNum; i++) {
      if (i < data.length) {
        html.push('<tr><td id='+data[i].id+'>'+data[i].name+'</td>');
        html.push('<td>'+data[i].proj+'</td>');
        html.push('<td>'+data[i].user+'</td>');
        html.push('<td>'+data[i].description+'</td>');
        html.push('<td>'+data[i].update_time+'</td>');
        if(data[i].task_count===0){
          html.push('<td><span class="label label-primary">闲置</span></td>');
          html.push('<td><button type="button" class="btn btn-link table_btn_lef" id="account_pwd_reset" onClick="planView(this)">查看</button><button type="button" class="btn btn-link table_btn_lef" id="delete_account" onClick="plan_delete_pop(this)">删除</button><button type="button" class="btn btn-link table_btn_mid" id="delete_account" onClick="planTasks(this)">历史任务</button><button type="button" class="btn btn-link table_btn_mid" id="delete_account" onClick="create_task_pop(this)">创建任务</button></td>');
        }
        else if(data[i].task_count >=1){
          html.push('<td><span class="label label-warning">任务中</span></td>');
          html.push('<td><button type="button" class="btn btn-link table_btn_lef" id="account_pwd_reset" onClick="planView(this)">查看</button><button type="button" class="btn btn-link table_btn_lef" id="delete_account" onClick="plan_delete_pop(this)">删除</button><button type="button" class="btn btn-link table_btn_mid" id="delete_account" onClick="planTasks(this)">历史任务</button><button type="button" class="btn btn-link table_btn_mid" id="delete_account" onClick="create_task_pop(this)">创建任务</button></td>');
        }
        else{
          html.push('<td><span class="label label-warning"></span></td>');
          html.push('<td><button type="button" class="btn btn-link table_btn_lef" id="account_pwd_reset" onClick="planView(this)">查看</button><button type="button" class="btn btn-link table_btn_lef" id="delete_account" onClick="plan_delete_pop(this)">删除</button><button type="button" class="btn btn-link table_btn_mid" id="delete_account" onClick="planTasks(this)">历史任务</button><button type="button" class="btn btn-link table_btn_mid" id="delete_account" onClick="create_task_pop(this)">创建任务</button></td>');
        }
        html.push('</tr>');
      }
    }
    html.push('</tbody></table>');
    let mainObj = $('#center_content_table');
    mainObj.empty();
    mainObj.html(html.join(''));
    loading(1);
};
//创建查看计划列表中用例列表
function createTable_plancase(currPage,limit, totalCount, cases) {
    let html = [], showNum = limit;
    if (totalCount - (currPage * limit) < 0) {
      showNum = totalCount - ((currPage - 1) * limit);  
    }                          
    for (let i = 0; i < showNum; i++) {
      if (i < cases.length) {
        html.push('<tr>');
        html.push('<td>'+cases[i].id+'</td>');
        html.push('<td>'+cases[i].name+'</td>');
        html.push('<td>'+cases[i].tag+'</td>');
        html.push('<td>'+cases[i].api+'</td>');
        html.push('</tr>');
      }
    }
    let mainObj = $('#addcases_list');
    mainObj.empty();
    mainObj.html(html.join(''));
    loading(1);
};
//跳转新增界面
function planAdd(){
    window.location.href = "/plan/addinfo/";
}
//跳转查看界面
function planView(id){
    let plan_id = $(id).parent().parent().children().eq(0).attr("id");
     window.location.href = "/plan/check/"+plan_id+"/"; 
    // console.log("1");
}
//跳转历史任务界面
function planTasks(id){
    let plan_id = $(id).parent().parent().children().eq(0).attr("id");
     window.location.href = "/plan/demo_test1/";
}
//新增计划
function plan_addinfo(){
  var $b3 = $("#add_table_form");
  $b3.data("bootstrapValidator").validate();  
  let flag = $b3.data("bootstrapValidator").isValid();
  if(flag){
   let pam = decodeURIComponent($("#add_table_form").serialize());
   console.log(pam);
   $.ajax({
    url:'/plan/add/',
    type : "Post",
    async: false,
    data: pam,
    dataType: 'json',
    success:function(data)
    {
      var Data = data["msg"];
      var Status = data["status"];
      if (Status===0){
        window.location.href = "/plan/"+data["data"]["plan"]+"/addcase/"; 
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
//删除计划弹出框
function plan_delete_pop(id){
  let plan_id = $(id).parent().parent().children().eq(0).attr("id");
  $me3.attr("data",plan_id);
  $mess3.slideDown();
}
//删除计划
function plan_delete(){
  $mess3.slideUp();
  let plan_id = $me3.attr("data");
  $.ajax({
  url:"/plan/delete/",
  type : "Post",
  data:{
    "project":plan_id
  },
  success:function(data)
  {
    var Status = data["status"];
    var msg = data["msg"];
    if (Status==0){
      pop_success(msg);
      query(1,10);
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
//查看计划
function plan_view(){
 let plan_id = $("#api_id").attr("data-id");
 $.ajax({
  type : "Get",
  url : "/plan/"+plan_id,
  dataType : "json",
  success : function(data) {
    var data_content = data["cases"];
            var totalCount = data_content.length;//数据总条数
            var showCount = 10;//显示的页数
            var limit = 10;//每页显示的数据条数
            createTable_plancase(1, limit, totalCount, data_content);
            // $("#fenye").extendPagination(
            // {
            //   totalCount : totalCount,
            //   showCount : showCount,
            //   limit : limit,
            //   callback : function(currPage,limit,totalCount) {
            //     $.ajax({
            //       type : "Get",
            //       url : "/plan/"+plan_id,
            //       dataType : "json",
            //       success : function(data) {
            //         let data_content1 = data["cases"];
            //         createTable_plancase(currPage,limit,totalCount,data_content1);
            //       },
            //       error : function(data) {
            //         pop_error("系统异常！");
            //       }
            //     });
            //   }
            // });
          },
          error : function(data) {
           pop_error("系统异常！");  
         }
       });
}
//创建任务弹出框
function create_task_pop(id){
  let plan_id = $(id).parent().parent().children().eq(0).attr("id");
  $("#myModalLabel").attr("plan_id",plan_id);
  $('#plan_createtask_pop').modal();
}
//创建任务
function create_task(){
  let plan_id = $("#myModalLabel").attr("plan_id");
  let run_env = $("#envs option:selected").attr("value");
  $.ajax({
    type : "Post",
    url : "/plan/"+plan_id+"/exec",
    dataType : "json",
    data: {"plan_id":plan_id,"run_env":run_env},
    success : function(data) {
        var msg = data["msg"];
        pop_success(msg);
    },
    error: function(data){
      pop_error("系统异常！"); 
    }
  });
