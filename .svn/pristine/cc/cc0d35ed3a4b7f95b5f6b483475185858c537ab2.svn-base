/**
 @Name：身份资源管理
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
        elem: '#identityresource-table'
        , url: setter.apiAddress.identityresource.list
        , cols: [[
            { field: 'name', title: '身份资源名称', width: 150 },
            { field: 'displayName', title: '显示名称', width: 150 },
            {
                field: 'showInDiscoveryDocument', title: '显示在接口文档', align: 'center', width: 150,
                templet: function (d) { return d.showInDiscoveryDocument == 1 ? '是' : '否' }
            },
            {
                field: 'required', width: 150, title: '是否必须', align: 'center',
                templet: function (d) { return d.required == 1 ? '是' : '否' }
            },
            {
                field: 'enabled', title: '是否可用', align: 'center', width: 150,
                templet: function (d) { return d.enabled == 1 ? '是' : '否' }
            },
            { field: 'description', title: '描述' },
            { title: '操作', width: 150, align: 'center', fixed: 'right', toolbar: '#table-identityresource-btn' }
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
        //, beforeSend: function (xhr) {
        //    xhr.setRequestHeader('Authorization Bearer ', "token1111111111111111111111111");
        //}
    });

    //编辑&删除
    table.on('tool(identityresource-table)', function (obj) {
        var data = obj.data;
        if (obj.event === 'claims') {
            admin.popup({
                title: '查看身份资源Claims'
                , area: ['800px', '300px']
                , resize: false
                , success: function (layero, index) {
                    view(this.id).render('settings/identityresource/claims', data).done(function () {
                        table.render({
                            elem: '#identityresource-claims-table'
                            , url: setter.apiAddress.identityresource.claims + "?identityResourceId=" + data.id
                            , cols: [[
                                { field: 'type', title: '声明类型' },
                            ]]
                            , page: false
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
                            //, beforeSend: function (xhr) {
                            //    xhr.setRequestHeader('Authorization Bearer ', "token1111111111111111111111111");
                            //}
                        });
                    });
                }
            });
        }
    });
    exports('identityresource', {})
});