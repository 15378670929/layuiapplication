/**
 @Name：系统用户管理
 */
layui.define(['table', 'form', 'common', 'setter', 'laydate', 'verification'], function (exports) {
    var $ = layui.$
        , admin = layui.admin
        , view = layui.view
        , table = layui.table
        , common = layui.common
        , setter = layui.setter
        , laydate = layui.laydate
        , verification = layui.verification
        , form = layui.form;

    table.render({
        elem: '#adminuser-table'
        , url: setter.apiAddress.adminuser.list
        , cols: [[
            { field: 'userName', title: '姓名' },
            {
                field: 'gender', title: '性别', align: 'center',
                templet: function (d) { 
                    if (d.gender) {
                        return "女";
                    } else  {
                        return "男";
                    }
                }
            },
            { field: 'userAccount', title: '账号' },
            { field: 'phoneNumber', title: '手机' },
            {
                field: 'enabled', title: '状态', align: 'center', width: 100,
                templet: function (d) { return d.enabled == 1 ? '<span style="color:#009688;">启用</span>' : '<span style="color:#FF5722;">禁用</span>'; }
            },
            {
                field: 'createTime', width: 180, title: '创建时间', sort: true, templet: function (d) {
                    return common.formatDate(d.createTime, "yyyy-MM-dd hh:mm")
                }
            },
            {
                width: 320, title: '操作', align: 'center'
                , templet: function (d) {
                    var htmlButton = new Array();
                    htmlButton.push('<div class="layui-btn-group">')
                    htmlButton.push('<a class="layui-btn layui-btn-normal layui-btn-xs" lay-event="edit"><i class="layui-icon layui-icon-edit"></i>编辑</a>');
                    htmlButton.push('<a class="layui-btn layui-btn-warm layui-btn-xs" lay-event="set"><i class="layui-icon layui-icon-password"></i>角色权限</a>');
                    htmlButton.push('<a class="layui-btn layui-btn-warm layui-btn-xs" lay-event="resetpwd"><i class="layui-icon layui-icon-password"></i>重置密码</a>');
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

    var roles = {
        init: function (organizationId, roleId) {
            $("#RoleId").empty();
            $("#RoleId").append("<option value=\"\">请选择角色</option>");
            common.ajax(setter.apiAddress.roles.list, "Get", "", { organizationId: organizationId }, function (res) {
                $.each(res.data, function (index, item) {
                    if (roleId == item.id) {
                        $("#RoleId").append("<option value=\"" + item.id + "\" selected=\"selected\">" + item.name + "</option>");
                    } else {
                        $("#RoleId").append("<option value=\"" + item.id + "\">" + item.name + "</option>");
                    }
                });
                form.render();
            });
        }
    }
    table.on('tool(adminuser-table)', function (obj) {
        var data = obj.data;
        if (obj.event === 'changestatus') {
            var titletext = "确认禁用？";
            if (!data.status) {
                titletext = "确认启用？";
            }
            layer.confirm(titletext, { icon: 3, title: '提示' }, function (index) {
                common.ajax(setter.apiAddress.adminuser.updatestate, "POST", "", { Id: data.id }, function (res) {
                    if (res.statusCode == 200) {
                        layer.close(index);
                        table.reload('adminuser-table');
                    }
                    layer.msg(res.message);
                });
            });
        } else if (obj.event === 'resetpwd') {
            admin.popup({
                title: '重置密码'
                , area: ['500px', '320px']
                , resize: false
                , success: function (layero, index) {
                    view(this.id).render('settings/adminuser/resetpwd', data).done(function () {
                        form.render();
                        form.on('submit(resetpwd-form-submit)', function (data) {
                            common.ajax(setter.apiAddress.adminuser.updatepassword, "POST", "", data.field, function (res) {
                                if (res.statusCode == 200) {
                                    layer.close(index);
                                }
                                layer.msg(res.message);
                            });
                        });
                    });
                }
            });
        } else if (obj.event === 'edit') {
            admin.popup({
                title: '修改'
                , area: ['50%', '40%']
                , resize: false
                , success: function (layero, index) {
                    view(this.id).render('settings/adminuser/edit', data).done(function () {
                        console.log(data)
                        $("input[name=Gender][value=false]").attr("checked", data.gender == 0 ? true : false);
                        $("input[name=Gender][value=true]").attr("checked", data.gender == 1 ? true : false);
                        form.render();
                        //初始化添加页面角色列表
                        form.on('select(edit-user-organization-filter)', function (data) {
                            roles.init(data.value, "");
                        });
                        form.on('submit(adminuser-edit-form-submit)', function (data) {
                            common.ajax(setter.apiAddress.adminuser.update, "POST", "", data.field, function (res) {
                                if (res.statusCode == 200) {
                                    layer.close(index);
                                    table.reload('adminuser-table');
                                }
                                layer.msg(res.message);
                            });
                        });
                    });
                }
            });
        } else if (obj.event === 'set') {
            admin.popup({
                title: '角色权限'
                , area: ['500px', '320px']
                , resize: false
                , success: function (layero, index) {
                    view(this.id).render('settings/adminuser/roleauthorize', data).done(function () {
                        form.render();
                        form.on('submit(roleauthorize-form-submit)', function (data) {
                            // common.ajax(setter.apiAddress.adminuser.updatepassword, "POST", "", data.field, function (res) {
                            //     if (res.statusCode == 200) {
                            //         layer.close(index);
                            //     }
                            //     layer.msg(res.message);
                            // });
                        });
                    });
                }
            });
        }
    });

    exports('adminuser', {})
});