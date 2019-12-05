/**
 @Name：系统中受保护的API资源
 */
layui.define(['table', 'form', 'common', 'setter', 'element', 'verification'], function (exports) {
    var $ = layui.$
        , admin = layui.admin
        , view = layui.view
        , table = layui.table
        , common = layui.common
        , setter = layui.setter
        , element = layui.element
        , form = layui.form;

    //Init ApiResource Table
    table.render({
        elem: '#apiresource-table'
        , url: setter.apiAddress.apiresource.apiresourcelist
        , cols: [[
            { field: 'name', title: 'API资源名称' },
            { field: 'displayName', title: '显示名称' },
            { field: 'description', title: '资源描述' },
            {
                field: 'enabled', title: '是否可用',
                width: 100,
                align: 'center',
                templet: function (d) { return d.enabled == 1 ? '是' : '否' }
            },
            {
                width: 150, title: '操作', align: 'center'
                , templet: function (d) {
                    var htmlButton = new Array();
                    htmlButton.push('<div class="layui-btn-group">')
                    htmlButton.push('<a class="layui-btn layui-btn-warm layui-btn-xs" lay-event="config"><i class="layui-icon layui-icon-set"></i>配置</a>');
                    htmlButton.push('<a class="layui-btn layui-btn-normal layui-btn-xs" lay-event="edit"><i class="layui-icon layui-icon-edit"></i>编辑</a>');
                    htmlButton.push('</div>')
                    return htmlButton.join('');
                }
            }
        ]]
        , page: false
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
                "data": res.data
            };
        }
    });

    var configure = {
        initResourceSecretTab: function (id) {
            table.render({
                elem: '#apiresourcesecret-table'
                , url: setter.apiAddress.apiresource.apisecretlist + "?apiResourceId=" + id
                , cols: [[
                    { field: 'description', title: '描述' },
                    { field: 'expiration', title: '有效期' },
                    { field: 'type', title: '类型' },
                    { field: 'value', title: '密码' },
                    { title: '操作', width: 220, align: 'center', fixed: 'right', toolbar: '#table-apiresourcesecret-btn' }
                ]]
                , page: false
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
                        "data": res.data
                    };
                }
            });
        },
        initApiResourceScopeTab: function (id) {
            table.render({
                elem: '#apiresourcescope-table'
                , url: setter.apiAddress.apiresource.apiscopelist + "?apiResourceId=" + id
                , cols: [[
                    { field: 'name', title: '名称' },
                    { field: 'description', title: '描述' },
                    { field: 'displayName', title: '显示名称' },
                    {
                        field: 'emphasize', title: '是否强调',
                        width: 100, align: 'center',
                        templet: function (d) { return d.isDefault == 'true' ? '是' : '否' }
                    },
                    {
                        field: 'required', title: '是否必须',
                        width: 100, align: 'center',
                        templet: function (d) { return d.isDefault == 'true' ? '是' : '否' }
                    },
                    {
                        field: 'showInDiscoveryDocument', title: '是否显示',
                        width: 100, align: 'center',
                        templet: function (d) { return d.isDefault == 'true' ? '是' : '否' }
                    },
                    { title: '操作', width: 100, align: 'center', fixed: 'right', toolbar: '#table-apiresourcescope-btn' }
                ]]
                , page: false
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
                        "data": res.data
                    };
                }
            });
        },
        initApiResourceClaimsTab: function (id) {
            table.render({
                elem: '#apiresourceclaims-table'
                , url: setter.apiAddress.apiresource.apiresourceclaimslist + "?apiResourceId=" + id
                , cols: [[
                    { field: 'type', title: '类型' },
                    { title: '操作', width: 220, align: 'center', fixed: 'right', toolbar: '#table-apiresourceclaims-btn' }
                ]]
                , page: false
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
                        "data": res.data
                    };
                }
            });
        }
    };

    //编辑&删除
    table.on('tool(apiresource-table)', function (obj) {
        var data = obj.data;
        if (obj.event === 'edit') {
            admin.popup({
                title: '编辑受保护的API资源'
                , area: ['600px', '310px']
                , resize: false
                , success: function (layero, index) {
                    view(this.id).render('settings/apiresource/edit', data).done(function () {
                        form.on('submit(apiresource-form-submit)', function (data) {
                            common.ajax(setter.apiAddress.apiresource.updateapiresource, "POST", "", $('#apiresource-edit-form').serialize(), function (res) {
                                if (res.statusCode == 200) {
                                    layer.close(index);
                                    layui.table.reload('apiresource-table');
                                }
                                layer.msg(res.message);
                            }, function (error) {
                                layer.msg(error.msg);
                            });
                        });
                    });
                }
            });
        } else if (obj.event === 'config') {
            admin.popup({
                title: '配置受保护的API资源'
                , area: ['60%', '60%']
                , success: function (layero, index) {
                    view(this.id).render('settings/apiresource/configure', data).done(function () {
                        configure.initResourceSecretTab(data.id);
                        element.on('tab(apiresource-configure-tab)', function (tabdata) {
                            var index = tabdata.index;
                            switch (index) {
                                case 0:
                                    configure.initResourceSecretTab(data.id);
                                    break;
                                case 1:
                                    configure.initApiResourceClaimsTab(data.id);
                                    break;
                                case 2:
                                    configure.initApiResourceScopeTab(data.id);
                                    break;
                            }
                        });
                        form.on('submit(apiresourcesecret-form-submit)', function (data) {
                            var submitdata = $('#apiresourcesecret-form').serialize();
                            common.ajax(setter.apiAddress.apiresource.addapisecret, "POST", "", submitdata, function (res) {
                                if (res.statusCode == 200) {
                                    layui.table.reload('apiresourcesecret-table');
                                    common.resetform("apiresourcesecret-form");
                                }
                                layer.msg(res.message);
                            });
                        });
                        form.on('submit(apiresourcescope-form-submit)', function (data) {
                            var submitdata = $('#apiresourcescope-form').serialize();
                            common.ajax(setter.apiAddress.apiresource.addapiscope, "POST", "", submitdata, function (res) {
                                if (res.statusCode == 200) {
                                    layui.table.reload('apiresourcescope-table');
                                    common.resetform("apiresourcescope-form");
                                }
                                layer.msg(res.message);
                            });
                        });
                        form.on('submit(apiresourceclaims-form-submit)', function (data) {
                            var submitdata = $('#apiresourceclaims-form').serialize();
                            common.ajax(setter.apiAddress.apiresource.addapiresourceclaims, "POST", "", submitdata, function (res) {
                                if (res.statusCode == 200) {
                                    layui.table.reload('apiresourceclaims-table');
                                    common.resetform("apiresourceclaims-form");
                                }
                                layer.msg(res.message);
                            });
                        });
                    });
                }
            });
        }
    });
    table.on('tool(apiresourcesecret-table)', function (obj) {
        var data = obj.data;
        if (obj.event === 'del') {
            layer.confirm('确定删除？', function (index) {
                common.ajax(setter.apiAddress.apiresource.deleteapisecret, "POST", "", { id: data.id }, function (res) {
                    if (res.statusCode == 200) {
                        layui.table.reload('apiresourcesecret-table');
                    }
                    layer.msg(res.message);
                });
            });
        }
    });
    table.on('tool(apiresourcescope-table)', function (obj) {
        var data = obj.data;
        if (obj.event === 'del') {
            layer.confirm('确定删除？', function (index) {
                common.ajax(setter.apiAddress.apiresource.deleteapiscope, "POST", "", { id: data.id }, function (res) {
                    if (res.statusCode == 200) {
                        layui.table.reload('apiresourcescope-table');
                    }
                    layer.msg(res.message);
                });
            });
        }
    });
    table.on('tool(apiresourceclaims-table)', function (obj) {
        var data = obj.data;
        if (obj.event === 'del') {
            layer.confirm('确定删除？', function (index) {
                common.ajax(setter.apiAddress.apiresource.deleteapiresourceclaims, "POST", "", { id: data.id }, function (res) {
                    if (res.statusCode == 200) {
                        layui.table.reload('apiresourceclaims-table');
                    }
                    layer.msg(res.message);
                });
            });
        }
    });
    exports('apiresource', {})
});