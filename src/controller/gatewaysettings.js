﻿/**
 @Name：网关管理
 */
layui.define(['table', 'form', 'common', 'setter'], function (exports) {
    var $ = layui.$
        , admin = layui.admin
        , view = layui.view
        , table = layui.table
        , common = layui.common
        , setter = layui.setter
        , form = layui.form;

    table.render({
        elem: '#gateway-table'
        , url: setter.apiAddress.gateway.list
        , cols: [[
            { field: 'name', title: '网关名称' },
            { field: 'requestIdKey', title: '全局请求默认key' },
            { field: 'baseUrl', title: '请求路由根地址' },
            {
                field: 'isDefault', width: 150, title: '是否默认', align: 'center',
                templet: function (d) { return d.isDefault == 1 ? '是' : '否' }
            },
            {
                field: 'status', width: 150, title: '是否有效', align: 'center',
                templet: function (d) { return d.isDefault == 1 ? '是' : '否' }
            },
            {
                width: 150, title: '操作', align: 'center'
                , templet: function (d) {
                    var htmlButton = new Array();
                    htmlButton.push('<div class="layui-btn-group">')
                    htmlButton.push('<a class="layui-btn layui-btn-normal layui-btn-xs" lay-event="edit"><i class="layui-icon layui-icon-edit"></i>编辑</a>');
                    htmlButton.push('</div>')
                    return htmlButton.join('');
                }
            }
        ]]
        , page: false
        , height: 'full-320'
        , cellMinWidth: 80
        , text: '对不起，加载出现异常！'
        , response: {
            statusCode: 200
        }
        , parseData: function (res) {
            return {
                "code": res.statusCode,
                "msg": res.message,
                "data": res.data
            };
        }
    });

    //编辑
    table.on('tool(gateway-table)', function (obj) {
        var data = obj.data;
        if (obj.event === 'edit') {
            admin.popup({
                title: '编辑'
                , area: ['40%', '90%']
                , resize: false
                , success: function (layero, index) {
                    view(this.id).render('settings/gateway/edit', data).done(function () {
                        form.render();
                        form.on('submit(gateway-edit-form-submit)', function (data) {
                            common.ajax(setter.apiAddress.gateway.update, "POST", "", $('#gateway-edit-form').serialize(), function (res) {
                                if (res.statusCode == 200) {
                                    layer.close(index);
                                    layui.table.reload('gateway-table');
                                }
                                layer.msg(res.message);
                            }, function (error) {
                                layer.msg(error.msg);
                            });
                        });
                    });
                }
            });
        }
    });
    exports('gatewaysettings', {})
});