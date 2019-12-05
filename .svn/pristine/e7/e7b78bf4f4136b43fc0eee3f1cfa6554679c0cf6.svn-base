/**
 @Name：项目中心-用户参与的课程及完成情况
 */
layui.define(['admin', 'table', 'element', 'common', 'setter', 'layer', 'form'], function (exports) {
    var $ = layui.$
        , admin = layui.admin
        , view = layui.view
        , layer = layui.layer
        , setter = layui.setter
        , table = layui.table
        , element = layui.element
        , form = layui.form
        , common = layui.common;

    //渲染所选用户信息列表
    table.render({
        elem: '#users-table'
        , url: setter.apiAddress.userprofile.list
        , cols: [[
            { field: 'realName', title: '姓名' },
            {
                field: 'orgId', title: '机构', templet: function (d) {
                    if (d.organizationDto == null) {
                        return "";
                    }
                    return d.organizationDto.name;
                }
            },
            {
                field: 'gradeName', title: '年级', templet: function (d) {
                    if (d.gradeClassDto == null) {
                        return "";
                    }
                    return d.gradeClassDto.gradeName;
                }
            },
            {
                field: 'classId', title: '班级', templet: function (d) {
                    if (d.gradeClassDto == null) {
                        return "";
                    }
                    return d.gradeClassDto.className;
                }
            },
            {
                field: 'gender', title: '性别', align: 'center'
            },
            { field: 'birthday', title: '出生日期', align: 'center' },
            {
                width: 120, title: '操作', align: 'center'
                , templet: function (d) {
                    var htmlButton = new Array();
                    htmlButton.push('<div class="layui-btn-group">')
                    htmlButton.push('<a class="layui-btn layui-btn-normal layui-btn-xs" lay-event="viewcourse"><i class="layui-icon layui-icon-edit"></i>课程信息</a>');
                    htmlButton.push('</div>')
                    return htmlButton.join('');
                }
            }
        ]]
        , page: true
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

    //监听用户列表事件
    table.on('tool(users-table)', function (obj) {
        var data = obj.data;
        if (obj.event === 'viewcourse') {
            location.hash = '/projectcenter/user/viewcourse/user=' + data.id + '/organization=' + data.orgId;
        }
    });

    exports('projectimplementuser', {})
});
