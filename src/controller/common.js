/**
 @Name：公共业务
 公共业务的逻辑处理可以写在此处，切换任何页面都会执行
 */

layui.define(['jquery'], function (exports) {

    var $ = layui.$
        , layer = layui.layer
        , laytpl = layui.laytpl
        , setter = layui.setter
        , view = layui.view
        , admin = layui.admin

    //AJAX请求
    var obj = {
        ajax: function (url, type, dataType, data, callback) {
            $.ajax({
                url: url,
                type: type,
                dataType: dataType,
                headers: { Authorization: "Bearer " + sessionStorage.getItem("access_token") },
                data: data,
                beforeSend: function () {
                    this.layerIndex = layer.load(0, { shade: [0.2, '#393D49'] });
                },
                complete: function () {
                    layer.close(this.layerIndex);
                },
                success: callback
            });
        }
        , select: function (id, data, selectid, level) {
            $('#' + id + '').append("<option value=''>" + "请选择" + "</option>");
            $.each(data, function (index, item) {
                if (level == 1) {
                    if (selectid == item.id) {
                        $('#' + id + '').append("<option value=\"" + item.id + "\" selected >" + item.name + "</option>");
                    }
                    else {
                        $('#' + id + '').append("<option value=\"" + item.id + "\">" + item.name + "</option>");
                    }
                }
                else if (level == 2 || level == 3) {
                    if (selectid == item.id) {
                        $('#' + id + '').append("<option value=\"" + item.id + "\" selected >" + item.name + "</option>");
                    } else {
                        $('#' + id + '').append("<option value=\"" + item.id + "\" >" + item.name + "</option>");
                    }
                }
            });
        },
        // 日期格式化   
        formatDate: function (datetime, fmt) {
            if (parseInt(datetime) == datetime) {
                if (datetime.length == 10) {
                    datetime = parseInt(datetime) * 1000;
                } else if (datetime.length == 13) {
                    datetime = parseInt(datetime);
                }
            }
            datetime = new Date(datetime);
            var o = {
                "M+": datetime.getMonth() + 1,                        //月份   
                "d+": datetime.getDate(),                            //日   
                "h+": datetime.getHours(),                          //小时   
                "m+": datetime.getMinutes(),                       //分   
                "s+": datetime.getSeconds(),                      //秒   
                "q+": Math.floor((datetime.getMonth() + 3) / 3), //季度
                "S": datetime.getMilliseconds()                 //毫秒   
            };
            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (datetime.getFullYear() + "").substr(4 - RegExp.$1.length));
            }
            for (var k in o) {
                if (new RegExp("(" + k + ")").test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                }
            }
            return fmt;
        },
        nowdate: function () {
            function p(s) {
                return s < 10 ? '0' + s : s;
            }
            var myDate = new Date();
            var year = myDate.getFullYear();
            var month = myDate.getMonth() + 1;
            var dates = myDate.getDate();
            var h = myDate.getHours(); //获取当前小时数(0-23)
            var m = myDate.getMinutes(); //获取当前分钟数(0-59)
            var s = myDate.getSeconds();
            return year + '-' + p(month) + "-" + p(dates) + " " + p(h) + ':' + p(m) + ":" + p(s);
        },
        //逐个清空input、select值
        resetform: function (formId) {
            $("#" + formId).find('input[type=text],select,input[type=hidden]').each(function () {
                $(this).val('');
            });
        },
        //生成GUID
        guid: function () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }
    }
    //对外暴露的接口
    exports('common', obj);
});