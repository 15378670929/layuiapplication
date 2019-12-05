/**
 @Name：服务管理
 */
layui.define(['table', 'form', 'common', 'setter', 'element', 'verification'], function (exports) {
    var $ = layui.$
        , admin = layui.admin
        , view = layui.view
        , table = layui.table
        , common = layui.common
        , setter = layui.setter
        , form = layui.form
        , element = layui.element;

    form.verify({
        maxInputLength: [
            /^[\S]{2,50}$/
            , '必须2到50位，且不能出现空格'
        ]
    });

    //Init clients Table
    table.render({
        elem: '#client-table'
        , url: setter.apiAddress.client.list
        , id: "client-table"
        , cols: [[
            { field: 'clientName', title: '服务名称' },
            { field: 'clientId', title: '服务标识' },
            { field: 'clientUri', title: '服务地址' },
            { field: 'description', title: '服务描述' },
            {
                field: 'enabled', title: '是否启用',
                align: 'center',
                width: 100,
                templet: function (d) { return d.enabled == 1 ? '是' : '否' }
            },
            {
                width: 200, title: '操作', align: 'center'
                , templet: function (d) {
                    var htmlButton = new Array();
                    htmlButton.push('<div class="layui-btn-group">')
                    htmlButton.push('<a id="config" class="layui-btn layui-btn-warm layui-btn-xs" lay-event="config"><i class="layui-icon layui-icon-set"></i>配置</a>');
                    htmlButton.push('<a id="edit" class="layui-btn layui-btn-normal layui-btn-xs" lay-event="edit"><i class="layui-icon layui-icon-edit"></i>编辑</a>');
                    htmlButton.push('<a id="del" class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del"><i class="layui-icon layui-icon-delete"></i>删除</a>');
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

    // Services Configure Information
    var configure = {
        initSecretTab: function (clientId) {
            table.render({
                elem: '#secrets-table'
                , url: setter.apiAddress.client.secret + "?clientId=" + clientId
                , id: "secrets-table"
                , cols: [[
                    { field: 'description', title: '描述' },
                    { field: 'expiration', title: '到期时间' },
                    { field: 'value', title: '密码' },
                    { field: 'type', title: '类型' },
                    { title: '操作', width: 100, align: 'center', fixed: 'right', toolbar: '#table-secrets-btn' }
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
        initRedirectUrisTab: function (clientId) {
            table.render({
                elem: '#redirecturis-table'
                , url: setter.apiAddress.client.redirecturis + "?clientId=" + clientId
                , id: "redirecturis-table"
                , cols: [[
                    { field: 'redirectUri', title: '登录成功后转跳地址' },
                    { title: '操作', width: 100, align: 'center', fixed: 'right', toolbar: '#table-redirecturis-btn' }
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
        initLogoutRedirectUrisTab: function (clientId) {
            table.render({
                elem: '#logouturis-table'
                , url: setter.apiAddress.client.logouturis + "?clientId=" + clientId
                , id: "logouturis-table"
                , cols: [[
                    { field: 'postLogoutRedirectUri', title: '退出成功后转跳地址' },
                    { title: '操作', width: 100, align: 'center', fixed: 'right', toolbar: '#table-logouturis-btn' }
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
        initScopesTab: function (clientId) {
            table.render({
                elem: '#scopes-table'
                , url: setter.apiAddress.client.scopes + "?clientId=" + clientId
                , id: "scopes-table"
                , cols: [[
                    { field: 'scope', title: '客户端允许的请求范围' },
                    { title: '操作', width: 100, align: 'center', fixed: 'right', toolbar: '#table-scopes-btn' }
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
        initcCorsOriginsTab: function (clientId) {
            table.render({
                elem: '#corsorigins-table'
                , url: setter.apiAddress.client.corsorigins + "?clientId=" + clientId
                , id: "corsorigins-table"
                , cols: [[
                    { field: 'origin', title: '客户端跨域设置' },
                    { title: '操作', width: 100, align: 'center', fixed: 'right', toolbar: '#table-corsorigins-btn' }
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

    //服务（应用）信息编辑&删除
    table.on('tool(client-table)', function (obj) {
        var data = obj.data;
        if (obj.event === 'del') {
            layer.confirm('确定删除？', function (index) {
                common.ajax(setter.apiAddress.client.delete, "POST", "", { ClientId: data.id }, function (res) {
                    if (res.statusCode == 200) {
                        layui.table.reload('client-table');
                    }
                    layer.msg(res.message);
                });
            });
        } else if (obj.event === 'edit') {
            admin.popup({
                title: '编辑服务信息'
                , area: ['600px', '320px']
                , success: function (layero, index) {
                    view(this.id).render('settings/clients/edit', data).done(function () {
                        form.render(null, 'client-form');
                        form.on('submit(client-form-submit)', function (data) {
                            common.ajax(setter.apiAddress.client.update, "POST", "", $('#client-edit-form').serialize(), function (res) {
                                if (res.statusCode == 200) {
                                    layer.close(index);
                                    layui.table.reload('client-table');
                                }
                                layer.msg(res.message);
                            });
                        });
                    });
                }
            });
        } else if (obj.event === 'config') {
            admin.popup({
                title: '服务配置'
                , area: ['60%', '60%']
                , success: function (layero, index) {
                    view(this.id).render('settings/clients/configure', data).done(function () {
                        configure.initSecretTab(data.id);
                        element.on('tab(client-configure-tab)', function (tabdata) {
                            var index = tabdata.index;
                            switch (index) {
                                case 0:
                                    configure.initSecretTab(data.id);
                                    break;
                                case 1:
                                    configure.initRedirectUrisTab(data.id);
                                    break;
                                case 2:
                                    configure.initLogoutRedirectUrisTab(data.id);
                                    break;
                                case 3:
                                    configure.initScopesTab(data.id);
                                    break;
                                case 4:
                                    configure.initcCorsOriginsTab(data.id);
                                    break;
                            }
                        });
                        form.on('submit(secret-form-submit)', function (data) {
                            var field = data.field;
                            var submitdata = $('#secret-form').serialize();
                            common.ajax(setter.apiAddress.client.secretadd, "POST", "", submitdata, function (res) {
                                if (res.statusCode == 200) {
                                    layui.table.reload('secrets-table');
                                    common.resetform("apiresourcesecret-form");
                                }
                                layer.msg(res.message);
                            });
                        });
                        form.on('submit(redirecturi-form-submit)', function (data) {
                            var field = data.field;
                            var submitdata = $('#redirecturi-form').serialize();
                            common.ajax(setter.apiAddress.client.redirecturisadd, "POST", "", submitdata, function (res) {
                                if (res.statusCode == 200) {
                                    layui.table.reload('redirecturis-table');
                                    common.resetform("apiresourcesecret-form");
                                }
                                layer.msg(res.message);
                            });
                        });
                        form.on('submit(logouturis-form-submit)', function (data) {
                            var field = data.field;
                            var submitdata = $('#logouturis-form').serialize();
                            common.ajax(setter.apiAddress.client.logouturisadd, "POST", "", submitdata, function (res) {
                                if (res.statusCode == 200) {
                                    layui.table.reload('logouturis-table');
                                    common.resetform("apiresourcesecret-form");
                                }
                                layer.msg(res.message);
                            });
                        });
                        form.on('submit(scopes-form-submit)', function (data) {
                            var field = data.field;
                            var submitdata = $('#scopes-form').serialize();
                            common.ajax(setter.apiAddress.client.scopesadd, "POST", "", submitdata, function (res) {
                                if (res.statusCode == 200) {
                                    layui.table.reload('scopes-table');
                                    common.resetform("apiresourcesecret-form");
                                }
                                layer.msg(res.message);
                            });
                        });
                        form.on('submit(corsorigins-form-submit)', function (data) {
                            var field = data.field;
                            var submitdata = $('#corsorigins-form').serialize();
                            common.ajax(setter.apiAddress.client.corsoriginsadd, "POST", "", submitdata, function (res) {
                                if (res.statusCode == 200) {
                                    layui.table.reload('corsorigins-table');
                                    common.resetform("apiresourcesecret-form");
                                }
                                layer.msg(res.message);
                            });
                        });
                    });
                }
            });
        }
    });
    table.on('tool(secrets-table)', function (obj) {
        var data = obj.data;
        if (obj.event === 'del') {
            layer.confirm('确定删除？', function (index) {
                common.ajax(setter.apiAddress.client.secretdel, "POST", "", { Id: data.id }, function (res) {
                    if (res.statusCode == 200) {
                        layui.table.reload('secrets-table');
                    }
                    layer.msg(res.message);
                });
            });
        }
    });
    table.on('tool(redirecturis-table)', function (obj) {
        var data = obj.data;
        if (obj.event === 'del') {
            layer.confirm('确定删除？', function (index) {
                common.ajax(setter.apiAddress.client.redirecturisdel, "POST", "", { Id: data.id }, function (res) {
                    if (res.statusCode == 200) {
                        layui.table.reload('redirecturis-table');
                    }
                    layer.msg(res.message);
                });
            });
        }
    });
    table.on('tool(logouturis-table)', function (obj) {
        var data = obj.data;
        if (obj.event === 'del') {
            layer.confirm('确定删除？', function (index) {
                common.ajax(setter.apiAddress.client.logouturisdel, "POST", "", { Id: data.id }, function (res) {
                    if (res.statusCode == 200) {
                        layui.table.reload('logouturis-table');
                    }
                    layer.msg(res.message);
                });
            });
        }
    });
    table.on('tool(scopes-table)', function (obj) {
        var data = obj.data;
        if (obj.event === 'del') {
            layer.confirm('确定删除？', function (index) {
                common.ajax(setter.apiAddress.client.scopesdel, "POST", "", { Id: data.id }, function (res) {
                    if (res.statusCode == 200) {
                        layui.table.reload('scopes-table');
                    }
                    layer.msg(res.message);
                });
            });
        }
    });
    table.on('tool(corsorigins-table)', function (obj) {
        var data = obj.data;
        if (obj.event === 'del') {
            layer.confirm('确定删除？', function (index) {
                common.ajax(setter.apiAddress.client.corsoriginsdel, "POST", "", { Id: data.id }, function (res) {
                    if (res.statusCode == 200) {
                        layui.table.reload('corsorigins-table');
                    }
                    layer.msg(res.message);
                });
            });
        }
    });
    exports('clients', {})
});