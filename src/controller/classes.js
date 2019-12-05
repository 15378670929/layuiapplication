/**
 @Name：班级管理
 */
layui.define(['table', 'form', 'common', 'setter', 'laydate', 'verification'], function (exports) {
    var $ = layui.$
        , admin = layui.admin
        , view = layui.view
        , table = layui.table
        , common = layui.common
        , setter = layui.setter
        , laydate = layui.laydate
        , form = layui.form;

    table.render({
        elem: '#classes-table'
        , url: setter.apiAddress.classes.pagelist
        , cols: [[
            {
                field: 'name', title: '机构名称', templet: function (d) {
                    if (d.organizationDto == null) { return ""; } else { return d.organizationDto.name }
                }
            },
            { field: 'gradeName', title: '年级名称' },
            { field: 'className', title: '班级名称' },
            { field: 'teacher', title: '负责老师' },
            { field: 'phone', title: '联系电话' },
            {
                field: 'startSchoolYear', title: '入学年份', align: 'center', templet: function (d) {
                    return common.formatDate(d.startSchoolYear, "yyyy")
                }
            },
            {
                field: 'classesType', title: '班级类型', align: 'center', templet: function (d) {
                    return d.classesType == 1 ? "<span style='color:#1E9FFF;'>行政班</span>" : "<span style='color:#FF5722;'>教学班</span>"
                }
            },
            {
                field: 'createTime', width: 150, title: '创建时间', align: 'center', templet: function (d) {
                    return common.formatDate(d.createTime, "yyyy-MM-dd hh:mm")
                }
            },
            { title: '操作', width: 100, align: 'center', fixed: 'right', toolbar: '#table-operation-btn' }
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
    $("#cityId").append("<option value=\"\">请选择城市</option>");
    $("#districtId").append("<option value=\"\">请选择地区</option>");

    //获取省份
    common.ajax(setter.apiAddress.region.loadchilds, "GET", "", { parentId: 1 }, function (res) {
        $("#provinceId").append("<option value=\"\">请选择省份</option>");
        $.each(res.data, function (index, item) {
            $("#provinceId").append("<option value=\"" + item.id + "\">" + item.name + "</option>");
        });
        form.render("select");
    });
    //获取城市
    form.on('select(provincefilter)', function (data) {
        $("#cityId").empty();
        $("#districtId").empty();
        common.ajax(setter.apiAddress.region.loadchilds, "GET", "", { parentId: data.value }, function (res) {
            $("#cityId").append("<option value=\"\">请选择城市</option>");
            $("#districtId").append("<option value=\"\">请选择地区</option>");
            $.each(res.data, function (index, item) {
                $("#cityId").append("<option value=\"" + item.id + "\">" + item.name + "</option>");
            });
            form.render("select");
        })
    });
    //获取地区
    form.on('select(cityfilter)', function (data) {
        $("#districtId").empty();
        common.ajax(setter.apiAddress.region.loadchilds, "GET", "", { parentId: data.value }, function (res) {
            $("#districtId").append("<option value=\"\">请选择地区</option>");
            $.each(res.data, function (index, item) {
                $("#districtId").append("<option value=\"" + item.id + "\">" + item.name + "</option>");
            });
            form.render("select");
        })
    });

    //选择机构
    form.on('select(orgfilter)', function (data) {
        if ($("#organization").find("option:selected").text() == "请选择") {
            $("#organizationName").attr('placeholder', $("#organization").find("option:selected").text());
            return false;
        }
        $("#organizationName").val($("#organization").find("option:selected").text());
        $("#organization").next().find("dl").css({ "display": "none" });
        form.render("select");
    });

    //编辑&删除
    table.on('tool(classes-table)', function (obj) {
        var data = obj.data;
        if (obj.event === 'del') {
            layer.confirm('确定删除？', function (index) {
                common.ajax(setter.apiAddress.classes.delete, "POST", "", { Id: data.id }, function (res) {
                    if (res.statusCode == 200) {
                        layer.close(index);
                        layui.table.reload('classes-table');
                    }
                    layer.msg(res.message);
                });
            });
        } else if (obj.event === 'edit') {
            admin.popup({
                title: '编辑班级信息'
                , area: ['480px', '60%']
                , resize: false
                , success: function (layero, index) {
                    view(this.id).render('usercenter/classes/edit', data).done(function () {
                        form.render(null, 'classes-form');
                        //获取选中项
                        common.ajax(setter.apiAddress.organization.loadall, "Get", "", {}, function (res) {
                            common.select("orgId", res.data, data.orgId, 1);
                            form.render("select");
                        });
                        //表单初始赋值
                        form.val('classes-edit-form', {
                            "ClassesType": data.classesType
                        })
                        form.render();
                        laydate.render({
                            elem: '#startschoolyear'
                            , type: 'year'
                        });
                        //监听提交
                        form.on('submit(classes-form-submit)', function (data) {
                            common.ajax(setter.apiAddress.classes.update, "POST", "", data.field, function (res) {
                                if (res.statusCode == 200) {
                                    layer.close(index);
                                    table.reload('classes-table');
                                }
                                layer.msg(res.message);
                            });
                        });
                    });
                }
            });
        }
    });
    exports('classes', {})
});