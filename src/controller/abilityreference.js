/**
 @Name：能力等级参考管理
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
        elem: '#abilityreference-table'
        , url: setter.apiAddress.abilityreference.pagelist
        , cols: [[
            { field: 'abilityName', title: '能力', width: 150, },
            { field: 'description', title: '描述' },
            {
                field: 'descriptionType',
                title: '描述类型', width: 100,
                align: 'center',
                templet: function (d) {
                    switch (d.descriptionType) {
                        case 1:
                            return '<span style="color:#009688;">能力概况</span>';
                            break;
                        case 2:
                            return '<span style="color:#FF5722;">发展建议</span>';
                            break;
                        default:
                            return '-';
                            break;
                    }
                }
            },
            {
                field: 'abilityReferenceType',
                title: '描述分类', width: 100,
                align: 'center',
                templet: function (d) {
                    switch (d.abilityReferenceType) {
                        case 1:
                            return '<span style="color:#009688;">普通能力</span>';
                            break;
                        case 2:
                            return '<span style="color:#FF5722;">综合能力</span>';
                            break;
                        default:
                            return '-';
                            break;
                    }
                }
            },
            { field: 'abilityCode', title: '编码', width: 100, align: 'center' },
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

    table.on('tool(abilityreference-table)', function (obj) {
        var data = obj.data;
        if (obj.event === 'del') {
            layer.confirm('确定删除？', function (index) {
                common.ajax(setter.apiAddress.abilityreference.delete, "POST", "", { Id: data.id }, function (res) {
                    if (res.statusCode == 200) {
                        layer.close(index);
                        table.reload('abilityreference-table');
                    }
                    layer.msg(res.message);
                });
            });
        } else if (obj.event === 'edit') {
            if (data.abilityReferenceType === 1) {
                // 一般能力编辑
                admin.popup({
                    title: '一般能力编辑'
                    , area: ['45%', '58%']
                    , resize: false
                    , success: function (layero, index) {
                        view(this.id).render('report/abilityreference/ordinaryedit', data).done(function () {
                            initTree(data.abilityId)
                            common.ajax(setter.apiAddress.abilityclass.loadall, "GET", "", { comprehensiveAbilityId: data.value }, function (res) {
                                if (res.statusCode == 200) {
                                    // 对结果进行处理
                                    res.data.map(item => {
                                        if (item.dataIdentification === 1) {
                                            item.dataIdentification = '基础能力'
                                        } else {
                                            item.dataIdentification = '学科能力'
                                        }
                                        return item
                                    })
                                    var items = res.data.reduce((prev, next) => {
                                        var obj = {}
                                        obj.id = next.id
                                        obj.name = next.abilityName + '(' + next.dataIdentification + ')'
                                        prev.push(obj)
                                        return prev
                                    }, [])
                                    $("#ordinaryAbilityId").empty();
                                    $("#ordinaryAbilityId").append("<option value=\"\">请选择能力分级</option>");
                                    $.each(items, function (index, item) {
                                        if (item.id == data.ordinaryAbilityId) {
                                            $("#ordinaryAbilityId").append("<option value=\"" + item.id + "\" selected = \"selected\">" + item.name + "</option>");
                                        } else {
                                            $("#ordinaryAbilityId").append("<option value=\"" + item.id + "\">" + item.name + "</option>");
                                        }
                                    });
                                    form.render("select");
                                }
                            }, function (error) {
                                layer.msg(error.msg);
                            });
                            $("select[name=DescriptionType]").val(data.descriptionType);
                            $("select[name=AbilityReferenceType]").val(data.abilityReferenceType);
                            form.render('select');
                            form.on('submit(abilityreference-edit-form-submit)', function (obj) {
                                obj.field.AbilityName = data.abilityName
                                common.ajax(setter.apiAddress.abilityreference.edit, "POST", "", obj.field, function (res) {
                                    if (res.statusCode == 200) {
                                        layer.close(index);
                                        table.reload('abilityreference-table');
                                    }
                                    layer.msg(res.message);
                                });
                            });
                        });
                    }
                });
            } else {
                // 综合能力编辑
                admin.popup({
                    title: '综合能力编辑'
                    , area: ['45%', '58%']
                    , resize: false
                    , success: function (layero, index) {
                        view(this.id).render('report/abilityreference/comprehensiveedit', data).done(function () {
                            // 初始化能力分级下拉列表
                            common.ajax(setter.apiAddress.comprehensiveability.loadall, "GET", "", { comprehensiveAbilityId: data.value }, function (res) {
                                if (res.statusCode == 200) {
                                    $("#comprehensiveAbilityId").empty();
                                    $("#comprehensiveAbilityId").append("<option value=\"\">请选择能力分级</option>");
                                    $.each(res.data, function (index, item) {
                                        if (item.id == data.comprehensiveAbilityId) {
                                            $("#comprehensiveAbilityId").append("<option value=\"" + item.id + "\" selected = \"selected\">" + item.name + "</option>");
                                        } else {
                                            $("#comprehensiveAbilityId").append("<option value=\"" + item.id + "\">" + item.name + "</option>");
                                        }
                                    });
                                    form.render("select");
                                }
                            }, function (error) {
                                layer.msg(error.msg);
                            });
                            $("select[name=DescriptionType]").val(data.descriptionType);
                            $("select[name=AbilityReferenceType]").val(data.abilityReferenceType);
                            form.render('');
                            form.on('submit(abilityreference-edit)', function (obj) {
                                obj.field.AbilityName = data.abilityName
                                common.ajax(setter.apiAddress.abilityreference.edit, "POST", "", obj.field, function (res) {
                                    if (res.statusCode == 200) {
                                        layer.close(index);
                                        table.reload('abilityreference-table');
                                    }
                                    layer.msg(res.message);
                                });
                            });
                        });
                    }
                });
            }
        }
    });

    function initTree(nodeId) {
        treeSelect.render({
            elem: '#ability-tree',
            url: setter.apiAddress.ability.seltree,
            type: 'get',
            placeholder: '请选择',
            style: {
                folder: {
                    enable: true
                },
                line: {
                    enable: true
                }
            },
            search: true,
            click: function (data) {
                $("#abilityId").val(data.current.id);
                $("#ability-tree").val(data.current.name);
            },
            success: function (data) {
                treeObj = treeSelect.zTree('ability-tree');
                var defaultNode = { id: "00000000-0000-0000-0000-000000000000", name: "添加能力维度" };
                treeObj.addNodes(null, 0, defaultNode);
                if (nodeId != "") {
                    var node = treeObj.getNodeByParam('id', nodeId);
                    treeObj.selectNode(node, true);
                    treeObj.checkNode(node, true, true);
                    $(".layui-treeSelect .layui-unselect").val(node.name);
                }

            }
        });
    }

    exports('abilityreference', {})
});