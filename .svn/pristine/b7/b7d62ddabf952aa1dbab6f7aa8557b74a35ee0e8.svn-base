/**
 @Name：模板类型管理
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
        elem: '#templatetype-table'
        , url: setter.apiAddress.templatetype.list
        , cols: [[
            { field: 'name', title: '类型名称' }
            , { field: 'remark', title: '备注' }
            , {
                width: 200, title: '操作', align: 'center'
                , templet: function (d) {
                    var htmlButton = new Array();
                    htmlButton.push('<a class="layui-btn layui-btn-normal layui-btn-xs" lay-event="edit"><i class="layui-icon layui-icon-edit"></i>编辑</a>');
                    htmlButton.push('<a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del"><i class="layui-icon layui-icon-delete"></i>删除</a>');
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

    //编辑&删除
    table.on('tool(templatetype-table)', function (obj) {
        var data = obj.data;
        if (obj.event === 'edit') {
            admin.popup({
                title: '编辑'
                , area: ['30%', '35%']
                , resize: false
                , success: function (layero, index) {
                    view(this.id).render('report/templatetype/edit', data).done(function () {
                        form.render();
                        //提交
                        form.on('submit(templatetype-form-submit)', function (data) {
                            common.ajax(setter.apiAddress.templatetype.update, "POST", "", data.field, function (res) {
                                if (res.statusCode == 200) {
                                    layer.close(index);
                                    table.reload('templatetype-table');
                                }
                                layer.msg(res.message);
                            });
                        });
                    });
                }
            });
        } else if (obj.event === 'del') {
            var titletext = "确认删除" + data.name + "模板吗";
            layer.confirm(titletext, { icon: 3, title: '提示' }, function (index) {
                common.ajax(setter.apiAddress.templatetype.delete, "POST", "", { id: data.id }, function (res) {
                    if (res.statusCode == 200) {
                        layer.close(index);
                        table.reload('templatetype-table');
                    }
                    layer.msg(res.message);
                });
            });
        }
    });
    exports('templatetype', {})
});