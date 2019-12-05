/**
 @Name：系统角色
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
        elem: '#roles-table'
        , url: setter.apiAddress.roles.pagelist
        , cols: [[
            { field: 'roleName', title: '角色' },
            { field: 'description', title: '角色描述' },
            {
                field: 'updateTime', title: '更新时间', align: 'center', width: 200,
                templet: function (d) {
                    return d.updateTime.slice(0,10)
                }
            },
            {
                width: 300,
                title: '操作',
                align: 'center',
                templet: function (d) {
                    if (d.roleName === "超级管理员") {
                        return ''
                    }
                    var reportUrl = d.reportUrl;
                    var htmlButton = new Array();
                    htmlButton.push('<div class="layui-btn-group">')
                    htmlButton.push('<a class="layui-btn layui-btn-normal layui-btn-xs" lay-event="edit"><i class="layui-icon layui-icon-edit"></i>编辑</a>');
                    htmlButton.push('<a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="deleterole"><i class="layui-icon layui-icon-delete"></i>删除</a>');
                    htmlButton.push('<a class="layui-btn layui-btn-warm layui-btn-xs" lay-event="rightsettings"><i class="layui-icon layui-icon-set-fill"></i>权限配置</a>');
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



    //claims
    table.on('tool(roles-table)', function (obj) {
        var rowdata = obj.data;
        if (obj.event === 'rightsettings') {
            location.hash = '/settings/roles/permissionsettings/role=' + rowdata.id;
        } else if (obj.event === 'edit') {
            admin.popup({
                title: '编辑'
                , area: ['500px', '34%']
                , resize: true
                , success: function (layero, index) {
                    view(this.id).render('settings/roles/edit', rowdata).done(function () {
                        //监听提交
                        form.on('submit(roles-edit-form-submit)', function (data) {
                            data.field.OrganizationName = $('dl.layui-anim .layui-this').html()
                            common.ajax(setter.apiAddress.roles.edit, "POST", "", data.field, function (res) {
                                if (res.statusCode == 200) {
                                    layer.close(index);
                                    table.reload('roles-table');
                                }
                                layer.msg(res.message);
                            });
                        });
                    });
                }
            });
        } else if (obj.event === 'deleterole') {
            var titletext = "删除角色后，该角色下系统用户的权限均会受到影响。";
            layer.confirm(titletext, { icon: 3, title: '确认删除本角色？',btn: ['删除', '取消'] }, function (index) {
            var zdata = []
            // zdata.push({Id: rowdata.id})
            zdata.push(rowdata.id)
            console.log(zdata)
            common.ajax(setter.apiAddress.roles.delete, "POST", "json",  { list: zdata } , function (res) {
                    if (res.statusCode == 200) {
                        layer.close(index);
                        table.reload('roles-table');
                    }
                    layer.msg(res.message);
                });
            });
        }
    });

    exports('roles', {})
});