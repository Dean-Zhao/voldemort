//启动弹出框
var data_content;
function plan_addcase_pop(){
    $('#plan_addcase_pop').modal({
         keyboard: true
         });
  }
 //关闭pop only for 新增计划
function close_pop_plancase(){
    $(".alert").slideUp();
    window.location.href="/plan";
 }
// 查询测试用例方法
function query(currPage, limit) {
    var currPage = 1;
    let keywords = $("#keywords").val();
    let project = $("#cases_list").attr("proj");
    let api = $("#apis option:selected").attr("value");
    let tag = $("#tags option:selected").attr("value");
    // console.log(project);
    console.log("关键字_"+keywords);
    console.log("项目_"+project);
    console.log("api_"+api);
    console.log("tag_"+tag);
        $.ajax({
          type : "Get",
          url : "/api/cases/query",
          data : {
            "currPage" : currPage,
            "kw" : keywords,
            "api" : api,
            "tag" : tag,
            "project" : project
            },
          dataType : "json",
          success : function(data) {
            data_content = data["data"];
            var totalCount = data["count"];//数据总条数
            // console.log(totalCount);
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
                  url : "/api/cases/query",
                  data : {
                    "currPage" : currPage,
                    "kw" : keywords,
                    "api" : api,
                    "tag" : tag,
                    "project" : project
                  },
                  dataType : "json",
                  success : function(data) {
                    data_content = data["data"];
                    // console.log(data_content.length);
                    createTable(currPage,limit,totalCount,data_content);
                  },
                  error : function(data) {
                    pop_error("系统异常！");  
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
    for (let i = 0; i < showNum; i++) {
      if (i < data.length) {
        html.push('<tr>');
        html.push('<td><input type="checkbox" id="checkone'+i+'" name="checkone1" case_id="'+data[i]["id"]+'"/></td>');
        html.push('<td>'+data[i]["name"]+'</td>');  
        html.push('<td>'+data[i]["tag"]+'</td>');   
        html.push('<td>'+data[i]["api"]+'</td>');  
        html.push('</tr>');
      }
    }                        
    let mainObj = $('#cases_list');
    mainObj.empty();
    mainObj.html(html.join(''));
    loading(1);
  };
//用例管理界面全选按钮
$("#checkAll").click(function(event){
  $("input[name='checkone']").prop("checked",this.checked);
})
//用例添加界面全选按钮
$("#checkAll1").click(function(event){
  $("input[name='checkone1']").prop("checked",this.checked);
})
//取消选择
function cancle_select(){
   $("input[name='checkAlls']").prop("checked",false);
   query(1,10);
}
//选择用例
function select_cases(){
  let selected_cases = [];
  let count = $("#addcases_list").attr("count");  
  for (let i = 0; i < data_content.length; i++) {
        let selected_cases_status = $("#checkone"+i).prop("checked");
        let num = parseInt(count)+1;
        if (selected_cases_status) {
          let case_id = $("#checkone"+i).parent().parent().children().eq(0).children().eq(0).attr("case_id");
          let name = $("#checkone"+i).parent().parent().children().eq(1).html();
          let tag = $("#checkone"+i).parent().parent().children().eq(2).html();
          let api = $("#checkone"+i).parent().parent().children().eq(3).html();
          selected_cases.push('<tr><td><input type="checkbox" name="checkone" num="'+num+'" case_id="'+case_id+'"/></td><td>'+name+'</td><td>'+tag+'</td><td>'+api+'</td></tr>'); 
          count++;
        }
    }
    let mainObj = $('#addcases_list');
    mainObj.append(selected_cases);
    cancle_select();
    $("#addcases_list").attr("count",count);
}
//删除用例
function delete_cases(){
  let count = $("#addcases_list").attr("count"); 
    for (let i = 1; i <= count; i++) {
      let $selected_case = $("input[num='"+i+"']");
      if($selected_case.attr("case_id") != undefined){
        let selected_cases_status = $selected_case.prop("checked");
        if (selected_cases_status) {
          let $force_delete = $("input[num='"+i+"']").parent().parent();
          let m = {};
          m = $force_delete.html();
          $force_delete.remove();
        }
      }   
    }
   cancle_select();
}
//提交计划中的用例
function add_cases(){
  let count = $("#addcases_list").attr("count"); 
  let plan_id = $("#cases_list").attr("plan_id");
  let cases_pag = [];
  let pag_num =0;
  for (let i = 1; i <= count; i++) {
    let $selected_case = $("input[num='"+i+"']");
      if($selected_case.attr("case_id") != undefined){
        let p = $selected_case.attr("case_id");
        cases_pag[pag_num] = parseInt(p);
        pag_num++;
      }
    }
    if(cases_pag.length != 0){
      $.ajax({
        url:"/plan/"+plan_id+"/addCase",
        type : "Post",
        data:{
          "cases":cases_pag
        },
        success:function(data)
        {
          var Status = data["status"];
          var msg = data["msg"];
          if (Status==0){
            $("#add_cases_btn").prop("disabled","disabled");
            pop_success_reload(msg,"/plan",0,"");
          }
          else{
           pop_error(msg); 
           let resetbtn = function(){
            $("#add_cases_btn").removeAttr("disabled");
          }
          setTimeout(resetbtn,2500);
         }
       },
       error:function(data) 
       {
        pop_error("系统异常！");  
      }
    }); 
    } 
    else{
      pop_error("请选择用例！"); 
    }
}