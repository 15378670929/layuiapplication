/**
 @Name：报告中心-测评报告-个人报告预览及下载
 */
layui.define(['table', 'form', 'common', 'setter', 'laydate', 'verification'], function (exports) {
    var $ = layui.$
        , admin = layui.admin
        , view = layui.view
        , table = layui.table
        , common = layui.common
        , setter = layui.setter
        , laydate = layui.laydate
        , verification = layui.verification
        , form = layui.form;

    table.render({
        elem: '#user-table'
        , url: setter.apiAddress.projectcourseuser.list
        , cols: [[
            { field: 'userName', title: '姓名', width: 150 },
            { field: 'organizationName', title: '机构' },
            { field: 'gradeName', title: '年级', align: 'center', width: 100 },
            { field: 'className', title: '班级', align: 'center', width: 100 },
            { field: 'gender', title: '性别', align: 'center', width: 100 },
            { field: 'birthday', title: '出生日期', align: 'center', width: 150 },
            {
                field: 'isFinished', title: '课时完成状态', align: 'center', width: 150,
                templet: function (d) { return d.isFinished ? '<span style="color:#009688;">已完成</span>' : '<span style="color:#FF5722;">未完成</span>'; }
            },
            {
                width: 200,
                title: '操作',
                align: 'center',
                templet: function (d) {
                    var reportUrl = d.reportUrl;
                    var htmlButton = new Array();
                    htmlButton.push('<div class="layui-btn-group">')
                    htmlButton.push('<a class="layui-btn layui-btn-normal layui-btn-xs" lay-event="viewreport"><i class="layui-icon layui-icon-template-1"></i>报告预览</a>');
                    htmlButton.push('<a class="layui-btn layui-btn-normal layui-btn-xs" lay-event="downloadreport"><i class="layui-icon layui-icon-download-circle"></i>报告下载</a>');
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
        , where: {
            organizationId: layui.router().search.organization,
            projectId: layui.router().search.project,
            courseId: layui.router().search.course,
            courseChildId: layui.router().search.courseChild
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

    //user reports
    table.on('tool(user-table)', function (obj) {
        var rowdata = obj.data;
        if (obj.event === 'viewreport') {
            common.ajax(setter.apiAddress.courseresultreport.preview, "GET", "", { organizationId: rowdata.organizationId, classId: rowdata.classesId, projectId: rowdata.projectId, courseId: rowdata.courseId, courseChildId: rowdata.courseChildId, userId: rowdata.userId }, function (res) {
                if (res.statusCode === 200) {
                    var data = res.data;
                    if (data !== null && data.htmlReportUrl !== "" && data.htmlReportUrl !== undefined && data.htmlReportUrl !== null) {
                        window.open(data.htmlReportUrl);
                    }
                }
                else {
                    layer.msg("报告尚未生成");
                }
            });
        } else if (obj.event === 'downloadreport') {
            common.ajax(setter.apiAddress.courseresultreport.preview, "GET", "", { organizationId: rowdata.organizationId, classId: rowdata.classesId, projectId: rowdata.projectId, courseId: rowdata.courseId, courseChildId: rowdata.courseChildId, userId: rowdata.userId }, function (res) {
                if (res.statusCode === 200) {
                    var data = res.data;
                    if (data !== null && data.pdfReportUrl !== "" && data.pdfReportUrl !== undefined && data.pdfReportUrl !== null) {
                        $("<a target='_blank'></a>").attr("href", data.pdfReportUrl)[0].click();
                    }
                }
                else {
                    layer.msg("报告尚未生成");
                }
            });
        }
    });

    exports('personalreport', {})
});