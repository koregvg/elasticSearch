/**
 * Created by wangpai on 2016/12/3 0003.
 */
var checkAdd = require('./es-index-avaliable');

var cnf_id = 0;
var offset = 15;
var tuple_num = 0;
var total = 0;
var n = total / 15;

let queryObj={};

var statusArray = [];
statusArray[0] = "查询成功";
statusArray[1] = "查无数据";
statusArray[2] = "时间字段错误";
statusArray[3] = "IP地址字段错误";
statusArray[4] = "掩码错误";
statusArray[5] = "未知错误";
statusArray[6] = "网络连接错误，无法与后端进行通讯";
statusArray[7] = "错误的请求地址";
statusArray[8] = "协议异常";
statusArray[9] = "不支持的编码";

function getFormData() {
    let eles=document.forms[0].elements;
    for(let i=0;i<eles.length-1;i++){
        if($(eles[i]).val()!=0 && $(eles[i]).val()!=''){
            alert($(eles[i]).attr('name'));
            queryObj[$(eles[i]).attr('name')]=$(eles[i]).val();
        }
    }
}

function doAjax() {

    getFormData();

    var request = {
        unit: queryObj
    };

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
            if (data.status == 0) {
                $("#searchData").empty();
                $.each(data.result, function(i, item) {
                    $("#searchData").append('<div>'+JSON.stringify(item)+'</div>');
                });
                $('#query').hide();
                $('#data').show();

                $('.modal-body').text(statusArray[data.status]);
                $('#myModal').modal('show');
            }
            else {
                $(".modal-body").text("错误码:" + " " + data.status + " " + statusArray[data.status]);
                $('#myModal').modal('show');
            }
        },
        Error: function (xhr, error, exception) {
            $(this).button('reset');
            // 异常捕获
            $(".modal-body").text(exception.toString());
            $("#myModal").modal('show');
        }
    });
}

function Again(){
    $("#query").show();
    $("#data").hide();
}

$('#aye').click(function () {
    checkAdd(doAjax);
});

$('#again').click(function () {
    Again();
});
