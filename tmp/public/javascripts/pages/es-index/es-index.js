"use strict";function _interopRequireDefault(t){return t&&t.__esModule?t:{default:t}}function Again(){$("#query").show(),$("#data").hide()}function dopage(t,a,e){for(i=1;i<=e;i++)$("#pager").append("<li><a href='javascript:void(0)' onclick='pageAjax(tuple_num,offset,n)'>"+i+"</a></li>")}function getFormData(){produceLine=$("#productLine").val(),type=$("#type").val(),bid=$("#bidInput").val(),clientIP=$("#clientIPInput").val(),opcode=$("#opcodeInput").val(),start_time=$("#start_time").val(),end_time=$("#end_time").val()}function doAjax(){getFormData();var t={unit:{produceLine:produceLine,type:type,bid:bid,clientIP:clientIP,opcode:opcode,start_time:start_time,end_time:end_time}},a=(0,_stringify2.default)(t),e="http://localhost:3000/search";$.ajax({url:e,type:"POST",data:a,dataType:"json",cache:!1,timeout:5e3,contentType:"application/json; charset=utf-8",success:function(t){$("#aye").button("reset"),0==t.status?($("#searchData").empty(),$.each(t.result,function(t,a){$("#searchData").append("<div>"+(0,_stringify2.default)(a)+"</div>")}),$("#query").hide(),$("#data").show(),$(".modal-body").text(statusArray[t.status]),$("#myModal").modal("show")):($(".modal-body").text("错误码: "+t.status+" "+statusArray[t.status]),$("#myModal").modal("show"))},Error:function(t,a,e){$(this).button("reset"),$(".modal-body").text(e.toString()),$("#myModal").modal("show")}})}var _stringify=require("babel-runtime/core-js/json/stringify"),_stringify2=_interopRequireDefault(_stringify),cnf_id=0,offset=15,tuple_num=0,total=0,n=total/15,sum=0,produceLine="",type="",bid="",clientIP="",opcode="",start_time="",end_time="",statusArray=[];statusArray[0]="查询成功",statusArray[1]="查无数据",statusArray[2]="时间字段错误",statusArray[3]="IP地址字段错误",statusArray[4]="掩码错误",statusArray[5]="未知错误",statusArray[6]="网络连接错误，无法与后端进行通讯",statusArray[7]="错误的请求地址",statusArray[8]="协议异常",statusArray[9]="不支持的编码",$("#again").click(function(){Again()});