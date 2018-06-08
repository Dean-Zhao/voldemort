//插入测试任务列表
function creat_plantasks(currPage,limit, totalCount,data){ 
  let html = [], showNum = limit;
  if (totalCount - (currPage * limit) < 0) {
    showNum = totalCount - ((currPage - 1) * limit);  
  } 
  console.log(data);
  if (data.length >= 1) {              
    for (let i = 0; i < showNum; i++) {
      if (i < data.length) {
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
        html.push('<li><p class="list-group-item-text">'+data[i]["plan"]+'</p></li>');
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
    }
    let mainObj = $('#plan_tasks');
    mainObj.empty();
    mainObj.html(html.join(''));
  }
  else{
    nodata_img("plan_tasks",0);
  }
  loading(1);
}
//插入用例列表
function creat_taskscases(currPage,limit, totalCount,data){
   let html = [], showNum = limit;
  if (totalCount - (currPage * limit) < 0) {
    showNum = totalCount - ((currPage - 1) * limit);  
  } 
  console.log(data);
  if (data.length >= 1) {              
    for (let i = 0; i < showNum; i++) {
      if (i < data.length) {
        html.push('<div class="list-group">');
        console.log(data[i]["is_pass"]);
        switch (data[i]["is_pass"]) {
          case 0 :
            html.push('<a href="javascript:void(0)" class="list-group-item list-group-item-success" onclick="get_single_cases(this,'+data[i]["case_id"]+')">');
            break;
          case 1 :
            html.push('<a href="javascript:void(0)" class="list-group-item list-group-item-success" onclick="get_single_cases(this,'+data[i]["case_id"]+')">');
            break;
          case -1 :
            html.push('<a href="javascript:void(0)" class="list-group-item list-group-item-danger" onclick="get_single_cases(this,'+data[i]["case_id"]+')">');
            break;
          default:
            html.push('');
        }
        html.push('<div class="plantasks_list_left"><ul class="list-unstyled">');
        html.push('<li><p class="list-group-item-text">'+data[i]["case"]+'</p></li>');
        html.push('<li><p class="list-group-item-text">'+data[i]["url"]+'</p></li>');
        html.push('</ul></div><div class="plantasks_list_right"><ul class="list-unstyled">');
        html.push('<li><span>'+data[i]["status_code"]+'</span></li><li>');
        switch (data[i]["is_pass"]) {
          case 0 :
            html.push('<i class="fa fa-check fa-1x" aria-hidden="true"></i>');
            break;
          case 1 :
            html.push('<i class="fa fa-check fa-1x" aria-hidden="true"></i>');
            break;
          case -1 :
            html.push('<i class="fa fa-close fa-1x" aria-hidden="true"></i>');
            break;
          default:
            html.push('');
        }
        html.push('</ul></div></a></div>');
      }
    }
    let mainObj = $('#task_id_store');
    mainObj.empty();
    mainObj.html(html.join(''));
  }
  else{
    nodata_img("task_id_store",0);
  }
  loading(1);
}
//插入单个用例执行结果
function creat_single_cases(data,status_code){ 
  let html = [];  
    html.push('<div class="cases_header">');
    html.push('<pre>');
    html.push(data["request_headers"]);
    html.push('</pre></div>');
    html.push('</tbody></table></div>');
    html.push('<div class="cases_validation"><table class="table table-striped"><thead><tr>');
    html.push('<th style="width:20%">检查点</th>');
    html.push('<th style="width:35%">期望值</th>');
    html.push('<th style="width:35%">实际值</th>');
    html.push('<th style="width:10%">结果</th>');
    html.push('</tr></thead><tbody>');
     for (let i = 0; i < data["validations"].length; i++) {
        html.push('<tr><td>'+data["validations"][i]["key"]+'</td><td>'+data["validations"][i]["exp_value"]+'</td><td>'+data["validations"][i]["value"]+'</td>');
        if (data["validations"][i]["is_pass"]===1) {
          html.push('<td><i class="fa fa-check-circle" aria-hidden="true"></i></td>');
        }
        else{
          html.push('<td><i class="fa fa-exclamation-circle" aria-hidden="true"></i></td>');
        }
        
        html.push('</tr>');
    }
      html.push('</tbody></table></div>');
      html.push('<div class="response">');
      switch (parseInt(status_code)){
        case 0:
          html.push('<pre></pre>');
          break;
        case 200:
          html.push('<pre>');
          html.push(syntaxHighlight(data["response"]));
          html.push('</pre>');
          break;
        case 404:
          html.push('<pre><xmp>'+data["response"]+'</xmp></pre>');
          break;
        case 500:
          html.push('<pre><xmp>'+data["response"]+'</xmp></pre>');
          break;
      }

      html.push('</div>');
    let mainObj = $('#plan_tasks');
    mainObj.empty();
    mainObj.html(html.join(''));
    loading2(1);
}
//测试任务列表查询方法
function get_task_list(){
  var currPage = 1;
  $.ajax({
    type : "Get",
    url : "/task/query",
    dataType : "json",
    data : {"currPage" : currPage},
    success : function(data) {
            var data_content = data["data"];
            var totalCount = data["count"];//数据总条数
            var showCount = 10;//显示的页数
            var limit = 10;//每页显示的数据条数
            creat_plantasks(1, limit, totalCount, data_content);
            $("#fenye").extendPagination(
            {
              totalCount : totalCount,
              showCount : showCount,
              limit : limit,
              callback : function(currPage,limit,totalCount) {
                $.ajax({
                  type : "Get",
                  url : "/task/query",
                  dataType : "json",
                  data : {"currPage" : currPage},
                  success : function(data) {
                    let data_content1 = data["data"];
                    creat_plantasks(currPage,limit,totalCount,data_content1);
                  },
                  error : function(data) {
                    pop_error("系统异常！");
                    loading(1);
                  }
                });
              }
            });  
          },
    error: function(data){
      pop_error("系统异常！"); 
      loading(1); 
    }
  });
}
//获取任务用例列表
function get_cases(){
  let task_id=$("#task_id_store").attr("task_id");
  var currPage = 1;
   $.ajax({
    type : "Get",
    url : "/task/"+task_id+"/cases",
    dataType : "json",
    data : {"currPage" : currPage},
    success : function(data) {
            var data_content = data["data"];
            var totalCount = data["count"];//数据总条数
            var showCount = 10;//显示的页数
            var limit = 10;//每页显示的数据条数
            creat_taskscases(1, limit, totalCount, data_content);
            $("#fenye").extendPagination(
            {
              totalCount : totalCount,
              showCount : showCount,
              limit : limit,
              callback : function(currPage,limit,totalCount) {
                $.ajax({
                  type : "Get",
                  url : "/task/"+task_id+"/cases",
                  dataType : "json",
                  data : {"currPage" : currPage},
                  success : function(data) {
                    let data_content1 = data["data"];
                    creat_taskscases(currPage,limit,totalCount,data_content1);
                  },
                  error : function(data) {
                    pop_error("系统异常！");
                    loading(1);
                  }
                });
              }
            });  
          },
    error: function(data){
      pop_error("系统异常！"); 
      loading(1); 
    }
  });
}
//查看单个用例执行结果
function get_single_cases(id,case_id){
  loading2(0);
  let task_id=$("#task_id_store").attr("task_id");
  let status_code = $(id).children().eq(1).children().eq(0).children().eq(0).children().html();
  $.ajax({
    type : "Get",
    url : "/task/"+task_id+"/cases/"+case_id,
    dataType : "json",
    success : function(data) {
              creat_single_cases(data["data"],status_code);
          },
    error: function(data){
      pop_error("系统异常！"); 
      loading2(1); 
    }
  });
}
//格式化json
function syntaxHighlight(json) {
  if (typeof json != 'string') {
    json = JSON.stringify(json, undefined, 2);
  }
  json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
    var cls = 'number';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'key';
      } else {
        cls = 'string';
      }
    } else if (/true|false/.test(match)) {
      cls = 'boolean';
    } else if (/null/.test(match)) {
      cls = 'null';
    }
    return '<span class="' + cls + '">' + match + '</span>';
  });
}