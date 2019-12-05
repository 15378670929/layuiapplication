/**
 @Name：模板管理
 */
layui.define(['table', 'form', 'common', 'setter', 'verification'], function (exports) {
    var $ = layui.$
        , admin = layui.admin
        , view = layui.view
        , table = layui.table
        , common = layui.common
        , setter = layui.setter
        , form = layui.form;

    table.render({
        elem: '#reporttemplate-table'
        , url: setter.apiAddress.reporttemplate.list
        , cols: [[
            { field: 'name', title: '模板名称' },
            {
                field: 'status', title: '状态', align: 'center', width: 150,
                templet: function (d) {
                    if (d.status === 0) {
                        return '<span style="color:#FF5722;">删除</span>'
                    }
                    if (d.status === 1) {
                        return '<span style="color:#009688;">新建</span>'
                    }
                    if (d.status === 2) {
                        return '<span style="color:#009688;">测试中</span>'
                    }
                    if (d.status === 3) {
                        return '<span style="color:#009688;">已发布</span>'
                    }
                }
            },
            {
                field: 'createTime', title: '创建时间', width: 150, sort: true, templet: function (d) {
                    return common.formatDate(d.createTime, "yyyy-MM-dd hh:mm")
                }
            },
            {
                title: '操作', align: 'center', width: 200
                , templet: function (d) {
                    var htmlButton = new Array();
                    htmlButton.push('<div class="layui-btn-group">')
                    htmlButton.push('<a class="layui-btn layui-btn-normal layui-btn-xs" lay-event="edit"><i class="layui-icon layui-icon-edit"></i>编辑</a>');
                    htmlButton.push('<a class="layui-btn layui-btn-normal layui-btn-xs" lay-event="preview"><i class="layui-icon layui-icon-menu-fill"></i>预览</a>');
                    if (d.status === 0) {
                        htmlButton.push('<a class="layui-btn layui-btn-disabled layui-btn-xs"><i class="layui-icon layui-icon-delete"></i>删除</a>');
                    } else {
                        htmlButton.push('<a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="updatestatus"><i class="layui-icon layui-icon-delete"></i>删除</a>');
                    }
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

    //编辑&预览&修改为删除状态
    table.on('tool(reporttemplate-table)', function (obj) {
        var data = obj.data;
        if (obj.event === 'edit') {
            admin.popup({
                title: '编辑'
                , area: ['60%', '70%']
                , resize: false
                , success: function (layero, index) {
                    view(this.id).render('report/reporttemplate/edit', data).done(function () {
                        $("select[name=Status]").val(data.status);
                        // 初始化模板类型下拉框
                        common.ajax(setter.apiAddress.templatetype.loadall, "GET", "", { pid: data.value }, function (res) {
                            $("#typeId").empty();
                            $("#typeId").append("<option value=\"\">请选择类型</option>");
                            $.each(res.data, function (index, item) {
                                if (item.id == data.typeId) {
                                    $("#typeId").append("<option value=\"" + item.id + "\" selected = \"selected\">" + item.name + "</option>");
                                } else {
                                    $("#typeId").append("<option value=\"" + item.id + "\">" + item.name + "</option>");
                                }
                            });
                            form.render("select");
                        });
                        form.render();
                        //提交
                        form.on('submit(reporttemplate-form-submit)', function (data) {
                            common.ajax(setter.apiAddress.reporttemplate.update, "POST", "", data.field, function (res) {
                                if (res.statusCode == 200) {
                                    layer.close(index);
                                    table.reload('reporttemplate-table');
                                }
                                layer.msg(res.message);
                            });
                        });
                    });
                }
            });
        } else if (obj.event === 'preview') {
            layer.open({
                type: 1,
                title: '预览',
                area: ['60%', '70%'],
                content: data.context
            });
        } else if (obj.event === 'updatestatus') {
            var titletext = "确认将[" + data.name + "]模板状态修改为删除吗";
            layer.confirm(titletext, { icon: 3, title: '提示' }, function (index) {
                common.ajax(setter.apiAddress.reporttemplate.updatestatus, "POST", "", { id: data.id }, function (res) {
                    if (res.statusCode == 200) {
                        layer.close(index);
                        table.reload('reporttemplate-table');
                    }
                    layer.msg(res.message);
                });
            });
        }
    });
    exports('reporttemplate', {})
});