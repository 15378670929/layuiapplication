﻿/**
 @Name：测评课程管理
 */
layui.define(['table', 'form', 'common', 'setter', 'laydate', 'verification', 'upload'], function (exports) {
    var $ = layui.$
        , admin = layui.admin
        , view = layui.view
        , table = layui.table
        , common = layui.common
        , setter = layui.setter
        , laydate = layui.laydate
        , verification = layui.verification
        , upload = layui.upload
        , form = layui.form;

    table.render({
        elem: '#course-table'
        , url: setter.apiAddress.course.pagelist
        , cols: [[
            { field: 'name', title: '名称' },
            { field: 'version', title: '版本', width: 150, align: 'center' },
            {
                field: 'icon', title: '图标', align: 'center', width: 100, templet: function (d) {
                    if (d.icon != null && d.icon != "") {
                        return '<img style="width:26px;display: inline-block;" class="layui-upload-img" src=' + d.icon + '>'
                    } return ""
                }
            },
            {
                field: 'status', title: '状态', align: 'center', width: 100,
                templet: function (d) { return d.status == 1 ? '<span style="color:#009688;">启用</span>' : '<span style="color:#FF5722;">禁用</span>'; }
            },
            { field: 'remark', title: '备注' },
            {
                field: 'createTime', width: 150, title: '创建时间', align: 'center', templet: function (d) {
                    return common.formatDate(d.createTime, "yyyy-MM-dd hh:mm")
                }
            },
            {
                width: 200, title: '操作', align: 'center'
                , templet: function (d) {
                    var htmlButton = new Array();
                    htmlButton.push('<div class="layui-btn-group">')
                    htmlButton.push('<a class="layui-btn layui-btn-normal layui-btn-xs" lay-event="edit"><i class="layui-icon layui-icon-edit"></i>编辑</a>');
                    htmlButton.push('<a class="layui-btn layui-btn-normal layui-btn-xs" lay-event="classhour"><i class="layui-icon layui-icon-tips"></i>课时</a>');
                    if (d.status) {
                        htmlButton.push('<a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="changestatus"><i class="layui-icon layui-icon-close"></i>禁用</a>');
                    } else {
                        htmlButton.push('<a class="layui-btn layui-btn-warm layui-btn-xs" lay-event="changestatus"><i class="layui-icon layui-icon-ok"></i>启用</a>');
                    }
                    htmlButton.push('</div>')
                    return htmlButton.join('');
                }
            }
        ]]
        , page: {
            curr: 0
        }
        , height: 'full-320'
        , cellMinWidth: 80
        , text: {
            none: '暂无相关数据'
        }
        , response: {
            statusCode: 200
        }
        , parseData: function (res) {
            return {
                "code": res.statusCode,
                "msg": res.message,
                "count": res.data.totalCount,
                "data": res.data.items
            };
        }
    });

    //表格事件
    table.on('tool(course-table)', function (obj) {
        var data = obj.data;
        if (obj.event === 'changestatus') {
            var titletext = "确认禁用？";
            if (!data.status) {
                titletext = "确认启用？";
            }
            layer.confirm(titletext, { icon: 3, title: '提示' }, function (index) {
                common.ajax(setter.apiAddress.course.updatestatus, "POST", "", { id: data.id }, function (res) {
                    if (res.statusCode == 200) {
                        layer.close(index);
                        table.reload('course-table');
                    }
                    layer.msg(res.message);
                });
            });
        } else if (obj.event === 'edit') {
            admin.popup({
                title: '编辑'
                , area: ['50%', '55%']
                , resize: false
                , success: function (layero, index) {
                    view(this.id).render('content/course/edit', data).done(function () {
                        $("select[name=CourseClass]").val(data.courseClass);
                        $("input[name=Status][value=true]").attr("checked", data.status == true ? true : false);
                        $("input[name=Status][value=false]").attr("checked", data.status == false ? true : false);
                        form.render();
                        //普通图片上传
                        upload.render({
                            elem: '#uploadicon'
                            , url: setter.apiAddress.image.imageupload+"?filePath=content/course/edit"
                            , field: "imgFile"
                            , accept: 'file'
                            , size: 2048
                            , exts: 'jpg|png'
                            , data: { imgType: "1" }
                            , before: function (obj) {
                                obj.preview(function (index, file, result) {
                                    $('#showicon').attr('src', result); //图片链接（base64）
                                    $('#showicon').css('width', '80px');
                                });
                            }
                            , done: function (res) {
                                if (res.code == 200) {
                                    $("#icon").val(res.data.src);
                                    layer.msg(res.msg);
                                }
                            }
                            , error: function (e) {
                                layer.msg("上传失败!");
                            }
                        });
                        form.on('submit(course-edit-form-submit)', function (data) {
                            if ($("#icon").val() == "") {
                                layer.msg("请上传图标");
                            } else {
                                common.ajax(setter.apiAddress.course.update, "POST", "", data.field, function (res) {
                                    if (res.statusCode == 200) {
                                        layer.close(index);
                                        table.reload('course-table');
                                    }
                                    layer.msg(res.message);
                                });
                            }
                        });
                    });
                }
            });
        } else if (obj.event === 'classhour') {
            location.hash = '/content/childrencourse/index/courseid=' + data.id + '';
        }
    });
    exports('course', {})
});