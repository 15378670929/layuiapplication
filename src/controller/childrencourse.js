﻿/**
 @Name：课程管理
 */
layui.define(['table', 'form', 'common', 'setter', 'laydate', 'verification', 'element', 'treeGrid'], function (exports) {
    var $ = layui.$
        , admin = layui.admin
        , view = layui.view
        , table = layui.table
        , common = layui.common
        , setter = layui.setter
        , element = layui.element
        , treeGrid = layui.treeGrid
        , form = layui.form;

    treeGrid.set({ headers: { Authorization: "Bearer " + sessionStorage.access_token } })

    //添加课时
    var active = {
        add: function () {
            admin.popup({
                title: '添加'
                , area: ['50%', '50%']
                , resize: false
                , success: function (layero, index) {
                    view(this.id).render('content/childrencourse/add').done(function () {
                        $("#courseId").val(layui.router().search.courseid);
                        form.render("radio");
                        form.render('select');
                        form.on('submit(childrencourse-add-form-submit)', function (data) {
                            common.ajax(setter.apiAddress.childrencourse.add, "POST", "", data.field, function (res) {
                                if (res.statusCode == 200) {
                                    layer.close(index);
                                    layui.table.reload('childrencourseid');
                                }
                                layer.msg(res.message);
                            });
                        });
                    });
                }
            });
        }
    };

    $('.layui-btn.btn-childcourse').on('click', function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });

    //搜索
    form.on('submit(childrencourse-search)', function (data) {
        //执行重载
        var courseClass = parseFloat($("#courseClass").val()) || 0
        table.reload('childrencourseid', {
            where: { name: $("#name").val(), courseClass: courseClass },
            page: {
                curr: 1 //重新从第 1 页开始
            }
        });
    });

    //课时表格事件
    table.on('tool(childrencourse-table)', function (obj) {
        var rowdata = obj.data;
        if (obj.event === 'changestatus') {
            var titletext = "确认禁用？"; if (!rowdata.status) {
                titletext = "确认启用？";
            }
            layer.confirm(titletext, { icon: 3, title: '提示' }, function (index) {
                common.ajax(setter.apiAddress.childrencourse.updatestatus, "POST", "", { id: rowdata.id }, function (res) {
                    if (res.statusCode == 200) {
                        layer.close(index);
                        table.reload('childrencourseid');
                    }
                    layer.msg(res.message);
                });
            });
        } else if (obj.event === 'edit') {
            admin.popup({
                title: '编辑'
                , area: ['50%', '50%']
                , resize: false
                , success: function (layero, index) {
                    view(this.id).render('content/childrencourse/edit', rowdata).done(function () {
                        $("select[name=CourseClass]").val(rowdata.courseClass);
                        $("input[name=Status][value=true]").attr("checked", rowdata.status == true ? true : false);
                        $("input[name=Status][value=false]").attr("checked", rowdata.status == false ? true : false);
                        $("#courseId").val(layui.router().search.courseid)
                        form.render('select');
                        form.render();
                        form.on('submit(childrencourse-edit-form-submit)', function (data) {
                            common.ajax(setter.apiAddress.childrencourse.update, "POST", "", data.field, function (res) {
                                if (res.statusCode == 200) {
                                    layer.close(index);
                                    layui.table.reload('childrencourseid');
                                }
                                layer.msg(res.message);
                            });
                        });
                    });
                }
            });
        } else if (obj.event === 'addgame') {
          console.log(obj)
            admin.popup({
                title: '配置课时内容'
                , area: ['1400px', '800px']
                , resize: true
                , success: function (layero, index) {
                    view(this.id).render('content/childrencourse/addgame', rowdata).done(function () {
                      if(obj.data.courseClass == 1){
                        $(".layui-tab-title").children().eq(3).hide()
                      }if(obj.data.courseClass == 2){
                        $(".layui-tab-title").children().eq(2).hide()
                        $(".layui-tab-title").children().eq(1).hide()
                      }
                        //课时明细
                        table.render({
                            elem: '#childcourseconfig-table'
                            , id: 'configId'
                            , url: setter.apiAddress.coursechildconfig.list
                            , cols: [[
                                { type: 'checkbox' },
                                {
                                    field: 'name', title: '课时名称', templet: function (d) {
                                        if (d.courseChildDto != null) { return d.courseChildDto.name } return ""
                                    }
                                },
                                {
                                    field: 'contentname', title: '内容名称', templet: function (d) {
                                        switch (d.content.contentType) {
                                            case 1:
                                                if (d.content != null) return d.content.name;
                                                else return "";
                                                break;
                                            case 2:
                                                if (d.content != null) return d.content.name;
                                                else return "";
                                                break;
                                            case 3:
                                                if (d.content != null) return d.content.name;

                                                else return "";
                                                break;
                                            default:
                                                return "-";
                                                break;
                                        }
                                    }
                                },
                                {
                                    field: 'contentFlag', title: '内容类型', align: 'center', templet: function (d) {
                                        if (d.content.contentType == 1) {
                                            return "<span style='color:#2F4056;'>测评游戏</span>";
                                        } else if (d.content.contentType == 2) {
                                            return "<span style='color:#FF5722;'>训练游戏</span>";
                                        } else {
                                            return "<span style='color:#009688;'>题目壳</span>";
                                        }
                                    }
                                },
                                { field: 'firstAbilityName', title: '一级能力' },
                                { field: 'secondAbilityName', title: '二级能力' },
                                { field: 'displayOrder', title: '排列顺序', align: 'center' },
                                { field: 'executionsNumber', title: '执行次数', align: 'center' },
                                {
                                    title: '操作', align: 'center', width: 200
                                    , templet: function (d) {
                                        var htmlButton = new Array();
                                        htmlButton.push('<div class="layui-btn-group">')
                                        htmlButton.push('<a class="layui-btn layui-btn-normal layui-btn-xs" lay-event="num"><i class="layui-icon layui-icon-edit"></i>次数</a>');
                                        htmlButton.push('<a class="layui-btn layui-btn-normal layui-btn-xs" lay-event="setorder"><i class="layui-icon layui-icon-edit"></i>排序</a>');
                                        htmlButton.push('<a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="questiondel"><i class="layui-icon layui-icon-delete"></i>删除</a>');
                                        htmlButton.push('</div>')
                                        return htmlButton.join('');
                                    }
                                }
                            ]]
                            , where: { childcourseId: rowdata.id }
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
                        //批量删除
                        var active = {
                            childcoursedels: function () {
                                var checkStatus = table.checkStatus('configId');
                                if (checkStatus.data.length > 0) {
                                    layer.confirm('一共选择' + checkStatus.data.length + '个题目，确定删除？', function (index) {
                                        var models = [];
                                        var configdata = checkStatus.data;
                                        console.log(configdata)
                                        for (var i = 0; i < configdata.length; i++) {
                                            models.push({ 
                                              Id: configdata[i].id,
                                              ContentId: configdata[i].contentId, 
                                              FirstAbilityId: configdata[i].firstAbilityId,
                                              SecondAbilityId: configdata[i].secondAbilityId,
                                              CourseId: configdata[i].courseChildDto.courseId,
                                              ChildCourseId: configdata[i].childCourseId
                                            });
                                        }
                                        common.ajax(setter.apiAddress.coursechildconfig.deleteconfig, "POST", "", { models: models }, function (res) {
                                            if (res.statusCode == 200) {
                                                layer.close(index);
                                                table.reload('configId');
                                            }
                                            layer.msg(res.message);
                                        });
                                    });
                                } else {
                                    layer.msg("请选择题目");
                                }
                            }
                        };
                        $('.layui-btn.btn-config-group').on('click', function () {
                            var type = $(this).data('type');
                            active[type] ? active[type].call(this) : '';
                        });
                        //课时明细列表操作
                        table.on('tool(childcourseconfig-table)', function (obj) {
                            console.log(obj)
                            var rowconfigdata = obj.data;
                            if (obj.event === 'questiondel') {
                                layer.confirm('确定删除？', function (index) {
                                    if (rowconfigdata.id != "") {
                                        var models = [];
                                        models.push({ 
                                            Id: rowconfigdata.id, 
                                            ContentId: rowconfigdata.contentId, 
                                            FirstAbilityId: rowconfigdata.firstAbilityId,
                                            SecondAbilityId: rowconfigdata.secondAbilityId,
                                            CourseId: rowconfigdata.courseChildDto.courseId,
                                            ChildCourseId: obj.data.childCourseId
                                        });
                                        common.ajax(setter.apiAddress.coursechildconfig.deleteconfig, "POST", "", { models: models }, function (res) {
                                            if (res.statusCode == 200) {
                                                layer.close(index);
                                                table.reload('configId');
                                            }
                                            layer.msg(res.message);
                                        });
                                    } else { layer.msg("删除数据异常"); }
                                });
                            } else if (obj.event === 'setorder') {
                                layer.open({
                                    title: "内容排序"
                                    , resize: false
                                    , content: '<input type="text" id="displayOrder" value="' + rowconfigdata.displayOrder + '" name="DisplayOrder" placeholder="请输入数字" class="layui-input">'
                                    , btn: ['确定', '取消']
                                    , yes: function (index, layero) {
                                        var order = $("#displayOrder").val();
                                        var reg = /^[-+]?\d*$/;
                                        if (!reg.test(order) || order < 0 || order > 99) {
                                            layer.tips("请输入0-99的整数", '#displayOrder');
                                            return false;
                                        } else {
                                            if (order == "") {
                                                layer.msg('内容不能为空');
                                                return false;
                                            }
                                            common.ajax(setter.apiAddress.coursechildconfig.updatedispayorder, "POST", "", { Id: rowconfigdata.id, ChildCourseId: rowconfigdata.childCourseId, DisplayOrder: order }, function (res) {
                                                if (res.statusCode == 200) {
                                                    layer.close(index);
                                                    table.reload('configId');
                                                }
                                                layer.msg(res.message);
                                            });
                                        }
                                    }
                                });
                            } else if (obj.event === 'num') {
                                layer.open({
                                    title: "内容次数"
                                    , resize: false
                                    , content: '<input type="text" id="executionsNumber" value="' + rowconfigdata.executionsNumber + '" name="ExecutionsNumber" placeholder="请输入数字" class="layui-input">'
                                    , btn: ['确定', '取消']
                                    , yes: function (index, layero) {
                                        var nums = $("#executionsNumber").val();
                                        var reg = /^[-+]?\d*$/;
                                        if (!reg.test(nums) || nums < 1 || nums > 99) {
                                            layer.tips("请输入1-99的整数", '#executionsNumber');
                                            return false;
                                        } else {
                                            if (nums == "") {
                                                layer.msg('内容不能为空');
                                                return false;
                                            }
                                            common.ajax(setter.apiAddress.coursechildconfig.setexecutionsnumber, "POST", "", { Id: rowconfigdata.id, ChildCourseId: rowconfigdata.childCourseId, ExecutionsNumber: nums }, function (res) {
                                                if (res.statusCode == 200) {
                                                    layer.close(index);
                                                    table.reload('configId');
                                                }
                                                layer.msg(res.message);
                                            });
                                        }
                                    }
                                });
                            }
                        });
                        //能力选择
                        var pageInit = {
                            initabtype: function (id) {
                                common.ajax(setter.apiAddress.ability.selname, "GET", "", { level: 0 }, function (res) {
                                    common.select(id, res.data, "", 1);
                                    form.render("select");
                                });
                            },
                            initFirstAbilities: function (data, fad, sad) {
                                $("#" + fad + "").empty();
                                $("#" + sad + "").empty();
                                if (data.value != "") {
                                    common.ajax(setter.apiAddress.ability.selname, "GET", "", { pid: data.value }, function (res) {
                                        common.select(fad, res.data, "", 1);
                                        form.render("select");
                                    });
                                } else {
                                    common.select(fad, [{ id: "", name: "" }], 1, 1);
                                    common.select(sad, [{ id: "", name: "" }], 1, 1);
                                    form.render("select");
                                }
                            },
                            initSecondAbilities: function (data, sad) {
                                $("#" + sad + "").empty();
                                if (data.value != "") {
                                    common.ajax(setter.apiAddress.ability.selname, "GET", "", { pid: data.value }, function (res) {
                                        common.select(sad, res.data, "", 1);
                                        form.render("select");
                                    });
                                } else {
                                    common.select(sad, [{ id: "", name: "" }], 1, 1);
                                    form.render("select");
                                }
                            }
                        };
                        //切换
                        element.on('tab(childcourse-tab)', function (data) {
                            if (data.index == 1) {
                                $("#atp").empty();
                                $("#fad").empty();
                                $("#sad").empty();
                                $("#evalutionatp").empty();
                                $("#evalutionfad").empty();
                                $("#evalutionsad").empty();
                                $("#taingameatp").empty();
                                $("#taingamefad").empty();
                                $("#taingamesad").empty();
                                //题目壳列表
                                table.render({
                                    elem: '#questions-group-table'
                                    , id: 'quesitionId'
                                    , url: setter.apiAddress.questiongroup.pagelist
                                    , cols: [[
                                        { type: 'checkbox' },
                                        { field: 'name', title: '名称' },
										{ field: 'abilityType', title: '能力类型' },
                                        { field: 'firstAbility', title: '一级能力' },
                                        { field: 'secondAbility', title: '二级能力' },
                                        { field: 'version', title: '版本' },
                                        {
                                            field: 'id', title: '年龄范围', templet: function (d) {
                                                return d.minAge + "~" + d.maxAge + "岁";
                                            }
                                        },
                                        {
                                            field: 'status', title: '状态', align: 'center', width: 100,
                                            templet: function (d) { return d.status == 1 ? '<span style="color:#009688;">上架</span>' : '<span style="color:#FF5722;">下架</span>'; }
                                        }
                                    ]]
                                    , page: true
                                    , where: { childcourseId: rowdata.id, status: 1 }
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
                                //获取能力类型
                                pageInit.initabtype("questionability");
                                //获取一级能力
                                form.on('select(topfilter)', function (data) {
                                    pageInit.initFirstAbilities(data, "questionfirstabilitty", "questionsecondability");
                                });
                                //获取二级能力
                                form.on('select(firstfilter)', function (data) {
                                    pageInit.initSecondAbilities(data, "questionsecondability");
                                });
                                //搜索
                                form.on('submit(questiongroup-search)', function (data) {
                                    //执行重载
                                    table.reload('quesitionId', {
                                        where: {
                                            abilityTypeId: $("#questionability").val(),
                                            firstAbilityId: $("#questionfirstabilitty").val(),
                                            secondAbilityId: $("#questionsecondability").val()
                                        },
                                        page: {
                                            curr: 1 //重新从第 1 页开始
                                        }
                                    });
                                });
                                //操作
                                $('.layui-btn.btn-questions-group').on('click', function () {
                                    var checkStatus = table.checkStatus('quesitionId');
                                    if (checkStatus.data.length > 0) {
                                        layer.confirm('一共选择' + checkStatus.data.length + '个题目壳，确定添加？', function (index) {
                                            var models = [];
                                            var questiondata = checkStatus.data;
                                            for (var i = 0; i < questiondata.length; i++) {
                                                models.push({
                                                    ChildCourseId: rowdata.id,
                                                    ContentId: questiondata[i].id,
													                          ContentType: "3",//内容类别 1-测评游戏 2-训练游戏 3-题目壳
                                                    AbilityTypeId: questiondata[i].abilityTypeId,
                                                    FirstAbilityId: questiondata[i].firstAbilityId,
                                                    SecondAbilityId: questiondata[i].secondAbilityId,
                                                    courseType: obj.data.courseClass
                                                });
                                            }
                                            configsave(models);
                                        });
                                    } else {
                                        layer.msg("请选择题目壳信息");
                                    }
                                });
                            }
                            else if (data.index == 2) {
                                $("#atp").empty();
                                $("#fad").empty();
                                $("#sad").empty();
                                $("#evalutionatp").empty();
                                $("#evalutionfad").empty();
                                $("#evalutionsad").empty();
                                $("#taingameatp").empty();
                                $("#taingamefad").empty();
                                $("#taingamesad").empty();
                                //测评游戏列表
                                table.render({
                                    elem: '#evaluationgame-table'
                                    , id: 'evaluationgameId'
                                    , url: setter.apiAddress.evaluationgame.list
                                    , cols: [[
                                        { type: 'checkbox' },
                                        { field: 'name', title: '游戏名称' },
                                        {
                                            field: 'code', title: '算分码', templet: function (d) {
                                                if (d.exerciseCalculateCode == null) {
                                                    return "";
                                                }
                                                return d.exerciseCalculateCode;
                                            }
                                        },
                                        { field: 'abilityType', title: '能力类型' },
                                        { field: 'firstAbility', title: '一级能力' },
                                        { field: 'secondAbility', title: '二级能力' },
                                        { field: 'agegroup', title: '年龄段(岁)', align: 'center', templet: function (d) { return d.minAge + '-' + d.maxAge; } },
                                        { field: 'normCount', title: '常模数', align: 'center' },
                                        {
                                            field: 'status', title: '状态', align: 'center', templet: function (d) {
                                                return d.status == 1 ? '<span style="color:#009688;">上架</span>' : '<span style="color:#FF5722;">下架</span>';
                                            }
                                        }
                                    ]]
                                    , page: true
                                    , where: { childcourseId: rowdata.id, status: 1 }
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
                                //获取能力类型
                                pageInit.initabtype("evalutionatp");
                                //获取一级能力
                                form.on('select(evalutiontopfilter)', function (data) {
                                    pageInit.initFirstAbilities(data, "evalutionfad", "evalutionsad");
                                });
                                //获取二级能力
                                form.on('select(evalutionfirstfilter)', function (data) {
                                    pageInit.initSecondAbilities(data, "evalutionsad");
                                });
                                //搜索
                                form.on('submit(evaluationconfig-search)', function (data) {
                                    table.reload('evaluationgameId', {
                                        where: {
                                            abilityTypeId: $("#evalutionatp").val(),
                                            firstAbilityId: $("#evalutionfad").val(),
                                            secondAbilityId: $("#evalutionsad").val()
                                        },
                                        page: {
                                            curr: 1 //重新从第 1 页开始
                                        }
                                    });
                                });
                                //选择框
                                $('.layui-btn.btn-evaluationconfig-group').on('click', function () {
                                    var checkStatus = table.checkStatus('evaluationgameId');
                                    if (checkStatus.data.length > 0) {
                                        layer.confirm('一共选择' + checkStatus.data.length + '个测评游戏，确定添加？', function (index) {
                                            var models = [];
                                            var evaluationdata = checkStatus.data;
                                            for (var i = 0; i < evaluationdata.length; i++) {
                                                models.push({
                                                    ChildCourseId: rowdata.id,
                                                    ContentId: evaluationdata[i].id, 
                                                    ContentType: "1",
                                                    AbilityTypeId: evaluationdata[i].abilityTypeId,
                                                    FirstAbilityId: evaluationdata[i].firstAbilityId,
                                                    SecondAbilityId: evaluationdata[i].secondAbilityId,
                                                    courseType: obj.data.courseClass
                                                });
                                            }
                                            configsave(models);
                                        });
                                    } else {
                                        layer.msg("请选择测评游戏");
                                    }
                                });

                            } else if (data.index == 3) {
                                $("#atp").empty();
                                $("#fad").empty();
                                $("#sad").empty();
                                $("#evalutionatp").empty();
                                $("#evalutionfad").empty();
                                $("#evalutionsad").empty();
                                $("#taingameatp").empty();
                                $("#taingamefad").empty();
                                $("#taingamesad").empty();
                                //训练游戏列表
                                table.render({
                                    elem: '#traingame-table'
                                    , id: 'traingameId'
                                    , url: setter.apiAddress.traingame.list
                                    , cols: [[
                                        { type: 'checkbox' },
                                        { field: 'name', title: '游戏名称' },
                                        { field: 'abilityType', title: '能力类型' },
                                        { field: 'firstAbility', title: '一级能力' },
                                        { field: 'secondAbility', title: '二级能力' },
                                        { field: 'agegroup', title: '年龄段(岁)', align: 'center', templet: function (d) { return d.minAge + '-' + d.maxAge; } },
                                        {
                                            field: 'status', title: '状态', align: 'center', templet: function (d) {
                                                return d.status == 1 ? '<span style="color:#009688;">上架</span>' : '<span style="color:#FF5722;">下架</span>';
                                            }
                                        }
                                    ]]
                                    , page: true
                                    , where: { childcourseId: rowdata.id, status: 1 }
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
                                //获取能力类型
                                pageInit.initabtype("taingameatp");
                                //获取一级能力
                                form.on('select(taingametopfilter)', function (data) {
                                    pageInit.initFirstAbilities(data, "taingamefad", "taingamesad");
                                });
                                //获取二级能力
                                form.on('select(taingamefirstfilter)', function (data) {
                                    pageInit.initSecondAbilities(data, "taingamesad");
                                });
                                //搜索
                                form.on('submit(taingame-search)', function (data) {
                                    //执行重载
                                    table.reload('traingameId', {
                                        where: {
                                            abilityTypeId: $("#taingameatp").val(),
                                            firstAbilityId: $("#taingamefad").val(),
                                            secondAbilityId: $("#taingamesad").val()
                                        },
                                        page: {
                                            curr: 1 //重新从第 1 页开始
                                        }
                                    });
                                });

                                //选择框
                                $('.layui-btn.btn-traingame-group').on('click', function () {
                                    var checkStatus = table.checkStatus('traingameId');
                                    if (checkStatus.data.length > 0) {
                                        layer.confirm('一共选择' + checkStatus.data.length + '个训练游戏，确定添加？', function (index) {
                                            var models = [];
                                            var traingamedata = checkStatus.data;
                                            for (var i = 0; i < traingamedata.length; i++) {
                                                models.push({
                                                    ChildCourseId: rowdata.id,
                                                    ContentId: traingamedata[i].id,
                                                    ContentType: "2",
                                                    AbilityTypeId: traingamedata[i].abilityTypeId,
                                                    FirstAbilityId: traingamedata[i].firstAbilityId,
                                                    SecondAbilityId: traingamedata[i].secondAbilityId,
                                                    courseType: obj.data.courseClass
                                                });
                                            }
                                            configsave(models);
                                        });
                                    } else {
                                        layer.msg("请选择训练游戏");
                                    }
                                });
                            }
                        });
                        function configsave(models) {
                            common.ajax(setter.apiAddress.coursechildconfig.addconfig, "POST", "", { models: models }, function (res) {
                                if (res.statusCode == 200) {
                                    element.tabChange('childcourse-tab', '0');
                                    table.reload('configId');
                                }
                                layer.msg(res.message);
                            });
                        }
                    });
                }
            });
        }
        else if (obj.event === 'configweight') {
            //渲染权重列表
            admin.popup({
                title: '配置权重'
                , area: ['80%', '92%']
                , resize: true
                , success: function (layero, index) {
                    view(this.id).render('content/childrencourse/configweight', rowdata).done(function () {
                        //权重列表
                        treeGrid.render({
                            id: "configweight-table"
                            , elem: '#configweight-table'
                            , url: setter.apiAddress.coursechildconfig.configweight
                            , idField: 'id'
                            , treeId: 'id'
                            , treeUpId: 'parentId'
                            , treeShowName: 'name'
                            , isFilter: false
                            , iconOpen: false
                            , isOpenDefault: true
                            , loading: true
                            , method: 'get'
                            , isPage: false
                            , height: 'full-200'
                            , cols: [[
                                { field: 'name', title: '能力维度' },
                                {
                                    field: 'contentType', title: '类别', templet: function (d) {
                                        if (d.contentType == 1) { return "测评游戏" } else if (d.contentType == 2) {
                                            return "训练游戏"
                                        } else if (d.contentType == 3) {
                                            return "题目壳"
                                        } else if (d.contentType == 4) {
                                            return "一级能力"
                                        } else if (d.contentType == 5) {
                                            return "二级能力"
                                        }
                                    }
                                },
                                {
                                    field: 'weight', title: '设置权重', edit: 'text'
                                }
                            ]]
                            , where: { childcourseId: rowdata.id }
                            , text: {
                                none: '暂无相关数据'
                            }
                            , response: {
                                statusCode: 200
                            }
                            , parseData: function (res) {
                                if (res.statusCode == 200) {
                                    if (res.data.length == 0) {
                                        res.message = "暂无相关数据";
                                    }
                                    return {
                                        "code": res.statusCode,
                                        "msg": res.message,
                                        "data": res.data
                                    };
                                } else {
                                    return { "msg": "数据异常" }
                                }

                            }
                        });
                        treeGrid.on('edit(configweight-table)', function (obj) {
                            console.log(obj)
                            var data = obj.data;
                            if (new RegExp("^[0-9]*$").test(obj.value)) {
                                var weightmodels = {};
                                if (data.contentType == 1 || data.contentType == 2 || data.contentType == 3) {
                                    weightmodels = {
                                        CourseId: rowdata.id,
                                        WeightType: data.contentType,
                                        AbilityId: "",
                                        ChildAbilityId: "",
                                        GameId: data.contentId,
                                        Weight: obj.value
                                    };
                                } else if (data.contentType == 4) {
                                    weightmodels = {
                                        CourseId: rowdata.id,
                                        WeightType: data.contentType,
                                        AbilityId: data.id,
                                        ChildAbilityId: "",
                                        GameId: "",
                                        Weight: obj.value
                                    };
                                } else if (data.contentType == 5) {
                                    weightmodels = {
                                        CourseId: rowdata.id,
                                        WeightType: data.contentType,
                                        AbilityId: "",
                                        ChildAbilityId: data.id,
                                        GameId: "",
                                        Weight: obj.value
                                    };
                                }
                                common.ajax(setter.apiAddress.coursechildconfig.addweight, "POST", "", { weight: obj.value, id: data.weightId }, function (res) {
                                    if (res.statusCode == 200) {
                                        treeGrid.reload('configweight-table');
                                    }
                                    layer.msg(res.message);
                                });
                            } else { 
                                // layer.msg("请输入大于0数字"); 
                                // treeGrid.reload('configweight-table');
                                layer.open({
                                    content: '请输入大于0数字'
                                    ,btn: ['确定']
                                    ,yes: function(index, layero){
                                      //按钮【按钮一】的回调
                                      treeGrid.reload('configweight-table');
                                    }
                                    ,cancel: function(){ 
                                      //右上角关闭回调
                                      treeGrid.reload('configweight-table');
                                      //return false 开启该代码可禁止点击该按钮关闭
                                    }
                                  });
                            }
                        });
                    });
                }
            });


        }
    });
    exports('childrencourse', {})
});