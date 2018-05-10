// 解码
function decodeUnicode(str) {  
    str = str.replace(/\\/g, "%");  
    return unescape(str);  
}
// 查询方法
function query(currPage, limit) {
    var currPage = 1;
    var keywords = $("#keywords").val();
    var project = $("#keytypes option:selected").attr("value");
    console.log(project);
        $.ajax({
          type : "Get",
          url : "/api/apis",
          data : {
            "currPage" : currPage,
            "kw" : keywords,
            "sortType" : "desc",
            "project" : project
            },
          dataType : "json",
          success : function(data) {
            var data_content = data["data"];
            var totalCount = data["count"];//数据总条数
            console.log(totalCount);
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
                  url : "/api/apis",
                  data : {
                    "currPage" : currPage,
                    "kw" : keywords,
                    "sortType" : "desc",
                    "project" : project
                  },
                  dataType : "json",
                  success : function(data) {
                    var data_content = data["data"];
                    createTable(currPage,limit,totalCount,data_content);
                  },
                  error : function(data) {
                    $("#error_mess").html("系统异常！");
                    $("#confirm_error").slideDown();
                  }
                });
              }
            });
          },
          error : function(data) {
             $("#error_mess").html("系统异常！");
             $("#confirm_error").slideDown(); 
          }
        });
  }  
// 创建列表
function createTable(currPage,limit, totalCount, data) {
    let html = [], showNum = limit;
    console.log(data);
    if (totalCount - (currPage * limit) < 0) {
      showNum = totalCount - ((currPage - 1) * limit);  
    }                          
    html.push('<table class="table table-hover">');
    html.push('<thead><tr><th style="width:150px;">所属项目</th><th style="width:250px;">接口名称</th><th style="width:100px;">接口类型</th><th style="width:330px;">URL</th><th style="width:200px;">更新时间</th><th style="width:220px;">操作</th></tr></thead><tbody>');
    for (let i = 0; i < showNum; i++) {
      if (i < data.length) {
        html.push('<tr><td id='+data[i].id+'>'+data[i].proj+'</td>');
        html.push('<td>'+data[i].name+'</td>');
        html.push('<td>'+data[i].method+'</td>');
        html.push('<td>'+data[i].path+'</td>');
        html.push('<td>'+data[i].update_time+'</td>');
        html.push('<td><button type="button" class="btn btn-link " style="outline:none;width:38px;height: 23px; padding:0px;" onClick="apiEdit(this)">编辑</button><button type="button" class="btn btn-link process_delete" style="outline:none;width:38px;height: 23px; padding:0px;" onClick="apiDelete(this)">删除</button><button type="button" class="btn btn-link process_delete" style="outline:none;width:38px;height: 23px; padding:0px;" onClick="apiTestCase(this)">用例管理</button></td>');
        html.push('</tr>');
      }
    }
    html.push('</tbody></table>');
    let mainObj = $('#center_content_table');
    mainObj.empty();
    mainObj.html(html.join(''));
    loading(1);
};
//跳转新增界面
function apiAdd(){
      window.location.href = "/api/addApi/";
}
//跳转编辑界面
function apiEdit(id){
    var api_id = $(id).parent().parent().children().eq(0).attr("id");
      window.location.href = "/api/"+api_id+"/edit/";
}
//跳转用例管理界面
function apiTestCase(id){
    var api_id = $(id).parent().parent().children().eq(0).attr("id");
      window.location.href = "/api/"+api_id+"/cases/";
}