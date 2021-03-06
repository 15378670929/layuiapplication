﻿/**
 @Name：测评游戏管理
 */
layui.define(['table', 'form', 'common', 'setter', 'upload', 'element', 'verification'], function (exports) {
    var $ = layui.$
        , admin = layui.admin
        , view = layui.view
        , table = layui.table
        , common = layui.common
        , setter = layui.setter
        , element = layui.element
        , upload = layui.upload
        , form = layui.form;
    //渲染列表
    table.render({
        elem: '#evaluationgame-table'
        , url: setter.apiAddress.evaluationgame.list
        , cols: [[
            { field: 'name', title: '游戏名称' },
            { field: 'exerciseCalculateCode', title: '算分码' },
            { field: 'abilityType', title: '能力类型' },
            { field: 'firstAbility', title: '一级能力' },
            { field: 'secondAbility', title: '二级能力' },
            { field: 'agegroup', title: '年龄段(岁)', align: 'center', width: 120, templet: function (d) { return d.minAge + '-' + d.maxAge; } },
            { field: 'normCount', title: '常模数', align: 'center', width: 100 },
            {
                field: 'status', title: '状态', align: 'center', width: 100, templet: function (d) {
                    return d.status == 1 ? '<span style="color:#009688;">上架</span>' : '<span style="color:#FF5722;">下架</span>';
                }
            },
            {
                width: 230, title: '操作', align: 'center'
                , templet: function (d) {
                    var htmlButton = new Array();
                    htmlButton.push('<div class="layui-btn-group">')
                    htmlButton.push('<a class="layui-btn layui-btn-normal layui-btn-xs" lay-event="edit"><i class="layui-icon layui-icon-edit"></i>编辑</a>');
                    htmlButton.push('<a class="layui-btn layui-btn-normal layui-btn-xs" lay-event="import"><i class="layui-icon layui-icon-set"></i>常模</a>');
                    htmlButton.push('<a class="layui-btn layui-btn-normal layui-btn-xs" lay-event="preview"><i class="layui-icon layui-icon-set"></i>预览</a>');
                    if (d.status) {
                        htmlButton.push('<a class="layui-btn  layui-btn-danger layui-btn-xs" lay-event="changestatus"><i class="layui-icon layui-icon-delete"></i>下架</a>');
                    } else {
                        htmlButton.push('<a class="layui-btn layui-btn-warm layui-btn-xs" lay-event="changestatus"><i class="layui-icon layui-icon-ok"></i>上架</a>');
                    }
                    htmlButton.push('</div>');
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
    
    $("#fad").append("<option value=\"\">请选择一级能力</option>");
    $("#sad").append("<option value=\"\">请选择二级能力</option>");
    //获取顶级能力
    common.ajax(setter.apiAddress.ability.selname, "GET", "", { level: 0 }, function (res) {
        $("#atp").append("<option value=\"\">请选择能力类型</option>");
        $.each(res.data, function (index, item) {
            $("#atp").append("<option value=\"" + item.id + "\">" + item.name + "</option>");
        });
        form.render("select");
    });
    //获取一级能力
    form.on('select(topfilter)', function (data) {
        $("#fad").empty();
        $("#sad").empty();
        if (data.value != "") {
            common.ajax(setter.apiAddress.ability.selname, "GET", "", { pid: data.value }, function (res) {
                $("#fad").append("<option value=\"\">请选择一级能力</option>");
                $("#sad").append("<option value=\"\">请选择二级能力</option>");
                $.each(res.data, function (index, item) {
                    $("#fad").append("<option value=\"" + item.id + "\">" + item.name + "</option>");
                });
                form.render("select");
            });
        } else {
            common.select("fad", [{ id: "", name: "" }], 1, 1);
            common.select("sad", [{ id: "", name: "" }], 1, 1);
            form.render("select");
        }
    });
    //获取二级能力
    form.on('select(firstfilter)', function (data) {
        $("#sad").empty();
        if (data.value != "") {
            common.ajax(setter.apiAddress.ability.selname, "GET", "", { pid: data.value }, function (res) {
                $("#sad").append("<option value=\"\">请选择二级能力</option>");
                $.each(res.data, function (index, item) {
                    $("#sad").append("<option value=\"" + item.id + "\">" + item.name + "</option>");
                });
                form.render("select");
            });
        } else {
            common.select("sad", [{ id: "", name: "" }], 1, 1);
            form.render("select");
        }
    });
    //搜索
    form.on('submit(evaluationgame-search)', function (data) {
        //执行重载
        table.reload('evaluationgame-table', {
            where: {
                abilityTypeId: $("#atp").val(),
                firstAbilityId: $("#fad").val(),
                secondAbilityId: $("#sad").val()
            },
            page: {
                curr: 1 //重新从第 1 页开始
            }
        });
    });
    //普通图片上传
    function uploadInst(id, showicon, icon, filepath) {
        upload.render({
            elem: '#' + id
            , url: setter.apiAddress.image.imageupload+"?filePath="+filepath
            , field: "imgFile"
            , accept: 'file'
            , size: 2048
            , data: {filePath: filepath}
            , exts: 'jpg|png'
            , before: function (obj) {
                obj.preview(function (index, file, result) {
                    $('#' + showicon).attr('src', result);
                    $('#' + showicon).attr('width', '80px');
                });
            }
            , done: function (res) {
                if (res.code == 200) {
                    $("#" + icon).val(res.data.src);
                    layer.msg(res.msg);
                }
            }
            , error: function (e) {
                layer.msg("上传失败!");
            }
        });
    }
    //事件
    var active = {
        add: function () {
            admin.popup({
                title: '添加'
                , area: ['705px', '88%']
                , resize: false
                , success: function (layero, index) {
                    view(this.id).render('/content/evaluationgame/add').done(function () {

                        //获取算分码
                        common.ajax(setter.apiAddress.calculatecode.loadall, "Get", "", {}, function (res) {
                            $.each(res.data, function (index, item) {
                                $("#code").append("<option value=\"" + item.id + "\">" + item.code + "</option>");
                            });
                            form.render("select");
                        });
                        //选择算分码
                        form.on('select(codefilter)', function (data) {
                            $("#calculateCode").val(data.elem[data.elem.selectedIndex].text);
                        });

                        //获取顶级能力
                        common.ajax(setter.apiAddress.ability.selname, "GET", "", { level: 0 }, function (res) {
                            common.select("abilityTypeId", res.data, "", 1);
                            form.render("select");
                        });
                        //获取一级能力
                        form.on('select(typefilter)', function (data) {
                            $("#secondAbilityId").empty();
                            $("#firstAbilityId").empty();
                            if (data.value != "") {
                                common.ajax(setter.apiAddress.ability.selname, "GET", "", { pid: data.value }, function (res) {
                                    common.select("firstAbilityId", res.data, "", 1);
                                    form.render("select");
                                });
                            }
                            else {
                                common.select("firstAbilityId", [{ id: "", name: "" }], "", 1);
                                common.select("secondAbilityId", [{ id: "", name: "" }], "", 1);
                                form.render("select");
                            }
                        });
                        //获取二级能力
                        form.on('select(abilityfilter)', function (data) {
                            $("#secondAbilityId").empty();
                            if (data.value != "") {
                                common.ajax(setter.apiAddress.ability.selname, "GET", "", { pid: data.value }, function (res) {
                                    common.select("secondAbilityId", res.data, "", 1);
                                    form.render("select");
                                });
                            }
                            else {
                                common.select("secondAbilityId", [{ id: "", name: "" }], "", 1);
                            }
                        });
                        uploadInst("uploadicon", "showicon", "icon", "content/evaluationgame/add");
                        uploadInst("uploadcoverPlanUri", "showcoverPlanUri", "coverPlanUri", "content/evaluationgame/add");
                        //保存
                        form.on('submit(evaluationgame-form-submit)', function (data) {
                            if ($("#icon").val() == "" || $("#coverPlanUri").val() == "") {
                                layer.msg("请上传图片");
                            } else {
                                common.ajax(setter.apiAddress.evaluationgame.add, "POST", "", data.field, function (res) {
                                    if (res.statusCode == 200) {
                                        layer.close(index);
                                        table.reload('evaluationgame-table');
                                    }
                                    layer.msg(res.message);
                                });
                            }
                        });
                    });
                }
            });
        }
    };
    $('.layui-btn.btn-evaluationgame').on('click', function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });

    //编辑&删除
    table.on('tool(evaluationgame-table)', function (obj) {
        var data = obj.data;
        if (obj.event === 'del') {
            layer.confirm('确定删除？', function (index) {
                common.ajax(setter.apiAddress.evaluationgame.delete, "POST", "", { id: data.id }, function (res) {
                    if (res.statusCode == 200) {
                        layer.close(index);
                        table.reload('evaluationgame-table');
                    }
                    layer.msg(res.message);
                });
            });
        } else if (obj.event === 'changestatus') {
            var titletext = "确认下架？";
            if (!data.status) {
                titletext = "确认上架？";
            }
            layer.confirm(titletext, { icon: 3, title: '提示' }, function (index) {
                common.ajax(setter.apiAddress.evaluationgame.updatestatus, "POST", "", { id: data.id }, function (res) {
                    if (res.statusCode == 200) {
                        layer.close(index);
                        layui.table.reload('evaluationgame-table');
                    }
                    layer.msg(res.message);
                });
            });
        } else if (obj.event === 'edit') {
            admin.popup({
                title: '编辑'
                , area: ['705px', '88%']
                , resize: false
                , success: function (layero, index) {
                    view(this.id).render('content/evaluationgame/edit', data).done(function () {
                        form.render(null, 'formData');
                        $("#description").val(data.description);
                        //获取算分码
                        common.ajax(setter.apiAddress.calculatecode.loadall, "Get", "", {}, function (res) {
                            $.each(res.data, function (index, item) {
                                if (item.code == data.exerciseCalculateCode) {
                                    $("#code").append("<option selected value=\"" + item.id + "\">" + item.code + "</option>");
                                }
                                else {
                                    $("#code").append("<option value=\"" + item.id + "\">" + item.code + "</option>");
                                }
                            });
                            form.render("select");
                        });

                        //选择算分码
                        form.on('select(codefilter)', function (data) {
                            $("#calculateCode").val(data.elem[data.elem.selectedIndex].text);
                        });

                        //获取顶级能力
                        common.ajax(setter.apiAddress.ability.selname, "GET", "", { level: 0 }, function (res) {
                            common.select("typeId", res.data, data.abilityTypeId, 1);
                            //获取一级能力
                            common.ajax(setter.apiAddress.ability.selname, "GET", "", { pid: data.abilityTypeId }, function (res) {
                                common.select("firstId", res.data, data.firstAbilityId, 2);
                                form.render("select");
                            });
                            //获取二级能力
                            common.ajax(setter.apiAddress.ability.selname, "GET", "", { pid: data.firstAbilityId }, function (res) {
                                common.select("secondId", res.data, data.secondAbilityId, 3);
                                form.render("select");
                            });
                            form.render("select");
                        });
                        //获取一级能力
                        form.on('select(topsfilter)', function (data) {
                            $("#firstId").empty();
                            $("#secondId").empty();
                            if (data.value != "") {
                                common.ajax(setter.apiAddress.ability.selname, "GET", "", { pid: data.value }, function (res) {
                                    common.select("firstId", res.data, "", 1);
                                    form.render("select");
                                });
                            } else {
                                common.select("firstId", [{ id: "", name: "" }], 1, 1);
                                common.select("secondId", [{ id: "", name: "" }], 1, 1);
                                form.render("select");
                            }
                        });
                        //获取二级能力
                        form.on('select(firstfilter)', function (data) {
                            $("#secondId").empty();
                            if (data.value != "") {
                                common.ajax(setter.apiAddress.ability.selname, "GET", "", { pid: data.value }, function (res) {
                                    common.select("secondId", res.data, "", 1);
                                    form.render("select");
                                });
                            } else {
                                common.select("secondId", [{ id: "", name: "" }], 1, 1);
                                form.render("select");
                            }
                        });
                        uploadInst("uploadicon", "showicon", "icon", "content/evaluationgame/edit");
                        uploadInst("uploadcoverPlanUri", "showcoverPlanUri", "coverPlanUri", "content/evaluationgame/edit");
                        //监听提交
                        form.on('submit(evaluationgame-form-submit)', function (data) {
                            if ($("#icon").val() == "" || $("#coverPlanUri").val() == "") {
                                layer.msg("请上传图片");
                            } else {
                                common.ajax(setter.apiAddress.evaluationgame.update, "POST", "", data.field, function (res) {
                                    if (res.statusCode == 200) {
                                        layer.close(index);
                                        table.reload('evaluationgame-table');
                                    }
                                    layer.msg(res.message);
                                });
                            }
                        });
                    });
                }
            });
        } else if (obj.event ==='preview') {
            //预览游戏
            layer.open({
                type: 2,
                title: '预览',
                area: ['65%', '70%'],
                content: data.uri
            });
        } else if (obj.event = 'import') {
            location.hash = '/content/evaluationgame/norm/exerciseId=' + data.id + '';
            //admin.popup({
            //    title: '常模管理'
            //    , area: ['830px', '750px']
            //    , resize: false
            //    , success: function (layero, index) {
            //        view(this.id).render('content/evaluationgame/normindex', data).done(function () {
            //            //渲染常模列表
            //            table.render({
            //                elem: '#normal-table'
            //                , id: 'normalId'
            //                , url: setter.apiAddress.normconfig.list
            //                , cols: [[
            //                    {
            //                        field: 'name', title: '游戏名称', align: 'center', templet: function (d) {
            //                            if (d.evaluationGamesDto == null) {
            //                                return "";
            //                            }
            //                            return d.evaluationGamesDto.name;
            //                        }
            //                    },
            //                    {
            //                        field: 'country', title: '地区信息', align: 'center', templet: function (d) {
            //                            if (d.province != null && d.city != null && d.district != null) {
            //                                return d.country + d.province + d.city + d.district
            //                            } else if (d.province != null && d.city != null && d.district == null) {
            //                                return d.country + d.province + d.city
            //                            } else if (d.province != null && d.city == null && d.district == null) {
            //                                return d.country + d.province
            //                            } else if (d.province == null && d.city == null && d.district == null) {
            //                                return d.country
            //                            } else {
            //                                return ''
            //                            }
            //                        }
            //                    },
            //                    {
            //                        field: 'deviceType', title: '设备信息', align: 'center', templet: function (d) {
            //                            if (d.deviceType == "1") { return "键盘"; }
            //                            else if (d.deviceType == "2") { return "鼠标"; }
            //                            else if (d.deviceType == "3") { return "混合" }
            //                            else { return "触屏"; }
            //                        }
            //                    },
            //                    {
            //                        field: 'defaultnorm', title: '是否默认', align: 'center', templet: function (d) { return d.defaultNorm == false ? "否" : "是"; }
            //                    },
            //                    {
            //                        width: 200, title: '操作', align: 'center'
            //                        , templet: function (d) {
            //                            var htmlButton = new Array();
            //                            htmlButton.push('<div class="layui-btn-group">')
            //                            htmlButton.push('<a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="normdel"><i class="layui-icon layui-icon-edit"></i>删除</a>');
            //                            htmlButton.push('</div>')
            //                            return htmlButton.join('');
            //                        }
            //                    }
            //                ]]
            //                , where: { exerciseId: data.id }
            //                , page: true

            //                , text: {
            //                    none: '暂无相关数据'
            //                }
            //                , response: {
            //                    statusCode: 200
            //                }
            //                , parseData: function (res) {
            //                    return {
            //                        "code": res.statusCode,
            //                        "msg": res.message,
            //                        "count": res.result.totalCount,
            //                        "data": res.result.items
            //                    };
            //                }
            //            });
            //            //常模列表操作
            //            table.on('tool(normal-table)', function (obj) {
            //                var rowdata = obj.data;
            //                if (obj.event === 'normdel') {
            //                    layer.confirm('确定删除？', function (index) {
            //                        common.ajax(setter.apiAddress.normconfig.delete, "POST", "", rowdata, function (res) {
            //                            if (res.statusCode == 200) {
            //                                layer.close(index);
            //                                table.reload('normalId');
            //                            }
            //                            layer.msg(res.message);
            //                        });
            //                    });
            //                }
            //            });
            //            //导入常模
            //            element.on('tab(normal-tab)', function (data) {
            //                if (data.index == 1) {
            //                    $("#provinceId").empty();
            //                    $("#pname").val("");
            //                    $("#city").val("");
            //                    $("#district").val("");
            //                    $("#districtId").empty();
            //                    $("#cityId").empty();
            //                    $("#deviceType").val("");
            //                    $(".import span").remove();
            //                    $(".layui-upload-file").val("");
            //                    $("#importresult").html("");
            //                    $("#op").removeAttr("checked");
            //                    $("#btn-import").hide();
            //                    //导入常模
            //                    form.render(null, 'import-norm-form');
            //                    // 获取国家信息
            //                    common.ajax(setter.apiAddress.region.loadchilds, "GET", "", { parentId: 0 }, function (res) {
            //                        common.select("countryId", res.result, "", 1);
            //                        form.render("select");
            //                    });
            //                    form.on('select(countryfilter)', function (data) {
            //                        $("#country").val($("#countryId").find("option:selected").text());
            //                        $("#provinceId").empty();
            //                        $("#cityId").empty();
            //                        $("#districtId").empty();
            //                        $("#provinceId").val("");
            //                        $("#pname").val("");
            //                        $("#cityId").val("");
            //                        $("#city").val("");
            //                        $("#districtId").val("");
            //                        $("#district").val("");
            //                        common.ajax(setter.apiAddress.region.loadchilds, "GET", "", { parentId: data.value }, function (res) {
            //                            common.select("provinceId", res.result, "", 1);
            //                            form.render("select");
            //                        })
            //                    });
            //                    //获取城市
            //                    form.on('select(provincefilter)', function (data) {
            //                        $("#pname").val($("#provinceId").find("option:selected").text());
            //                        $("#cityId").empty();
            //                        $("#districtId").empty();
            //                        $("#cityId").val("");
            //                        $("#city").val("");
            //                        $("#districtId").val("");
            //                        $("#district").val("");
            //                        common.ajax(setter.apiAddress.region.loadchilds, "GET", "", { parentId: data.value }, function (res) {
            //                            common.select("cityId", res.result, "", 1);
            //                            form.render("select");
            //                        })
            //                    });
            //                    //获取地区
            //                    form.on('select(cityfilter)', function (data) {
            //                        $("#city").val($("#cityId").find("option:selected").text());
            //                        $("#districtId").empty();
            //                        $("#districtId").val("");
            //                        $("#district").val("");
            //                        common.ajax(setter.apiAddress.region.loadchilds, "GET", "", { parentId: data.value }, function (res) {
            //                            common.select("districtId", res.result, "", 1);
            //                            form.render("select");
            //                        })
            //                    });
            //                    //获取地区文本
            //                    form.on('select(districtfilter)', function (data) {
            //                        $("#district").val($("#districtId").find("option:selected").text());
            //                    });
            //                    //下载模板
            //                    $("#downloadtemplate").attr('href', setter.apiAddress.normconfig.getimporttemplate);
            //                    $("#downloadtemplate").click(function (event) {
            //                        event.stopPropagation();
            //                    });
            //                    //下载错误模板
            //                    $("#downloadresult").attr('href', setter.apiAddress.normconfig.getimportresult);
            //                    $("#downloadresult").hide();
            //                    $("#downloadresult").click(function (event) {
            //                        event.stopPropagation();
            //                    });
            //                    //提交导入
            //                    form.on('submit(btn-import-save)', function (data) {
            //                        if ($(".layui-upload-file").next().html() != "" && $(".layui-upload-file").next().html() != undefined) {
            //                            $("#btn-import").click();
            //                        } else {
            //                            layer.msg("请选择文件");
            //                        }
            //                    });
            //                }
            //            });
            //            //拖拽上传
            //            upload.render({
            //                elem: '#import-norm-from-xls'
            //                , url: setter.apiAddress.normconfig.uploadfile
            //                , accept: 'file'
            //                , field: "excelfile"
            //                , auto: false
            //                , bindAction: '#btn-import'
            //                , acceptMime: 'file/xlsx'
            //                , exts: 'xlsx'
            //                , size: 50
            //                , headers: { Authorization: "Bearer " + sessionStorage.getItem("access_token") }
            //                , before: function (obj) {
            //                    this.data =
            //                        {
            //                            exercisename: $("#exercisename").val(),
            //                            exerciseId: $("#exerciseId").val(),
            //                            countryId: $("#countryId").val(),
            //                            country: $("#country").val(),
            //                            provinceId: $("#provinceId").val(),
            //                            cityId: $("#cityId").val() == null ? "" : $("#cityId").val(),
            //                            districtId: $("#districtId").val() == null ? "" : $("#districtId").val(),
            //                            province: $("#pname").val(),
            //                            city: $("#city").val(),
            //                            district: $("#district").val(),
            //                            deviceType: $("#deviceType").val(),
            //                            defultnorm: $("input:checkbox[name='open']:checked").val(),
            //                            normType: 1
            //                        };
            //                    $("#btn-import-save").attr("disabled", true);
            //                    $("#btn-import-save").addClass("layui-btn-disabled");
            //                    layer.load();
            //                }
            //                , done: function (res, index, upload) {
            //                    layer.closeAll('loading');
            //                    $("#btn-import-save").attr("disabled", false);
            //                    $("#btn-import-save").removeClass("layui-btn-disabled");
            //                    if (res.statusCode == 400) {
            //                        var resultHtml = new Array();
            //                        resultHtml.push('<p>');
            //                        resultHtml.push(res.message);
            //                        resultHtml.push('</p>');
            //                        $("#importresult").html("");
            //                        $("#importresult").html(resultHtml.join(''));
            //                        $("#downloadresult").show();
            //                        table.reload('normal-table');
            //                    } else if (res.statusCode == 202) {
            //                        layer.msg(res.message);
            //                    } else {
            //                        layer.msg(res.message);
            //                        $("#countryId").empty();
            //                        $("#country").val("");
            //                        $("#provinceId").empty();
            //                        $("#pname").val("");
            //                        $("#cityId").empty();
            //                        $("#city").val("");
            //                        $("#districtId").empty();
            //                        $("#district").val("");
            //                        $("#deviceType").val("");
            //                        element.tabChange('normal-tab', '1');
            //                        table.reload('normalId');
            //                    }
            //                }
            //                , error: function (index, upload) {
            //                    layer.closeAll('loading');
            //                    layer.msg("导入数据失败!");
            //                }
            //            });
            //        });
            //    },
            //    end: function (index, layero) {
            //        layui.table.reload('evaluationgame-table');
            //    }
            //});
        }
    });
    exports('evaluationgame', {})
});