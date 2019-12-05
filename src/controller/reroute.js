/**
 @Name：网关管理
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
        elem: '#reroute-table'
        , url: setter.apiAddress.reroute.list
        , cols: [[
            { field: 'serviceName', title: '服务发现名称' },
            { field: 'upstreamPathTemplate', title: '上游路径模板' },
            { field: 'downstreamPathTemplate', title: '下游路径模板' },
            { field: 'upstreamHttpMethod', title: '上游请求方法' },
            { field: 'downstreamScheme', title: '下游使用架构' },
            { field: 'loadBalancerOptions', title: '负载均衡配置' },
            {
                field: 'status', width: 100, title: '当前状态', align: 'center',
                templet: function (d) { return d.status == 1 ? '<span style="color:#009688;">启用</span>' : '<span style="color:#FF5722;">禁用</span>' }
            },
            {
                width: 100, title: '操作', align: 'center'
                , templet: function (d) {
                    var htmlButton = new Array();
                    htmlButton.push('<div class="layui-btn-group">')
                    htmlButton.push('<a class="layui-btn layui-btn-normal layui-btn-xs" lay-event="edit"><i class="layui-icon layui-icon-edit"></i>编辑</a>');
                    htmlButton.push('</div>')
                    return htmlButton.join('');
                }
            }
        ]]
        , page: false
        , height: 'full-320'
        , cellMinWidth: 80
        , text: '对不起，加载出现异常！'
        , response: {
            statusCode: 200
        }
        , parseData: function (res) {
            return {
                "code": res.statusCode,
                "msg": res.message,
                "data": res.data
            };
        }
    });

    ///初始化网关下拉框
    function initGateway(id, value) {
        common.ajax(setter.apiAddress.gateway.list, "Get", "", {}, function (res) {
            $("#" + id).append("<option value=\"\">请选择网关</option>");
            $.each(res.data, function (index, item) {
                if (item.id == value) {
                    $("#" + id).append("<option value=\"" + item.id + "\" selected=\"\">" + item.name + "</option>");
                } else {
                    $("#" + id).append("<option value=\"" + item.id + "\">" + item.name + "</option>");
                }
            });
            form.render("select");
        });
    }

    //编辑
    table.on('tool(reroute-table)', function (obj) {
        var data = obj.data;
        if (obj.event === 'edit') {
            admin.popup({
                title: '编辑'
                , area: ['800px', '800px']
                , resize: false
                , success: function (layero, index) {
                    view(this.id).render('settings/reroute/edit', data).done(function () {
                        initGateway("reroute-edit-sel", data.gatewayId);
                        form.render();
                        form.on('submit(reroute-edit-form-submit)', function (data) {
                            common.ajax(setter.apiAddress.reroute.update, "POST", "", $('#reroute-edit-form').serialize(), function (res) {
                                if (res.statusCode == 200) {
                                    layer.close(index);
                                    layui.table.reload('reroute-table');
                                }
                                layer.msg(res.message);
                            }, function (error) {
                                layer.msg(error.msg);
                            });
                        });
                    });
                }
            });
        }
    });
    exports('reroute', {})
});