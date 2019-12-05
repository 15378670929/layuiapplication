/**
 @Name：报告中心-测评报告-预览下载测评报告
 */
layui.define(['table', 'form', 'common', 'setter', 'laydate', 'verification'], function (exports) {
    var $ = layui.$,
        admin = layui.admin,
        view = layui.view,
        table = layui.table,
        common = layui.common,
        setter = layui.setter,
        laydate = layui.laydate,
        verification = layui.verification,
        form = layui.form;

    //获取机构
    common.ajax(setter.apiAddress.organization.loadall, "Get", "", {}, function (res) {
        $("#organization").append("<option value=\"\">请选择机构</option>");
        $.each(res.data, function (index, item) {
            $("#organization").append("<option value=\"" + item.id + "\">" + item.name + "</option>");
        });
        form.render("select");
    });

    //搜索
    form.on('submit(projects-search)', function (data) {
        table.reload('projects-table', {
            where: { organizationId: $("#organization").val() },
            page: {
                curr: 1
            }
        });
    });

    //初始化项目列表
    table.render({
        elem: '#projects-table'
        , url: setter.apiAddress.projects.list
        , cols: [[
            { field: 'name', title: '项目名称' },
            {
                field: 'startTime', title: '开始时间', align: 'center', width: 150, sort: true, templet: function (d) {
                    return common.formatDate(d.startTime, "yyyy-MM-dd")
                }
            },
            {
                field: 'endTime', title: '结束时间', align: 'center', width: 150, sort: true, templet: function (d) {
                    return common.formatDate(d.endTime, "yyyy-MM-dd")
                }
            },
            {
                field: 'progressStatus', title: '进行状态', align: 'center', width: 100,
                templet: function (d) { if (d.progressStatus == 0) { return "<span style='color:#1E9FFF;'>未开始</span>"; } if (d.progressStatus == 1) { return "<span style='color:#009688;'>进行中</span>"; } else { return "<span style='color:#FFB800;'>已结束</span>"; } }
            },
            {
                field: 'status', title: '项目状态', align: 'center', width: 100,
                templet: function (d) { return d.status == 1 ? '<span style="color:#009688;">启用</span>' : '<span style="color:#FF5722;">禁用</span>'; }
            },
            {
                title: '操作', align: 'center', width: 120
                , templet: function (d) {
                    var htmlButton = new Array();
                    htmlButton.push('<div class="layui-btn-group">')
                    htmlButton.push('<a class="layui-btn layui-btn-normal layui-btn-xs" lay-event="course"><i class="layui-icon layui-icon-align-center"></i>课程信息</a>');
                    htmlButton.push('</div>')
                    return htmlButton.join('');
                }
            }
        ]]
        , page: true
        , cellMinWidth: 80
        , text: {
            none: '暂无相关数据'
        }
        , response: {
            statusCode: 200
        }
        , height: 'full-320'
        , parseData: function (res) {
            return {
                "code": res.statusCode,
                "msg": res.message,
                "count": res.data.totalCount,
                "data": res.data.items
            };
        }
    });

    //进入项目的课程信息展示页面
    table.on('tool(projects-table)', function (obj) {
        var rowdata = obj.data;
        if (obj.event === 'course') {
            location.hash = '/report/viewreports/projectcourses/organization=' + rowdata.organizationId + '/project=' + rowdata.id;
        }
    });

    exports('viewreports', {})
});
