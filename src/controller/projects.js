/**
 @Name：项目管理
 */
layui.define(['table', 'form', 'common', 'element', 'setter', 'laydate'], function (exports) {
    var $ = layui.$
        , admin = layui.admin
        , view = layui.view
        , table = layui.table
        , common = layui.common
        , setter = layui.setter
        , laydate = layui.laydate
        , form = layui.form;

    table.render({
        elem: '#projects-table'
        , url: setter.apiAddress.projects.list
        , cols: [[
            { field: 'name', title: '项目名称' },
            { field: 'owner', title: '负责人' },
            {
                field: 'startTime', title: '开始时间', align: 'center', sort: true, templet: function (d) {
                    return common.formatDate(d.startTime, "yyyy-MM-dd")
                }
            },
            {
                field: 'endTime', title: '结束时间', align: 'center', sort: true, templet: function (d) {
                    return common.formatDate(d.endTime, "yyyy-MM-dd")
                }
            },
            {
                field: 'progressStatus', title: '进行状态', align: 'center', width: 100,
                templet: function (d) {
                    if (d.progressStatus == 0) {
                        return "<span style='color:#1E9FFF;'>未开始</span>";
                    } if (d.progressStatus == 1) {
                        return "<span style='color:#009688;'>进行中</span>";
                    } else {
                        return "<span style='color:#FFB800;'>已结束</span>";
                    }
                }
            },
            {
                field: 'status', title: '项目状态', align: 'center', width: 100,
                templet: function (d) {
                    return d.status == 1 ? '<span style="color:#009688;">启用</span>' : '<span style="color:#FF5722;">禁用</span>';
                }
            },
            {
                width: 200, title: '操作', align: 'center'
                , templet: function (d) {
                    var htmlButton = new Array();
                    htmlButton.push('<div class="layui-btn-group">')
                    htmlButton.push('<a class="layui-btn layui-btn-normal layui-btn-xs" lay-event="edit"><i class="layui-icon layui-icon-edit"></i>编辑</a>');
                    htmlButton.push('<a class="layui-btn layui-btn-normal layui-btn-xs" lay-event="couresconfig"><i class="layui-icon layui-icon-set-sm"></i>配置</a>');
                    if (d.status) {
                        htmlButton.push('<a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="changestatus"><i class="layui-icon layui-icon-close"></i>禁用</a>');
                    } else {
                        htmlButton.push('<a class="layui-btn layui-btn-warm layui-btn-xs" lay-event="changestatus"><i class="layui-icon layui-icon-ok"></i>启用</a>');
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

    //编辑&更新状态
    table.on('tool(projects-table)', function (obj) {
        var rowdata = obj.data;
        if (obj.event === 'changestatus') {
            var titletext = "确认禁用？";
            if (!rowdata.status) {
                titletext = "确认启用？";
            }
            layer.confirm(titletext, { icon: 3, title: '提示' }, function (index) {
                common.ajax(setter.apiAddress.projects.updatestatus, "POST", "", { id: rowdata.id }, function (res) {
                    if (res.statusCode == 200) {
                        layer.close(index);
                        table.reload('projects-table');
                    }
                    layer.msg(res.message);
                });
            });
        } else if (obj.event === 'edit') {
            admin.popup({
                title: '编辑'
                , area: ['600px', '600px']
                , resize: false
                , success: function (layero, index) {
                    view(this.id).render('projectcenter/projects/edit', rowdata).done(function () {
                        common.ajax(setter.apiAddress.organization.loadall, "Get", "", {}, function (res) {
                            common.select("orgId", res.data, rowdata.organizationId, 1);
                            form.render("select");
                        });
                        //表单初始赋值
                        form.val('project-edit-form', {
                            "ProgressStatus": rowdata.progressStatus
                        })
                        form.render();
                        $("input[name=status][value=false]").attr("checked", rowdata.status == 0 ? true : false);
                        $("input[name=status][value=true]").attr("checked", rowdata.status == 1 ? true : false);
                        laydate.render({
                            elem: '#starttime'
                            , type: 'date'
                        });
                        laydate.render({
                            elem: '#endtime'
                            , type: 'date'
                        });
                        form.verify({
                            datetime: function (value, item) {
                                if (value >= $("#endtime").val()) {
                                    return "开始时间不能大于等于结束时间";
                                }
                            }
                        });
                        form.render();
                        form.on('submit(projects-edit-form-submit)', function (data) {
                            common.ajax(setter.apiAddress.projects.update, "POST", "", data.field, function (res) {
                                if (res.statusCode == 200) {
                                    layer.close(index);
                                    table.reload('projects-table');
                                }
                                layer.msg(res.message);
                            });
                        });
                    });
                }
            });
        } else if (obj.event === 'couresconfig') {
            location.hash = '/projectcenter/projects/coursesetting/projectid=' + rowdata.id + '/orgid=' + rowdata.organizationId;
        }
    });

    exports('projects', {})
});