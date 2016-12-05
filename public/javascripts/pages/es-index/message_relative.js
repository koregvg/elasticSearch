/**
 * Created by wangpai on 2015/11/3.
 */
    var cnf_id = 0;
    var offset=15;
    var tuple_num=0;
    var total=0;
    var n=total/15;

    var sum=0;
    var cmd_type = $("#cmd_type").val();
    var tcp_flag = $("#tcp_flag").val();
    var protocal = $("#protocal").val();
    var start_time = $("#start_time").val();
    var end_time = $("#end_time").val();
    var start_sip = $("#start_sip").val();
    var end_sip = $("#end_sip").val();
    var start_dip = $("#start_dip").val();
    var end_dip = $("#end_dip").val();
    var request_field = $(".request_field[name=checkbox]").each(function(){
    if($(this).prop("checked")==true)
        sum=sum+$(this).val();
    return sum;
});

    function dopage(tuple_num,offset,n){
        for(i=1;i<=n;i++)
    $("#pager").append("<li><a href='javascript:void(0)' onclick='pageAjax(tuple_num,offset,n)'>"+i+"</a></li>");
    }

    function doAjax() {



    var statusArray=["成功","指令ID重复","缺少必选字段","字段定义冲突",
        "版本错误","检验码错误","操作类型错误","长度错误","用户标识错误",
        "规则数量错误","数据查询失败","权限错误","指令处理超时"]
        statusArray[32]="时间字段错误";
        statusArray[33]="IP地址字段错误";
        statusArray[34]="掩码错误";
        statusArray[34]="未知错误";
        statusArray[301]="网络连接错误，无法与后端进行通讯";
        statusArray[302]="错误的请求地址";
        statusArray[303]="协议异常";
        statusArray[304]="不支持的编码";

        var request = {
        header : {
            cmd_type: cmd_type,
            cnf_id: cnf_id},
        unit : {
            protocal: protocal,
            start_time: start_time,
            end_time: end_time,
            start_sip: start_sip,
            end_sip: end_sip,
            start_dip: start_dip,
            end_dip: end_dip,
            request_field : request_field
        },
        offset:offset,
        tuple_num:tuple_num,
    };
//调用了jquery.json 库
    var encoded = JSON.stringify(request);
    var jsonStr = encoded;
    var actionStr = "../../../client/link";
        $.ajax({
            url: actionStr,
            type: 'POST',
            data: jsonStr,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                $("#aye").button('reset');
                if (data.rcmd == 0){
                    cnf_id=data.cnf_id;
                    total=data.total;
                    n=total/offset;
                    dopage(tuple_num,offset,n);
                    $(".modal-body").text(data.rcmd);
                }
                else{
                    $(".modal-body").text(status);
                }
                $("#myModal").modal('show');
//         Do Anything After get Return data
//          $.each(data.payload, function(index){
//              $("#result").append("</br>" + data.payload[index].beanStr);
//          });
            },
            Error: function (xhr, error, exception) {
                $(this).button('reset');
                // handle the error.
                alert(exception.toString());
                $("#myModal").modal('show');
            }
        });
}

function pageAjax(tuple_num,offset,n){
    var pagerequest = {
        REQ_LINK: {

            header: {
                cmd_type: cmd_type,
                cnf_id: cnf_id
            },
            unit: {
                protocal: protocal,
                start_time: start_time,
                end_time: end_time,
                start_sip: start_sip,
                end_sip: end_sip,
                start_dip: start_dip,
                end_dip: end_dip,
                request_field: request_field
            },
        },
        offset:offset,
        tuple_num:tuple_num,
    };

    var encoded = JSON.stringify(pagerequest);
    var jsonStr = encoded;
    var actionStr = "../../../client/link";
    $.ajax({
        url: actionStr,
        type: 'POST',
        data: jsonStr,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            $("#aye").button('reset');
            if (data.rcmd == 0){
                $("#tbody").empty();
                $.each(data.list, function(i, item) {
                    if(item=="undefined"){
                    $("#tbody").append("<tr><td>" +"无"+"</td></tr>");
                    }else{
                        $("#tbody").append("<tr><td>" + item +"</td></tr>");
                    }
                })
            }
            else{
                $(".modal-body").text("错误码"+" "+data.rcmd+" "+statusArray[data.rcmd]);
                $("#myModal").modal('show');
            }

//         Do Anything After get Return data
//          $.each(data.payload, function(index){
//              $("#result").append("</br>" + data.payload[index].beanStr);
//          });
        },
        Error: function (xhr, error, exception) {
            $(this).button('reset');
            // handle the error.
            alert(exception.toString());
            $("#myModal").modal('show');
        }
    });

}
