/**
 @Name：用户报告管理
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

    table.render({
        elem: '#userreport-table',
        url: setter.apiAddress.courseresult.pagelist,
        cols: [
            [{
                field: 'userName',
                title: '姓名'
            },
            {
                field: 'organizationName',
                title: '机构'
            },
            {
                field: 'greadClassName',
                title: '班级'
            },
            {
                field: 'projectName',
                title: '项目'
            },
            {
                field: 'courseName',
                title: '课程'
            },
            {
                field: 'courseChildName',
                title: '课时'
            },
            {
                field: 'startTime',
                title: '开始时间'
            },
            {
                field: 'endTime',
                title: '完成时间'
            },
            {
                width: 200,
                title: '操作',
                align: 'center',
                templet: function (d) {
                    var reportUrl = d.reportUrl;
                    var htmlButton = new Array();
                    htmlButton.push('<div class="layui-btn-group">')
                    if (null == reportUrl || 0 == reportUrl.trim().length) {
                        htmlButton.push(
                            '<a class="layui-btn layui-btn-warm layui-btn-xs" lay-event="generate"><i class="layui-icon layui-icon-survey"></i>立即生成报告</a>'
                        );
                    } else {
                        htmlButton.push(
                            '<a class="layui-btn layui-btn-normal layui-btn-xs" lay-event="preview"><i class="layui-icon layui-icon-vercode"></i>报告预览</a>'
                        );
                        htmlButton.push(
                            '<a class="layui-btn layui-btn-normal layui-btn-xs" lay-event="download"><i class="layui-icon layui-icon-download-circle"></i>报告下载</a>'
                        );
                    }
                    htmlButton.push('</div>')
                    return htmlButton.join('');
                }
            }]
        ],
        page: true,
        height: 'full-320',
        cellMinWidth: 80,
        text: {
            none: '暂无相关数据'
        },
        response: {
            statusCode: 200
        },
        parseData: function (res) {
            return {
                "code": res.statusCode,
                "msg": res.message,
                "count": res.data.totalCount,
                "data": res.data.items
            };
        }
    });

    table.on('tool(userreport-table)', function (obj) {
        var data = obj.data;
        if (obj.event === 'preview') {
            layer.open({
                type: 2,
                area: ['800px', '600px'],
                content: data.reportUrl //这里content是一个URL，如果你不想让iframe出现滚动条，你还可以content: ['http://sentsin.com', 'no']
            });
        } else if (obj.event === 'download') {
            window.open(data.reportUrl);
        } else if (obj.event === 'generate') {
            common.ajax(setter.apiAddress.courseresult.generateReport + data.id, 'POST', "", {}, function (data, textStatus,
                jqXhr) {
                if (jqXhr.status == 202) {
                    layer.open({
                        title: '报告生成提示',
                        content: '报告正在启动生成流程，请于两分钟后刷新页面获取!'
                    });
                }
            })
        }
    });
    exports('userreport', {})
});
