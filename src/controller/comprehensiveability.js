﻿/**
 @Name：综合能力类型
 */
layui.define(['table', 'form', 'common', 'treeSelect', 'setter', 'laydate', 'verification'], function (exports) {
    var $ = layui.$
        , admin = layui.admin
        , view = layui.view
        , table = layui.table
        , common = layui.common
        , setter = layui.setter
        , treeSelect = layui.treeSelect
        , verification = layui.verification
        , form = layui.form;

    table.render({
        elem: '#comprehensiveability-table'
        , url: setter.apiAddress.comprehensiveability.pagelist
        , cols: [[
            { field: 'name', title: '名称' },
            {
                field: 'isEnable', title: '是否可用', align: 'center', width: 150,
                templet: function (d) { return d.isEnable == 1 ? '<span>是</span>' : '<span>否</span>'; }
            },
            { field: 'displayOrder', title: '显示顺序', align: 'center', width: 150 },
            {
                field: 'createTime', width: 150, title: '创建时间', align: 'center', templet: function (d) {
                    return common.formatDate(d.createTime, "yyyy-MM-dd hh:mm")
                }
            },
            {
                width: 150, title: '操作', align: 'center'
                , templet: function (d) {
                    var htmlButton = new Array();
                    htmlButton.push('<div class="layui-btn-group">')
                    htmlButton.push('<a class="layui-btn layui-btn-normal layui-btn-xs" lay-event="edit"><i class="layui-icon layui-icon-edit"></i>编辑</a>');
                    htmlButton.push('<a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del"><i class="layui-icon layui-icon-delete"></i>删除</a>');
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

    table.on('tool(comprehensiveability-table)', function (obj) {
        var data = obj.data;
        if (obj.event === 'del') {
            layer.confirm('确定删除？', function (index) {
                common.ajax(setter.apiAddress.comprehensiveability.delete, "POST", "", { Id: data.id }, function (res) {
                    if (res.statusCode == 200) {
                        layer.close(index);
                        table.reload('comprehensiveability-table');
                    }
                    layer.msg(res.message);
                });
            });
        } else if (obj.event === 'edit') {
            admin.popup({
                title: '修改'
                , area: ['30%', '35%']
                , resize: false
                , success: function (layero, index) {
                    view(this.id).render('report/comprehensiveability/edit', data).done(function () {
                        $("input[name=IsEnable][value=true]").attr("checked", data.isEnable === true);
                        $("input[name=IsEnable][value=false]").attr("checked", data.isEnable === false);
                        form.render();
                        form.on('submit(comprehensiveability-edit-form-submit)', function (data) {
                            common.ajax(setter.apiAddress.comprehensiveability.update, "POST", "", data.field, function (res) {
                                if (res.statusCode == 200) {
                                    layer.close(index);
                                    table.reload('comprehensiveability-table');
                                }
                                layer.msg(res.message);
                            });
                        });
                    });
                }
            });
        }
    });

    exports('comprehensiveability', {})
});