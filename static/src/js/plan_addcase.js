// 查询方法
function query(currPage, limit) {
    var currPage = 1;
    var keywords = $("#keywords").val();
    var project = $("#keytypes option:selected").attr("id");
    console.log(project);
        $.ajax({
          type : "Get",
          url : "rest_api_list_content/",
          // url : "http://172.19.162.104:8000/api/apis",
          data : {
            "currPage" : currPage,
            "keyword" : keywords,
            "sortType" : "desc",
            "project" : project
            },
          dataType : "json",
          success : function(data) {
            var data_content = data["data"];
            var totalCount = queryTatol();//数据总条数
            // var totalCount = data["count"];//数据总条数
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
                  url : "rest_api_list_content/",
                  // url : "http://172.19.162.104:8000/api/apis",
                  data : {
                    "currPage" : currPage,
                    "keyword" : keywords,
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
                    $('#process_message').modal({
                     keyboard: true
                   }); 
                  }
                });
              }
            });
          },
          error : function(data) {
             $("#error_mess").html("系统异常！");
             $('#process_message').modal({
               keyboard: true
             }); 
          }
        });
  }  
//查询数据总条数
function queryTatol() {
    var keywords = $("#keywords").val();
    $.ajax({
      type : "Get",
      url : "rest_api_list_count/",
      data : {keyword:keywords},
      dataType : "json",
      async : false,
      success : function(data) {
        totalCount = data["count"];
      },
      error : function(data) {
        $("#error_mess").html("系统异常！");
        $('#process_message').modal({
         keyboard: true
       }); 
      }
    });
    return totalCount;
  }
// 创建列表
function createTable(currPage,limit, totalCount, data) {
    let html = [], showNum = limit;
    console.log(data);
    if (totalCount - (currPage * limit) < 0) {
      showNum = totalCount - ((currPage - 1) * limit);  
    }                          
    html.push('<table class="table table-hover">');
    html.push('<thead><tr><th  style="width:300px;">计划名称</th><th style="width:150px;">所属项目</th><th style="width:100px;">创建人</th><th style="width:190px;">创建时间</th><th style="width:190px;">最近测试时间</th><th style="width:100px;">状态</th><th style="width:220px;">操作</th></tr></thead><tbody>');
        html.push('<tr><td id="asas">赵伟测试风云诀的回归测试2赵伟测试风云诀的回归测试2.3</td>');
        html.push('<td>风云诀</td>');
        html.push('<td>dean</td>');
        html.push('<td>2018-06-12 21:12:22</td>');
        html.push('<td>2018-05-18 22:11:23</td>');
        html.push('<td><span class="label label-warning">任务中</span></td>');
        html.push('<td><button type="button" class="btn btn-link table_btn_lef" id="account_pwd_reset" onClick="apiEdit(this)">查看</button><button type="button" class="btn btn-link table_btn_lef" id="delete_account" onClick="apiDelete(this)">删除</button><button type="button" class="btn btn-link table_btn_mid" id="delete_account" onClick="apiTestCase(this)">历史任务</button><button type="button" class="btn btn-link table_btn_mid" id="delete_account" onClick="apiTestCase(this)">创建任务</button></td>');
        html.push('</tr>');
    html.push('</tbody></table>');
    let mainObj = $('#center_content_table');
    mainObj.empty();
    mainObj.html(html.join(''));
    loading(1);
  };
//用例管理界面全选按钮
   $("#checkAll").click(function(event){
    console.log("111");
    console.log(!($(this).attr("checked")));
      $("input[name='checkone']").prop("checked",this.checked);
    })
