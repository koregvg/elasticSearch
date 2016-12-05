/**
 * Created by wangpai on 2016/12/3 0003.
 */

var cnf_id = 0;
var offset=15;
var tuple_num=0;
var total=0;
var n=total/15;

var sum=0;
var produceLine = '';
var type = '';
var bid = '';
var clientIP = '';
var opcode = '';
var start_time = '';
var end_time = '';


function dopage(tuple_num,offset,n){
    for(i=1;i<=n;i++)
        $("#pager").append("<li><a href='javascript:void(0)' onclick='pageAjax(tuple_num,offset,n)'>"+i+"</a></li>");
}

function getFormData() {
     produceLine = $("#productLine").val();
     type = $("#type").val();
     bid = $("#bidInput").val();
     clientIP = $("#clientIPInput").val();
     opcode = $("#opcodeInput").val();
     start_time = $("#start_time").val();
     end_time = $("#end_time").val();
}

function doAjax() {

    getFormData();

    var statusArray=["成功","指令ID重复","缺少必选字段","字段定义冲突",
        "版本错误","检验码错误","操作类型错误","长度错误","用户标识错误",
        "规则数量错误","数据查询失败","权限错误","指令处理超时"];
    statusArray[0]="查询成功";
    statusArray[32]="时间字段错误";
    statusArray[33]="IP地址字段错误";
    statusArray[34]="掩码错误";
    statusArray[34]="未知错误";
    statusArray[301]="网络连接错误，无法与后端进行通讯";
    statusArray[302]="错误的请求地址";
    statusArray[303]="协议异常";
    statusArray[304]="不支持的编码";

    var request = {
        unit : {
            produceLine: produceLine,
            type: type,
            bid:bid,
            clientIP:clientIP,
            opcode:opcode,
            start_time:start_time,
            end_time:end_time
            //request_field : request_field
        }
        // offset:offset,
        // tuple_num:tuple_num,
    };
//调用了jquery.json 库
    var jsonData = JSON.stringify(request);
    var reqUrl = 'http://localhost:3000/search';
    $.ajax({
        url: reqUrl,
        type: 'POST',
        data: jsonData,
        dataType: 'json',
        cache: false,
        timeout: 5000,
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            $("#aye").button('reset');
            if (data.status == 0){
                $('#searchData').text(JSON.stringify(data.result));
                $('#query').hide();
                $('#data').show();

                // cnf_id=data.cnf_id;
                // total=data.total;
                // n=total/offset;
                // dopage(tuple_num,offset,n);
                // $(".modal-body").text(data.rcmd);

                $('.modal-body').text(statusArray[data.status]);
                $('#myModal').modal('show');
            }
            else{
                $(".modal-body").text("错误码"+" "+data.status+" "+statusArray[status]);
                $('.modal-body').text(statusArray[data.status]);
            }

//         Do Anything After get Return data
//          $.each(data.payload, function(index){
//              $("#result").append("</br>" + data.payload[index].beanStr);
//          });
        },
        Error: function (xhr, error, exception) {
            $(this).button('reset');
            // 异常捕获
            $(".modal-body").text(exception.toString());
            $("#myModal").modal('show');
        }
    });
}

// function pageAjax(tuple_num,offset,n){
//     var pagerequest = {
//         REQ_LINK: {
//
//             header: {
//                 cmd_type: cmd_type,
//                 cnf_id: cnf_id
//             },
//             unit: {
//                 protocal: protocal,
//                 start_time: start_time,
//                 end_time: end_time,
//                 start_sip: start_sip,
//                 end_sip: end_sip,
//                 start_dip: start_dip,
//                 end_dip: end_dip,
//                 request_field: request_field
//             },
//         },
//         offset:offset,
//         tuple_num:tuple_num,
//     };
//
//     var encoded = JSON.stringify(pagerequest);
//     var jsonStr = encoded;
//     var actionStr = "../../../client/link";
//     $.ajax({
//         url: actionStr,
//         type: 'POST',
//         data: jsonStr,
//         dataType: 'json',
//         contentType: "application/json; charset=utf-8",
//         success: function (data) {
//             $("#query").hide();
//             $("#data").show();
//             $("#aye").button('reset');
//             if (data.rcmd == 0){
//                 $("#tbody").empty();
//                 $.each(data.list, function(i, item) {
//                     if(item=="undefined"){
//                         $("#tbody").append("<tr><td>" +"无"+"</td></tr>");
//                     }else{
//                         $("#tbody").append("<tr><td>" + item +"</td></tr>");
//                     }
//                 })
//             }
//             else{
//                 $(".modal-body").text("错误码"+" "+data.rcmd+" "+statusArray[data.rcmd]);
//                 $("#myModal").modal('show');
//             }
//
// //         Do Anything After get Return data
// //          $.each(data.payload, function(index){
// //              $("#result").append("</br>" + data.payload[index].beanStr);
// //          });
//         },
//         Error: function (xhr, error, exception) {
//             $(this).button('reset');
//             // handle the error.
//             alert(exception.toString());
//             $("#myModal").modal('show');
//         }
//     });
//
// }


/////////////////////////
// $.ajax({
//     data: {
//         index: 'zfd',
//         password: 'rd'
//     },
//     url: 'http://localhost:3000/search',
//     dataType: 'text',
//     cache: false,
//     timeout: 5000,
//     success: function(data){
//         var data = data;
//         alert(data);
//     },
//     error: function(jqXHR, textStatus, errorThrown){
//         alert('error ' + textStatus + " " + errorThrown);
//     }
// });