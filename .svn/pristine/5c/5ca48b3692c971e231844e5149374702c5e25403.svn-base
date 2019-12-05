/**
 @Name：综合能力分级
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
        elem: '#comprehensiveabilityclass-table'
        , url: setter.apiAddress.comprehensiveabilityclass.pagelist
        , cols: [[
            {
                field: 'comprehensiveAbilityId', title: '综合能力类型'
                , templet: function (d) {
                    return '<span>' + d.comprehensiveAbilityDto.name + '</span>'
                }
            },
            { field: 'criteria', title: '划分标准', align: 'center' },
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

    table.on('tool(comprehensiveabilityclass-table)', function (obj) {
        var data = obj.data;
        if (obj.event === 'edit') {
            admin.popup({
                title: '修改'
                , area: ['30%', '40%']
                , resize: false
                , success: function (layero, index) {
                    view(this.id).render('report/comprehensiveabilityclass/edit', data).done(function () {
                        $("select[name=DataIdentification]").val(data.dataIdentification);
                        form.render();
                        // 初始化综合能力类型下拉框
                        common.ajax(setter.apiAddress.comprehensiveability.loadall, "GET", "", { pid: data.value }, function (res) {
                            $("#comprehensiveAbilityId").empty();
                            $("#comprehensiveAbilityId").append("<option value=\"\">请选择综合能力类型</option>");
                            $.each(res.data, function (index, item) {
                                if (item.id == data.comprehensiveAbilityId) {
                                    $("#comprehensiveAbilityId").append("<option value=\"" + item.id + "\" selected = \"selected\">" + item.name + "</option>");
                                } else {
                                    $("#comprehensiveAbilityId").append("<option value=\"" + item.id + "\">" + item.name + "</option>");
                                }
                            });
                            form.render("select");
                        });
                        form.on('submit(comprehensiveabilityclass-edit-form-submit)', function (data) {
                            common.ajax(setter.apiAddress.comprehensiveabilityclass.update, "POST", "", data.field, function (res) {
                                if (res.statusCode == 200) {
                                    layer.close(index);
                                    table.reload('comprehensiveabilityclass-table');
                                }
                                layer.msg(res.message);
                            });
                        });
                    });
                }
            });
        }
    });

    exports('comprehensiveabilityclass', {})
});