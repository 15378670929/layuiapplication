﻿/**
 @Name：训练游戏管理
 */
layui.define(['table', 'form', 'common', 'setter', 'upload', 'element', 'verification', 'laypage'], function (exports) {
    var $ = layui.$
        , admin = layui.admin
        , view = layui.view
        , table = layui.table
        , common = layui.common
        , setter = layui.setter
        , element = layui.element
        , upload = layui.upload
        , laypage = layui.laypage
        , form = layui.form;

    var checkpoint_header_data;

    //渲染训练游戏列表
    table.render({
        elem: '#traingame-table'
        , url: setter.apiAddress.traingame.list
        , cols: [[
            { field: 'name', title: '游戏名称' },
            { field: 'abilityType', title: '能力类型' },
            { field: 'firstAbility', title: '一级能力' },
            { field: 'secondAbility', title: '二级能力' },
            { field: 'agegroup', title: '年龄段(岁)', align: 'center', width: 100, templet: function (d) { return d.minAge + '-' + d.maxAge; } },
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
                    htmlButton.push('<a class="layui-btn layui-btn-normal layui-btn-xs" lay-event="checkpoint"><i class="layui-icon layui-icon-set"></i>配置</a>');
                    if (d.status) {
                        htmlButton.push('<a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="changestatus"><i class="layui-icon layui-icon-delete"></i>下架</a>');
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
    form.on('submit(traingame-search)', function (data) {
        //执行重载
        table.reload('traingame-table', {
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
            , exts: 'jpg|png'
            , data: { imgType: "1", filePath: filepath }
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

    //添加训练游戏
    var active = {
        add: function () {
            admin.popup({
                title: '添加'
                , area: ['50%', '75%']
                , resize: false
                , success: function (layero, index) {
                    view(this.id).render('/content/traingame/add').done(function () {
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
                        uploadInst("uploadicon", "showicon", "icon", "content/traingame/add");
                        uploadInst("uploadcoverPlanUri", "showcoverPlanUri", "coverPlanUri", "content/traingame/add");
                        //保存
                        form.on('submit(traingame-form-submit)', function (data) {
                            if ($("#icon").val() == "" || $("#coverPlanUri").val() == "") {
                                layer.msg("请上传图片");
                            } else {
                                common.ajax(setter.apiAddress.traingame.add, "POST", "", data.field, function (res) {
                                    if (res.statusCode == 200) {
                                        layer.close(index);
                                        table.reload('traingame-table');
                                    }
                                    layer.msg(res.message)
                                });
                            }
                        });
                    });
                }
            });
        }
    };

    $('.layui-btn.btn-traingame').on('click', function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });

    function findConfigData(data, headerId) {
        var result = "";
        for (var i = 0; i < data.length; i++) {
            if (data[i].headerId == headerId) {
                result = data[i].headerValue;
                break;
            }
        }
        return result;
    }

    var settings = {
        initHeaderConfig: function (gameId) {
            //渲染关卡表头(配置项)列表
            table.render({
                elem: '#checkpoint-table'
                , url: setter.apiAddress.checkpointheader.list
                , cols: [[
                    { type: 'numbers', title: '序号' },
                    { field: 'header', title: '配置项名称', align: 'center' },
                    {
                        title: '操作', align: 'center'
                        , templet: function (d) {
                            var htmlButton = new Array();
                            htmlButton.push('<div class="layui-btn-group">')
                            htmlButton.push('<a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="checkpointdel"><i class="layui-icon layui-icon-edit"></i>删除</a>');
                            htmlButton.push('</div>')
                            return htmlButton.join('');
                        }
                    }
                ]]
                , where: { tainGameId: gameId }
                , page: false
                , text: {
                    none: '暂无相关数据'
                }
                , response: {
                    statusCode: 200
                }
                , parseData: function (res) {
                    checkpoint_header_data = res;
                    return {
                        "code": res.statusCode,
                        "msg": res.message,
                        "data": res.data
                    };
                }
            });
        },
        generateHeader: function (game_data) {
            $("#checkpointdate-form").html("");
            var html = new Array();
            html.push('<div class="layui-form-item">');
            html.push('<label class="layui-form-label" style="width:200px;">关卡标识</label>');
            html.push('<div class="layui-input-block" style="margin-left:230px;">');
            html.push('<input type="text" id="levelSign" name="LevelSign" class="layui-input" lay-verify="required|mainnumber" maxlength="30">');
            html.push('</div>');
            html.push('</div>');
            html.push('<div class="layui-form-item">');
            html.push('<label class="layui-form-label" style="width:200px;">关卡名称</label>');
            html.push('<div class="layui-input-block" style="margin-left:230px;">');
            html.push('<input type="text" id="levelName" name="LevelName" class="layui-input" lay-verify="required|normallength" maxlength="30">');
            html.push('</div>');
            html.push('</div>');
            layui.each(checkpoint_header_data.data, function (index, item) {
                html.push('<div class="layui-form-item">');
                html.push('<label class="layui-form-label" style="width:200px;">' + item.header + '</label>');
                html.push('<div class="layui-input-block rowdiv" style="margin-left:230px;">');
                html.push('<input type="hidden" name="TrainGameId' + index + '"  value=' + game_data.id + ' class="layui-input">');
                html.push('<input type="hidden" name="HeaderId' + index + '"  value=' + item.id + ' class="layui-input">');
                html.push('<input type="text" name="HeaderValue' + index + '" class="layui-input" lay-verify="required|speciallength" maxlength="30">');
                html.push('</div>');
                html.push('</div>');
            });
            html.push('<div class="layui-form-item content-center layui-col-xs12 layui-col-sm12 layui-col-md12">');
            html.push('<button class="layui-btn" type="button" lay-submit lay-filter="checkpointdate-form-submit"> 保存</button >');
            html.push('</div >');
            $("#checkpointdate-form").append(html.join(''));
            //新增关卡数据
            form.on('submit(checkpointdate-form-submit)', function (data) {
                var models = [];
                $("#checkpointdate-form").find(".rowdiv").each(function (index) {
                    models.push({
                      LevelSign: $("#levelSign").val(),
                      LevelName: $("#levelName").val(),
                      HeaderId: $(".rowdiv").eq(index).find('input').eq(1).val(),
                      HeaderValue: $(".rowdiv").eq(index).find('input').eq(2).val(),
                      TrainGameId: $(".rowdiv").eq(index).find('input').eq(0).val()
                    });
                });
                console.log(models, checkpoint_header_data)
                common.ajax(setter.apiAddress.checkpointconfig.add, "POST", "", { models: models }, function (res) {
                    if (res.statusCode == 200) {
                        table.reload('traingame-table');
                        element.tabChange('checkpoint-tab', '3');
                        $("#checkpointdate-form").find(".rowdiv").each(function (index) {
                            $("#levelSign").val("");
                            $("#levelName").val("");
                            $(".rowdiv").eq(index).find('input').eq(1).val("");
                            $(".rowdiv").eq(index).find('input').eq(2).val("");
                            $(".rowdiv").eq(index).find('input').eq(0).val("");
                        });
                    }
                    layer.msg(res.message);
                });
            });
        },
        //TO DO这个是想做分页的
        initlaypage: function (dataCount, gameId) {
            laypage.render({
                elem: 'lay-page-div'
                , count: dataCount
                , jump: function (obj) {
                    //var url = setter.apiAddress.checkpointconfig.pagelist + "?tainGameId=" + gameId + "&page=0&limit=10";
                    //settings.generateConfigTable(url, gameId);
                }
            });
        },
        generateConfigTable: function (url, gameId) {
            common.ajax(url, "get", "", "", function (res) {
              if(typeof res.data["jsonList"] === "string"){
                res.data.items = JSON.parse(res.data.jsonList);
              }
                var configDataCount = res.data.items.length;
                $("#configtable").html("");
                if (configDataCount > 0) {
                    var html = [];
                    html.push('<table class="layui-table" lay-size="sm">');
                    html.push('<thead>');
                    html.push('<tr>');
                    html.push('<th>关卡标识</th>')
                    html.push('<th>关卡名称</th>')
                    layui.each(checkpoint_header_data.data, function (index, item) {
                        html.push('<th>' + item.header + '</th>');
                    });
                    html.push('<th style="text-align: center;">操作</th>')
                    html.push('</tr>');
                    html.push('</thead>');
                    html.push('<tbody>');
                    for (var rowIndex = 0; rowIndex < configDataCount; rowIndex++) {
                        html.push('<tr id="tr_' + res.data.items[rowIndex].levelSign + '">');
                        html.push('<td>' + res.data.items[rowIndex].levelSign + '</td>');
                        html.push('<td>' + res.data.items[rowIndex].levelName + '</td>');
                        layui.each(checkpoint_header_data.data, function (index, item) {
                            var headerVal = findConfigData(res.data.items[rowIndex].trainGameCheckpointConfigDtos, item.id);
                            html.push('<td>' + headerVal + '</td>');
                        });
                        html.push('<td style="text-align: center;">');
                        html.push('<a title="' + gameId + '" class="layui-btn layui-btn-disabled layui-btn-normal layui-btn-xs lay-edit-btn"><i class="layui-icon layui-icon-edit"></i>修改</a>');
                        html.push('<a name="' + res.data.items[rowIndex].levelSign + '" class="layui-btn layui-btn-danger layui-btn-xs lay-delete-btn"><i class="layui-icon layui-icon-edit"></i>删除</a>');
                        html.push('</td>');
                        html.push('</tr>');
                    }
                    html.push('</tbody>');
                    html.push('</table>');
                    $("#configtable").append(html.join(' '));
                    $(".lay-delete-btn").click(function (obj) {
                        var lev = obj.delegateTarget.name;
                        layer.confirm("确定删除？", { icon: 3, title: '提示' }, function (index) {
                            common.ajax(setter.apiAddress.checkpointconfig.delete, "POST", "", { tainGameId: gameId, level: lev }, function (res) {
                                if (res.statusCode == 200) {
                                    $("#tr_" + lev).remove();
                                }
                                layer.msg(res.message);
                            });
                        });
                    });
                    $(".lay-edit-btn").click(function (obj) {
                        var current_game_id = obj.delegateTarget.title;
                        // layer.msg(current_game_id);
                        //common.ajax(setter.apiAddress.checkpointconfig.delete, "POST", "", { tainGameId: gameId, level: lev }, function (res) {
                        //    if (res.statusCode == 200) {
                        //        $("#tr_" + lev).remove();
                        //    }
                        //    layer.msg(res.message);
                        //});
                    });
                } else {
                    $("#configtable").append('<div class="layui-form-item content-center">未配置关卡数据</div>');
                }
            });
        }
    }

    var levelSettings = {
        initTrainGameLevelSelectFour: function (gameId) {
            form.render("select");
            $("#levelDefaultFour option[value=1]").attr("selected", true);
            //Set Default Level Number
            common.ajax(setter.apiAddress.checkpointconfig.getlevels, "GET", "", { trainGameId: gameId, abilityLevelType: 2 }, function (levelres) {
                common.ajax(setter.apiAddress.checkpointconfig.loadallbytaingameid, "POST", "", { tainGameId: gameId }, function (res) {
                    $("#levelDefaultFour").empty();
                    $("#levelAFour").empty();
                    $("#levelBFour").empty();
                    $("#levelCFour").empty();
                    $("#levelDFour").empty();
                    $("#levelDefaultFour").append("<option value=\"0\">请选择</option>");
                    $("#levelAFour").append("<option value=\"0\">请选择</option>");
                    $("#levelBFour").append("<option value=\"0\">请选择</option>");
                    $("#levelCFour").append("<option value=\"0\">请选择</option>");
                    $("#levelDFour").append("<option value=\"0\">请选择</option>");
                    $.each(res.data, function (index, item) {
                        $("#levelDefaultFour").append("<option value=\"" + item.levelSign + "\">" + item.levelName + "</option>");
                        $("#levelAFour").append("<option value=\"" + item.levelSign + "\">" + item.levelName + "</option>");
                        $("#levelBFour").append("<option value=\"" + item.levelSign + "\">" + item.levelName + "</option>");
                        $("#levelCFour").append("<option value=\"" + item.levelSign + "\">" + item.levelName + "</option>");
                        $("#levelDFour").append("<option value=\"" + item.levelSign + "\">" + item.levelName + "</option>");

                        $.each(levelres.data, function (i, n) {
                            if (n.abilityLevel == "Default") {
                                $("#levelDefaultFour option[value=" + n.defaultLevel + "]").attr("selected", true);
                            }
                            if (n.abilityLevel == "A") {
                                $("#levelAFour option[value=" + n.defaultLevel + "]").attr("selected", true);
                            }
                            if (n.abilityLevel == "B") {
                                $("#levelBFour option[value=" + n.defaultLevel + "]").attr("selected", true);
                            }
                            if (n.abilityLevel == "C") {
                                $("#levelCFour option[value=" + n.defaultLevel + "]").attr("selected", true);
                            }
                            if (n.abilityLevel == "D") {
                                $("#levelDFour option[value=" + n.defaultLevel + "]").attr("selected", true);
                            }
                        });
                    });
                    form.render("select");
                });
            });
        },
        initTrainGameLevelSelectEleven: function (gameId) {
            common.ajax(setter.apiAddress.checkpointconfig.getlevels, "GET", "", { trainGameId: gameId, abilityLevelType: 1 }, function (levelres) {
                console.log(levelres.data);
                common.ajax(setter.apiAddress.checkpointconfig.loadallbytaingameid, "POST", "", { tainGameId: gameId }, function (res) {
                    $("#levelDefaultEleven").empty();
                    $("#levelDleven").empty();
                    $("#levelCReduceEleven").empty();
                    $("#levelCEleven").empty();
                    $("#levelCAddEleven").empty();
                    $("#levelBReduceEleven").empty();
                    $("#levelBEleven").empty();
                    $("#levelBAddEleven").empty();
                    $("#levelAReduceEleven").empty();
                    $("#levelAEleven").empty();
                    $("#levelAAddEleven").empty();
                    $("#levelSEleven").empty();
                    $("#levelDefaultEleven").append("<option value=\"0\">请选择</option>");
                    $("#levelDleven").append("<option value=\"0\">请选择</option>");
                    $("#levelCReduceEleven").append("<option value=\"0\">请选择</option>");
                    $("#levelCEleven").append("<option value=\"0\">请选择</option>");
                    $("#levelCAddEleven").append("<option value=\"0\">请选择</option>");
                    $("#levelBReduceEleven").append("<option value=\"0\">请选择</option>");
                    $("#levelBEleven").append("<option value=\"0\">请选择</option>");
                    $("#levelBAddEleven").append("<option value=\"0\">请选择</option>");
                    $("#levelAReduceEleven").append("<option value=\"0\">请选择</option>");
                    $("#levelAEleven").append("<option value=\"0\">请选择</option>");
                    $("#levelAAddEleven").append("<option value=\"0\">请选择</option>");
                    $("#levelSEleven").append("<option value=\"0\">请选择</option>");
                    $.each(res.data, function (index, item) {
                        $("#levelDefaultEleven").append("<option value=\"" + item.levelSign + "\">" + item.levelName + "</option>");
                        $("#levelDleven").append("<option value=\"" + item.levelSign + "\">" + item.levelName + "</option>");
                        $("#levelCReduceEleven").append("<option value=\"" + item.levelSign + "\">" + item.levelName + "</option>");
                        $("#levelCEleven").append("<option value=\"" + item.levelSign + "\">" + item.levelName + "</option>");
                        $("#levelCAddEleven").append("<option value=\"" + item.levelSign + "\">" + item.levelName + "</option>");
                        $("#levelBReduceEleven").append("<option value=\"" + item.levelSign + "\">" + item.levelName + "</option>");
                        $("#levelBEleven").append("<option value=\"" + item.levelSign + "\">" + item.levelName + "</option>");
                        $("#levelBAddEleven").append("<option value=\"" + item.levelSign + "\">" + item.levelName + "</option>");
                        $("#levelAReduceEleven").append("<option value=\"" + item.levelSign + "\">" + item.levelName + "</option>");
                        $("#levelAEleven").append("<option value=\"" + item.levelSign + "\">" + item.levelName + "</option>");
                        $("#levelAAddEleven").append("<option value=\"" + item.levelSign + "\">" + item.levelName + "</option>");
                        $("#levelSEleven").append("<option value=\"" + item.levelSign + "\">" + item.levelName + "</option>");

                        $.each(levelres.data, function (i, n) {
                            if (n.abilityLevel == "Default") {
                                $("#levelDefaultEleven option[value=" + n.defaultLevel + "]").attr("selected", true);
                            }
                            if (n.abilityLevel == "D") {
                                $("#levelDleven option[value=" + n.defaultLevel + "]").attr("selected", true);
                            }
                            if (n.abilityLevel == "C-") {
                                $("#levelCReduceEleven option[value=" + n.defaultLevel + "]").attr("selected", true);
                            }
                            if (n.abilityLevel == "C") {
                                $("#levelCEleven option[value=" + n.defaultLevel + "]").attr("selected", true);
                            }
                            if (n.abilityLevel == "C+") {
                                $("#levelCAddEleven option[value=" + n.defaultLevel + "]").attr("selected", true);
                            }
                            if (n.abilityLevel == "B-") {
                                $("#levelBReduceEleven option[value=" + n.defaultLevel + "]").attr("selected", true);
                            }
                            if (n.abilityLevel == "B") {
                                $("#levelBEleven option[value=" + n.defaultLevel + "]").attr("selected", true);
                            }
                            if (n.abilityLevel == "B+") {
                                $("#levelBAddEleven option[value=" + n.defaultLevel + "]").attr("selected", true);
                            }
                            if (n.abilityLevel == "A-") {
                                $("#levelAReduceEleven option[value=" + n.defaultLevel + "]").attr("selected", true);
                            }
                            if (n.abilityLevel == "A") {
                                $("#levelAEleven option[value=" + n.defaultLevel + "]").attr("selected", true);
                            }
                            if (n.abilityLevel == "A+") {
                                $("#levelAAddEleven option[value=" + n.defaultLevel + "]").attr("selected", true);
                            }
                            if (n.abilityLevel == "S") {
                                $("#levelSEleven option[value=" + n.defaultLevel + "]").attr("selected", true);
                            }
                        });
                        form.render("select");
                    });

                });
            });
        }
    }

    //添加训练游戏事件:编辑&状态管理&配置
    table.on('tool(traingame-table)', function (obj) {
        var data = obj.data;
        rowdata = data
        if (obj.event === 'changestatus') {
            var titletext = "确认下架？";
            if (!data.status) {
                titletext = "确认上架？";
            }
            layer.confirm(titletext, { icon: 3, title: '提示' }, function (index) {
                common.ajax(setter.apiAddress.traingame.updatestatus, "POST", "", { id: data.id }, function (res) {
                    if (res.statusCode == 200) {
                        layer.close(index);
                        layui.table.reload('traingame-table');
                    }
                    layer.msg(res.message);
                });
            });
        } else if (obj.event === 'edit') {
            admin.popup({
                title: '编辑'
                , area: ['50%', '75%']
                , resize: false
                , success: function (layero, index) {
                    view(this.id).render('content/traingame/edit', data).done(function () {
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
                            common.ajax(setter.apiAddress.ability.selname, "GET", "", { pid: rowdata.abilityTypeId }, function (res) {
                                common.select("firstId", res.data, data.firstAbilityId, 1);
                                form.render("select");
                            });
                            //获取二级能力
                            common.ajax(setter.apiAddress.ability.selname, "GET", "", { pid: rowdata.firstAbilityId }, function (res) {
                                common.select("secondId", res.data, data.secondAbilityId, 1);
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
                        uploadInst("uploadicon", "showicon", "icon", "content/traingame/edit");
                        uploadInst("uploadcoverPlanUri", "showcoverPlanUri", "coverPlanUri", "content/traingame/edit");
                        //监听提交
                        form.on('submit(traingame-form-submit)', function (data) {
                            if ($("#icon").val() == "" || $("#coverPlanUri").val() == "") {
                                layer.msg("请上传图片");
                            } else {
                                common.ajax(setter.apiAddress.traingame.update, "POST", "", data.field, function (res) {
                                    if (res.statusCode == 200) {
                                        layer.close(index);
                                        table.reload('traingame-table');
                                    }
                                    layer.msg(res.message);
                                });
                            }
                        });
                    });
                }
            });
        } else if (obj.event === 'checkpoint') {
            admin.popup({
                title: '关卡配置'
                , area: ['100%', '100%']
                , resize: false
                , success: function (layero, index) {
                    view(this.id).render('/content/traingame/checkpoint', data).done(function () {
                        //默认加载游戏配置项-表头列表
                        settings.initHeaderConfig(data.id);
                        //关卡表头(配置项)列表删除操作
                        table.on('tool(checkpoint-table)', function (obj) {
                            var checkrowdata = obj.data;
                            if (obj.event === 'checkpointdel') {
                                layer.confirm('确定删除？', function (index) {
                                    common.ajax(setter.apiAddress.checkpointheader.delete, "POST", "", { id: checkrowdata.id }, function (res) {
                                        if (res.statusCode == 200) {
                                            table.reload('checkpoint-table');
                                        }
                                        layer.msg(res.message);
                                    });
                                });
                            }
                        });
                        //新增关卡表头(配置项)
                        form.on('submit(btn-check-save)', function (data) {
                            common.ajax(setter.apiAddress.checkpointheader.add, "POST", "", data.field, function (res) {
                                if (res.statusCode == 200) {
                                    table.reload('checkpoint-table');
                                    $("#checkPointHeader").val('');
                                }
                                layer.msg(res.message);
                            });
                        });
                        //选项卡切换事件
                        element.on('tab(checkpoint-tab)', function (tabdata) {
                            var index = tabdata.index;
                            switch (index) {
                                case 0:
                                    settings.initHeaderConfig(data.id);
                                    break;
                                case 1:
                                    settings.generateHeader(data);
                                    break;
                                case 2:
                                    $("#btn-import-config").hide();
                                    $("#exportconfig").attr('href', setter.apiAddress.checkpointconfig.exportconfigdata + "?trainGameId=" + data.id);
                                    $("#exportconfig").click(function (event) {
                                        event.stopPropagation();
                                    });
                                    var url = setter.apiAddress.checkpointconfig.pagelist + "?tainGameId=" + data.id + "&page=0&limit=100";
                                    settings.generateConfigTable(url, data.id);
                                    //导入配置数据-拖拽上传
                                    upload.render({
                                        elem: '#import-config-from-xls'
                                        , url: setter.apiAddress.checkpointconfig.importconfigdata+"?filePath=content/traingame/checkpoint"
                                        , accept: 'file'
                                        , field: "excelfile"
                                        , auto: false
                                        , bindAction: '#btn-import-config'
                                        , acceptMime: 'file/xlsx'
                                        , exts: 'xlsx'
                                        , size: 50
                                        , headers: { Authorization: "Bearer " + sessionStorage.getItem("access_token") }
                                        , before: function (obj) {
                                            this.data = { trainGameId: data.id }
                                            $("#btn-import-config-save").attr("disabled", true);
                                            $("#btn-import-config-save").addClass("layui-btn-disabled");
                                            layer.load();
                                        }
                                        , done: function (res, index, upload) {
                                            layer.closeAll('loading');
                                            $("#btn-import-config-save").attr("disabled", false);
                                            $("#btn-import-config-save").removeClass("layui-btn-disabled");
                                            if (res.statusCode == 200) {
                                                settings.generateConfigTable(url, data.id);
                                            } else {
                                                layer.msg(res.message);
                                            }
                                        }
                                        , error: function (index, upload) {
                                            layer.closeAll('loading');
                                            layer.msg("导入数据失败!");
                                        }
                                    });
                                    //提交导入
                                    form.on('submit(btn-import-config-save)', function (data) {
                                        if ($(".layui-upload-file").next().html() != "" && $(".layui-upload-file").next().html() != undefined) {
                                            $("#btn-import-config").click();
                                        } else {
                                            layer.msg("请选择文件");
                                        }
                                    });
                                    break;
                                case 3:
                                    form.render("select");
                                    if (data.resetGameLevel) {
                                        $("#isResetDefaultLevel2 option[value=true]").attr("selected", true);
                                    }
                                    else {
                                        $("#isResetDefaultLevel2 option[value=false]").attr("selected", true);
                                    }
                                    levelSettings.initTrainGameLevelSelectEleven(data.id);
                                    form.on('submit(btn-leveleleven-save)', function (levelelevendata) {
                                        if ($("#levelDefaultEleven").val() == 0) {
                                            layer.msg("请选择无等级对应的初始关卡");
                                            return;
                                        }
                                        if ($("#levelDleven").val() == 0) {
                                            layer.msg("请选择D等级对应的初始关卡");
                                            return;
                                        }
                                        if ($("#levelCReduceEleven").val() == 0) {
                                            layer.msg("请选择C-等级对应的初始关卡");
                                            return;
                                        }
                                        if ($("#levelCEleven").val() == 0) {
                                            layer.msg("请选择C等级应的初始关卡");
                                            return;
                                        }
                                        if ($("#levelCAddEleven").val() == 0) {
                                            layer.msg("请选择C+等级的初始关卡");
                                            return;
                                        }
                                        if ($("#levelBReduceEleven").val() == 0) {
                                            layer.msg("请选择B-等级对应的初始关卡");
                                            return;
                                        }
                                        if ($("#levelBEleven").val() == 0) {
                                            layer.msg("请选择B等级对应的初始关卡");
                                            return;
                                        }
                                        if ($("#levelBAddEleven").val() == 0) {
                                            layer.msg("请选择B+等级对应的初始关卡");
                                            return;
                                        }
                                        if ($("#levelAReduceEleven").val() == 0) {
                                            layer.msg("请选择A-等级应的初始关卡");
                                            return;
                                        }
                                        if ($("#levelAEleven").val() == 0) {
                                            layer.msg("请选择A等级的初始关卡");
                                            return;
                                        }
                                        if ($("#levelAAddEleven").val() == 0) {
                                            layer.msg("请选择A+等级的初始关卡");
                                            return;
                                        }
                                        if ($("#levelSEleven").val() == 0) {
                                            layer.msg("请选择S等级的初始关卡");
                                            return;
                                        }
                                        var eleven_level_models = [];
                                        eleven_level_models.push({
                                            GameId: data.id,
                                            AbilityLevel: "Default",
                                            AbilityLevelType: 1,
                                            DefaultLevel: $("#levelDefaultEleven").val(),
                                            ISDefault: true,
                                        });
                                        eleven_level_models.push({
                                            GameId: data.id,
                                            AbilityLevel: "D",
                                            AbilityLevelType: 1,
                                            DefaultLevel: $("#levelDleven").val(),
                                            ISDefault: false,
                                        });
                                        eleven_level_models.push({
                                            GameId: data.id,
                                            AbilityLevel: "C-",
                                            AbilityLevelType: 1,
                                            DefaultLevel: $("#levelCReduceEleven").val(),
                                            ISDefault: false,
                                        });
                                        eleven_level_models.push({
                                            GameId: data.id,
                                            AbilityLevel: "C",
                                            AbilityLevelType: 1,
                                            DefaultLevel: $("#levelCEleven").val(),
                                            ISDefault: false,
                                        });
                                        eleven_level_models.push({
                                            GameId: data.id,
                                            AbilityLevel: "C+",
                                            AbilityLevelType: 1,
                                            DefaultLevel: $("#levelCAddEleven").val(),
                                            ISDefault: false,
                                        });
                                        eleven_level_models.push({
                                            GameId: data.id,
                                            AbilityLevel: "B-",
                                            AbilityLevelType: 1,
                                            DefaultLevel: $("#levelBReduceEleven").val(),
                                            ISDefault: false,
                                        });
                                        eleven_level_models.push({
                                            GameId: data.id,
                                            AbilityLevel: "B",
                                            AbilityLevelType: 1,
                                            DefaultLevel: $("#levelBEleven").val(),
                                            ISDefault: false,
                                        });
                                        eleven_level_models.push({
                                            GameId: data.id,
                                            AbilityLevel: "B+",
                                            AbilityLevelType: 1,
                                            DefaultLevel: $("#levelBAddEleven").val(),
                                            ISDefault: false,
                                        });
                                        eleven_level_models.push({
                                            GameId: data.id,
                                            AbilityLevel: "A-",
                                            AbilityLevelType: 1,
                                            DefaultLevel: $("#levelAReduceEleven").val(),
                                            ISDefault: false,
                                        });
                                        eleven_level_models.push({
                                            GameId: data.id,
                                            AbilityLevel: "A",
                                            AbilityLevelType: 1,
                                            DefaultLevel: $("#levelAEleven").val(),
                                            ISDefault: false,
                                        });
                                        eleven_level_models.push({
                                            GameId: data.id,
                                            AbilityLevel: "A+",
                                            AbilityLevelType: 1,
                                            DefaultLevel: $("#levelAAddEleven").val(),
                                            ISDefault: false,
                                        });
                                        eleven_level_models.push({
                                            GameId: data.id,
                                            AbilityLevel: "S",
                                            AbilityLevelType: 1,
                                            DefaultLevel: $("#levelSEleven").val(),
                                            ISDefault: false,
                                        });
                                        common.ajax(setter.apiAddress.checkpointconfig.defaultlevelsettings, "POST", "", { tainGameId: data.id, models: eleven_level_models, abilityLevelType: 1, resetLevel: $("#isResetDefaultLevel2").val() }, function (res) {
                                            layui.table.reload('traingame-table');
                                            layer.msg(res.message);
                                        });
                                    });
                                    break;
                                case 4:
                                    form.render("select");
                                    if (data.resetGameLevel) {
                                        $("#isResetDefaultLevel option[value=true]").attr("selected", true);
                                    }
                                    else {
                                        $("#isResetDefaultLevel option[value=false]").attr("selected", true);
                                    }
                                    levelSettings.initTrainGameLevelSelectFour(data.id);
                                    form.on('submit(btn-four-save)', function (formdata) {
                                        if ($("#levelDefaultFour").val() == 0) {
                                            layer.msg("请选择无等级对应的初始关卡");
                                            return;
                                        }
                                        if ($("#levelAFour").val() == 0) {
                                            layer.msg("请选择A等级对应的初始关卡");
                                            return;
                                        }
                                        if ($("#levelBFour").val() == 0) {
                                            layer.msg("请选择B等级对应的初始关卡");
                                            return;
                                        }
                                        if ($("#levelCFour").val() == 0) {
                                            layer.msg("请选择C等级应的初始关卡");
                                            return;
                                        }
                                        if ($("#levelDFour").val() == 0) {
                                            layer.msg("请选择D等级的初始关卡");
                                            return;
                                        }
                                        var default_level_models = [];
                                        default_level_models.push({
                                            GameId: data.id,
                                            AbilityLevel: "Default",
                                            AbilityLevelType: 2,
                                            DefaultLevel: $("#levelDefaultFour").val(),
                                            ISDefault: true,
                                        });
                                        default_level_models.push({
                                            GameId: data.id,
                                            AbilityLevel: "A",
                                            AbilityLevelType: 2,
                                            DefaultLevel: $("#levelAFour").val(),
                                            ISDefault: false,
                                        });
                                        default_level_models.push({
                                            GameId: data.id,
                                            AbilityLevel: "B",
                                            AbilityLevelType: 2,
                                            DefaultLevel: $("#levelBFour").val(),
                                            ISDefault: false,
                                        });
                                        default_level_models.push({
                                            GameId: data.id,
                                            AbilityLevel: "C",
                                            AbilityLevelType: 2,
                                            DefaultLevel: $("#levelCFour").val(),
                                            ISDefault: false,
                                        });
                                        default_level_models.push({
                                            GameId: data.id,
                                            AbilityLevel: "D",
                                            AbilityLevelType: 2,
                                            DefaultLevel: $("#levelDFour").val(),
                                            ISDefault: false,
                                        });

                                        common.ajax(setter.apiAddress.checkpointconfig.defaultlevelsettings, "POST", "", { tainGameId: data.id, models: default_level_models, abilityLevelType: 2, resetLevel: $("#isResetDefaultLevel").val() }, function (res) {
                                            layui.table.reload('traingame-table');
                                            layer.msg(res.message);
                                        });
                                    });
                                    break;
                            }
                        });
                    });
                }
            });
        }
    });

    exports('traingame', {})
});