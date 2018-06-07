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
                    loading(1); 
                  }
                });
              }
            });
          },
          error : function(data) {
           pop_error("系统异常！"); 
           loading(1); 
          }
        });
  }  
// 创建列表
function createTable(currPage,limit, totalCount, data) {
    let html = [], showNum = limit;
    if (totalCount - (currPage * limit) < 0) {
      showNum = totalCount - ((currPage - 1) * limit);  
    }
    if (data.length >= 1) {                                    
     for (let i = 0; i < showNum; i++) {
        if (i < data.length) {
        html.push('<div class="panel panel-default"><div class="panel-heading" role="tab" id="heading'+i+'" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse'+i+'" aria-expanded="false" aria-controls="collapse'+i+'"><div class="panel-title">');
        html.push('<a class="collapsed"  plan_id="'+data[i].id+'" id="plan_count'+i+'">'+data[i].name+'</a></div>');
        html.push('<div class="panel-status"><span class="badge">'+data[i].task_count+'</div></div>');
        html.push('<div id="collapse'+i+'" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading'+i+'" aria-expanded="false"><div class="panel-body">');
        html.push('<p><span class="board_info">项目:</span> '+data[i].proj+'</p>');
        html.push('<p><span class="board_info">创建者:</span> '+data[i].user+'</p>');
        html.push('<p><span class="board_info">描述:</span> '+data[i].description+'</p>');
        html.push('<p><span class="board_info">更新时间:</span> '+data[i].update_time+'</p>');
        html.push('<ul class="list-inline collapse_ul">');
        html.push('<li><button class="btn btn-danger" onClick="plan_delete_pop(this)" num_id="'+i+'">删除</button></li>');
        html.push('<li><button class="btn btn-info" onClick="planView(this)" num_id="'+i+'">查看</button></li>');
        html.push('<li><button class="btn btn-warning" onClick="planTasks(this)" num_id="'+i+'">历史任务</button></li>');
        html.push('<li><button class="btn btn-success" onClick="create_task_pop(this)" num_id="'+i+'">新建任务</button></li>');
        html.push('</ul></div></div></div>');
        }
    }
    let mainObj = $('#accordion');
    mainObj.empty();
    mainObj.html(html.join(''));
  }
  else{
    nodata_img("accordion",0);
  }
  loading(1);
};
//获取plan_id
function get_planid(id){
  let plan_id = $("#plan_count"+id).attr("plan_id");
  return plan_id;
}
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
    let plan_id = get_planid($(id).attr("num_id"));
     window.location.href = "/plan/check/"+plan_id+"/"; 
}
//获取历史任务
function planTasks(id){
    loading1(0);
    let plan_id = get_planid($(id).attr("num_id"));
    $.ajax({
    type : "Get",
    url : "/plan/"+plan_id+"/history/",
    dataType : "json",
    success : function(data) {
       if (data["status"]==0) {
          creat_plantasks(data["tasks"]);
       }
       else{
         pop_error("查询失败！");
         loading1(1); 
       }
        
    },
    error: function(data){
      pop_error("系统异常！"); 
      loading1(1); 
    }
  });
}
//插入历史任务列表
function creat_plantasks(data){ 
  let html = [];  
  if (data.length>=1) {              
    for (let i = 0; i < data.length; i++) {
      html.push('<div class="list-group">');
      switch (data[i]["status"]) {
        case 0 :
        html.push('<a href="/task/'+data[i]["id"]+'/report" class="list-group-item list-group-item-warning" task_id="'+data[i]["id"]+'">');
        break;
        case 1 :
        html.push('<a href="/task/'+data[i]["id"]+'/report" class="list-group-item list-group-item-success" task_id="'+data[i]["id"]+'">');
        break;
        case 2 :
        html.push('<a href="/task/'+data[i]["id"]+'/report" class="list-group-item list-group-item-danger" task_id="'+data[i]["id"]+'">');
        break;
        default:
        html.push('<a href="/task/'+data[i]["id"]+'/report" class="list-group-item list-group-item-info" task_id="'+data[i]["id"]+'">');
      }
      html.push('<div class="plantasks_list_left"><ul class="list-unstyled">');
       html.push('<li><ul class="list-inline"><li><span class="list-group-item-heading">'+data[i]["create_time"]+'</span></li>');
        html.push('<li><p class="list-group-item-text">'+data[i]["user"]+'</p></li></ul></li>');
        html.push('<li><p class="list-group-item-text">'+data[i]["runtime_env"]+'</p></li>');
      html.push('</ul></div><div class="plantasks_list_right">');
      switch (data[i]["status"]) {
        case 0 :
        html.push('<i class="fa fa-exclamation fa-2x" aria-hidden="true"></i>');
        break;
        case 1 :
        html.push('<i class="fa fa-check fa-2x" aria-hidden="true"></i>');
        break;
        case 2 :
        html.push('<i class="fa fa-close fa-2x" aria-hidden="true"></i>');
        break;
        default:
        html.push('<i class="fa fa-meh-o fa-2x" aria-hidden="true"></i>');
      }
      html.push('</div></a></div>');
    }
    let mainObj = $('#plan_tasks');
    mainObj.empty();
    mainObj.html(html.join(''));
  }
  else{
    nodata_img("plan_tasks",0);
  }
  loading1(1);
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
  let plan_id = get_planid($(id).attr("num_id"));
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
    var data_content = data["data"];
            var totalCount = data["count"];//数据总条数
            var showCount = 10;//显示的页数
            var limit = 10;//每页显示的数据条数
            createTable_plancase(1, limit, totalCount, data_content);
            $("#fenye").extendPagination(
            {
              totalCount : totalCount,
              showCount : showCount,
              limit : limit,
              callback : function(currPage,limit,totalCount) {
                $.ajax({
                  type : "Get",
                  url : "/plan/"+plan_id,
                  dataType : "json",
                  success : function(data) {
                    let data_content1 = data["data"];
                    createTable_plancase(currPage,limit,totalCount,data_content1);
                  },
                  error : function(data) {
                    pop_error("系统异常！");
                    loading(1);
                  }
                });
              }
            });
          },
          error : function(data) {
           pop_error("系统异常！"); 
           loading(1); 
         }
       });
}
//创建任务弹出框
function create_task_pop(id){
  let plan_id = get_planid($(id).attr("num_id"));
  get_task_env(plan_id);
  $("#myModalLabel").attr("plan_id",plan_id);
  $('#plan_createtask_pop').modal();
}
//获取任务选择环境
function get_task_env(id){
  $.ajax({
    type : "Get",
    url : "/env/",
    dataType : "json",
    data: {"plan_id":id},
    success : function(data) {
        var envs = data["envs"];
        creat_task_env(envs);
    },
    error: function(data){
      pop_error("系统异常！"); 
    }
  });
}
//插入任务选择环境
function creat_task_env(data){
  let html = [];   
  console.log(data);   
  html.push('<label for="tags">测试环境</label>');    
  html.push('<select class="form-control" id="envs" name="envs">');              
  for (let i = 0; i < data.length; i++) {
    html.push('<option value="'+data[i]["id"]+'">'+data[i]["name"]+'</option>');
    console.log(data[i]["name"]); 
  }
  html.push('</select');
  let mainObj = $('#env');
  mainObj.empty();
  mainObj.html(html.join(''));
}
//创建任务
function create_task() {
    let plan_id = $("#myModalLabel").attr("plan_id");
    let run_env = $("#envs option:selected").attr("value");
    $.ajax({
        type: "Post",
        // url: "/plan/" + plan_id + "/exec",
        url: "/plan/" + plan_id + "/task",
        dataType: "json",
        data: {"plan_id": plan_id, "run_env": run_env},
        success: function (data) {
            var msg = data["msg"];
            // pop_success_reload(msg,"/plan");
            pop_success(msg);
            query(1,10);
        },
        error: function (data) {
            pop_error("系统异常！");
        }
    });
}