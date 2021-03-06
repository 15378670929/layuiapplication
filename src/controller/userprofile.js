﻿/**
 @Name：用户管理
 */
layui.define(['table', 'form', 'common', 'setter', 'laydate', 'verification'], function (exports) {
    var $ = layui.$
        , admin = layui.admin
        , view = layui.view
        , table = layui.table
        , common = layui.common
        , setter = layui.setter
        , laydate = layui.laydate
        , form = layui.form;

    table.render({
        elem: '#userprofile-table'
        , url: setter.apiAddress.userprofile.list
        , cols: [[
            { field: 'realName', title: '姓名' },
            { field: 'orgAccount', title: '账号' },
            {
                field: 'orgId', title: '所属机构', templet: function (d) {
                    if (d.organizationDto == null) {
                        return "";
                    }
                    return d.organizationDto.name;
                }
            },
            {
                field: 'gradeName', title: '年级', width: 100, templet: function (d) {
                    if (d.gradeClassDto == null) {
                        return "";
                    }
                    return d.gradeClassDto.gradeName;
                }
            },
            {
                field: 'classId', title: '班级', width: 100, templet: function (d) {
                    if (d.gradeClassDto == null) {
                        return "";
                    }
                    return d.gradeClassDto.className;
                }
            },
            {
                field: 'gender', title: '性别', width: 100, align: 'center'
            },
            { field: 'birthday', title: '出生日期', width: 150, align: 'center' },
            {
                field: 'status', title: '状态', align: 'center', width: 100,
                templet: function (d) { return d.status == 1 ? '<span style="color:#009688;">启用</span>' : '<span style="color:#FF5722;">禁用</span>'; }
            },
            {
                field: 'createTime', width: 150, title: '创建时间', align: 'center', templet: function (d) {
                  if(d.createTime){
                    return common.formatDate(d.createTime, "yyyy-MM-dd hh:mm")
                  }else{
                    return common.formatDate(d.createtime, "yyyy-MM-dd hh:mm")
                  }
                    
                }
            },
            {
                width: 150, title: '操作', align: 'center'
                , templet: function (d) {
                    var htmlButton = new Array();
                    htmlButton.push('<div class="layui-btn-group">')
                    htmlButton.push('<a class="layui-btn layui-btn-normal layui-btn-xs" lay-event="edit"><i class="layui-icon layui-icon-edit"></i>编辑</a>');
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
        , page: true
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
    //编辑&修改状态
    table.on('tool(userprofile-table)', function (obj) {
        var data = obj.data;
        if (obj.event === 'changestatus') {
            var titletext = "确认禁用？";
            if (!data.status) {
                titletext = "确认启用？";
            }
            layer.confirm(titletext, { icon: 3, title: '提示' }, function (index) {
                common.ajax(setter.apiAddress.userprofile.updatestatus, "POST", "", { id: data.id }, function (res) {
                    if (res.statusCode == 200) {
                        layer.close(index);
                        layui.table.reload('userprofile-table');
                    }
                    layer.msg(res.message);
                });
            });
        } else if (obj.event === 'edit') {
            admin.popup({
                title: '编辑'
                , area: ['600px', '600px']
                , resize: false
                , success: function (layero, index) {
                    view(this.id).render('usercenter/userprofile/edit', data).done(function () {
                        //初始化机构下拉框并设置默认选项
                        common.ajax(setter.apiAddress.organization.loadall, "GET", "", {}, function (res) {
                            common.select("orgId", res.data, data.organizationDto.id, 1);
                            form.render("select");
                        });
                        //初始化班级下拉框并设置默认选项
                        common.ajax(setter.apiAddress.classes.list, "GET", "", { organizationId: data.organizationDto.id }, function (res) {
                            $.each(res.data, function (index, item) {
                                if (data.classId == item.id) {
                                    $("#classId").append("<option value=\"" + item.id + "\" selected >" + item.gradeName + item.className + "</option>");
                                }
                                else {
                                    $("#classId").append("<option value=\"" + item.id + "\" >" + item.gradeName + item.className + "</option>");
                                }
                            });
                            form.render("select");
                        })
                        //监听机构下拉选事件,加载指定机构下的所有班级
                        form.on('select(orgfilter)', function (data) {
                            $("#classId").empty();
                            common.ajax(setter.apiAddress.classes.list, "GET", "", { organizationId: data.value }, function (res) {
                                $.each(res.data, function (index, item) {
                                    $("#classId").append("<option value=\"" + item.id + "\" selected >" + item.gradeName + item.className + "</option>");
                                });
                                form.render("select");
                            })
                        });
                        laydate.render({
                            elem: '#birthday'
                        });
                        $("input[name=Gender][value='男']").attr("checked", data.gender == '男' ? true : false);
                        $("input[name=Gender][value='女']").attr("checked", data.gender == '女' ? true : false);
                        form.render("radio");
                        //监听提交
                        form.on('submit(userprofile-form-submit)', function (data) {
                            common.ajax(setter.apiAddress.userprofile.update, "POST", "", data.field, function (res) {
                                if (res.statusCode == 200) {
                                    layer.close(index);
                                    table.reload('userprofile-table');
                                }
                                layer.msg(res.message);
                            });
                        });
                    });
                }
            });
        }
    });

    exports('userprofile', {})
});