﻿/**
 @Name：题目管理
 */
layui.define(['table', 'form', 'common', 'setter', 'verification', 'layedit', 'upload'], function (exports) {
    var $ = layui.$
        , admin = layui.admin
        , view = layui.view
        , table = layui.table
        , common = layui.common
        , setter = layui.setter
        , layedit = layui.layedit
        , upload = layui.upload
        , oidcconfig = layui.oidcconfig
        , form = layui.form;
    table.render({
        elem: '#questions-table'
        , url: setter.apiAddress.question.pagelist
        , cols: [[
            { field: 'name', title: '题目名称' },
            {
                field: 'questionTypeId', title: '题目类型',
                templet: function (d) {
                    switch (d.questionType) {
                        case 1:
                            return "单选题";
                            break;
                        case 2:
                            return "多选题";
                            break;
                        case 3:
                            return "量表题";
                            break;
                        case 4:
                            return "矩阵单选";
                            break;
                        case 5:
                            return "矩阵多选";
                            break;
                        case 6:
                            return "矩阵量表";
                            break;
                        default:
                            return "-";
                            break;
                    }
                }
            },
            { field: 'abilityTypeText', title: '能力类型' },
            { field: 'firstAbilityText', title: '一级能力' },
            { field: 'secondAbilityText', title: '二级能力' },
            { field: 'version', title: '版本', width: 100, align: 'center' },
            { field: 'degreeOfDifficulty', title: '难度系数', width: 100, align: 'center' },
            {
                field: 'createTime', width: 150, title: '创建时间', sort: true, templet: function (d) {
                    return common.formatDate(d.createTime, "yyyy-MM-dd hh:mm")
                }
            },
            {
                field: 'status', title: '状态', width: 100, align: 'center',
                templet: function (d) { return d.status == 1 ? '<span style="color:#009688;">启用</span>' : '<span style="color:#FF5722;">禁用</span>'; }
            },
            {
                width: 200, title: '操作', align: 'center'
                , templet: function (d) {
                    var htmlButton = new Array();
                    htmlButton.push('<div class="layui-btn-group">');
                    htmlButton.push('<a class="layui-btn layui-btn-normal layui-btn-xs" lay-event="edit"><i class="layui-icon layui-icon-edit"></i>编辑</a>');
                    htmlButton.push('<a class="layui-btn layui-btn-normal layui-btn-xs" lay-event="preview"><i class="layui-icon layui-icon-survey"></i>预览</a>');
                    if (d.status) {
                        htmlButton.push('<a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="changestatus"><i class="layui-icon layui-icon-close"></i>禁用</a>');
                    } else {
                        htmlButton.push('<a class="layui-btn layui-btn-warm layui-btn-xs" lay-event="changestatus"><i class="layui-icon layui-icon-ok"></i>启用</a>');
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

    //初始化页面 TO DO新增和修改合并

    //能力类型
    function initAbilityType(initVal) {
        common.ajax(setter.apiAddress.ability.selname, "GET", "", { pid: '', level: 0 }, function (res) {
            $("#abilityType").append("<option value=\"\">请选择能力类型</option>");
            $.each(res.data, function (index, item) {
                if (item.id == initVal) {
                    $("#abilityType").append("<option value=\"" + item.id + "\" selected=\"\">" + item.name + "</option>");
                } else {
                    $("#abilityType").append("<option value=\"" + item.id + "\">" + item.name + "</option>");
                }
            });
            form.render("select");
        });
    }

    function initFirstAbilities(pid, initVal) {
        $("#firstAbilities").empty();
        $("#secondAbilities").empty();
        if (pid != "") {
            common.ajax(setter.apiAddress.ability.selname, "GET", "", { pid: pid }, function (res) {
                common.select("firstAbilities", res.data, initVal, 1);
                form.render("select");
            });
        }
        else {
            $("#firstAbilities").empty();
            form.render("select");
        }
    }

    function initSecondAbilities(pid, initVal) {
        $("#secondAbilities").empty();
        if (pid != "") {
            common.ajax(setter.apiAddress.ability.selname, "GET", "", { pid: pid }, function (res) {
                common.select("secondAbilities", res.data, initVal, 1);
                form.render("select");
            });
        }
        else {
            $("#secondAbilities").empty();
            form.render("select");
        }
    }

    //添加删除事件
    function initDeleteEvent(btnId) {
        $(document).on('click', '#delete_' + btnId, function () {
            $("#tr_" + btnId).remove();
        });
    }
    function initUploadEvent(id) {
        upload.render({
            elem: '#upbtn_' + id
            , url: setter.apiAddress.image.imageupload+"?filePath=content/question/edit"
            , field: "imgFile"
            , accept: 'file'
            , size: 2048
            , exts: 'jpg|png'
            , data: { imgType: "1" }
            , before: function (obj) {
                obj.preview(function (index, file, result) {
                    $('#upimg_' + id).attr('src', result); //图片链接（base64）
                });
            }
            , done: function (res) {
                if (res.code == 200) {
                    $("#itemimg_" + id).val(res.data.src);
                    layer.msg(res.msg);
                }
            }
            , error: function () {
                //演示失败状态，并实现重传
                var demoText = $('#uptext_' + id);
                demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>');
                demoText.find('.demo-reload').on('click', function () {
                    //uploadInst.upload();
                });
            }
        });
    }

    table.on('tool(questions-table)', function (obj) {
        var data = obj.data;
        if (obj.event === 'changestatus') {
            var titletext = "确认禁用？";
            if (!data.status) {
                titletext = "确认启用？";
            }
            layer.confirm(titletext, { icon: 3, title: '提示' }, function (index) {
                common.ajax(setter.apiAddress.question.updatestatus, "POST", "", { id: data.id }, function (res) {
                    if (res.statusCode == 200) {
                        layer.close(index);
                        layui.table.reload('questions-table');
                    }
                    layer.msg(res.message);
                });
            });
        } else if (obj.event === 'preview') {
            admin.popup({
                title: '题目预览'
                , area: ['800px', '600px']
                , resize: false
                , success: function (layero, index) {
                    view(this.id).render('content/question/preview', data).done(function () {
                        form.render();
                    });
                }
            });
        } else if (obj.event === 'edit') {
            admin.popup({
                title: '编辑题目'
                , area: ['100%', '100%']
                , resize: false
                , success: function (layero, index) {
                    view(this.id).render('content/question/edit', data).done(function () {
                        $("#Name").val(data.name);

                        var questionname = layedit.build('Name'); //建立编辑器
                        //能力类型
                        initAbilityType(data.abilityTypeId);
                        //一级能力
                        initFirstAbilities(data.abilityTypeId, data.firstAbilityId);
                        //二级能力
                        initSecondAbilities(data.firstAbilityId, data.secondAbilityId);
                        //能力选择事件
                        form.on('select(abilityType-filter)', function (data) {
                            $("#firstAbilities").empty();
                            $("#secondAbilities").empty();
                            initFirstAbilities(data.value, "");
                        });
                        form.on('select(firstAbilities-filter)', function (data) {
                            $("#secondAbilities").empty();
                            initSecondAbilities(data.value, "");
                        });

                        $("#rowtitle_table").hide();
                        $("#QuestionType").val(data.questionType);
                        if (data.questionType > 3) {
                            $("#rowtitle_table").show();
                        }
                        form.render(null, 'question-edit-form');
                        var itemArr = new Array();
                        layui.each(data.questionItems, function (index, item) {
                            var rowCount = common.guid();
                            itemArr = [];
                            itemArr.push('<tr id="tr_' + rowCount + '">');
                            itemArr.push('<td>');
                            if (item.itemTitle != "null" && item.itemTitle != null) {
                                itemArr.push('<input type="text" name="itemTitle" value="' + item.itemTitle + '" autocomplete="off" maxlength="200" placeholder="请输入标题" class="layui-input">');
                            } else {
                                itemArr.push('<input type="text" name="itemTitle" value="" autocomplete="off" maxlength="200" placeholder="请输入标题" class="layui-input">');
                            }
                            itemArr.push('</td>');

                            itemArr.push('<td>');
                            itemArr.push('<input type="text" name="score" value="' + item.score + '" autocomplete="off" maxlength="2" value="0" placeholder="请输入分值" class="layui-input">');
                            itemArr.push('</td>');

                            itemArr.push('<td>');
                            itemArr.push('<select id="isRightChoice_' + rowCount + '" name="isRightChoice_' + rowCount + '"> ');
                            if (item.isRightChoice) {
                                itemArr.push('<option value = "false" >否</option >');
                                itemArr.push('<option value="true" selected>是</option>');
                            } else {
                                itemArr.push('<option value = "false" selected>否</option >');
                                itemArr.push('<option value="true">是</option>');
                            }
                            itemArr.push('</select >');
                            itemArr.push('</td>');

                            itemArr.push('<td>');
                            itemArr.push('<input type="text" name="displayOrder" value="' + item.displayOrder + '"  maxlength="1" value="0" placeholder="请输入显示顺序" class="layui-input">');
                            itemArr.push('</td>');

                            itemArr.push('<td>');
                            itemArr.push('<input type="hidden" name="itemAttachmentUrl" value="' + item.itemAttachmentUrl + '" id="itemimg_' + rowCount + '" class="layui-input">');
                            itemArr.push('<div class="layui-upload">');
                            itemArr.push('<button type="button" class="layui-btn layui-btn-xs" id="upbtn_' + rowCount + '">上传图片</button>');
                            if (item.itemAttachmentUrl != null && item.itemAttachmentUrl != "" && item.itemAttachmentUrl != "null") {
                                itemArr.push('<img class="layui-upload-img" id="upimg_' + rowCount + '" src=' + item.itemAttachmentUrl + '>');
                            } else {
                                itemArr.push('<img class="layui-upload-img" id="upimg_' + rowCount + '">');
                            }
                            itemArr.push('<p id="uptext_' + rowCount + '"></p>');
                            itemArr.push('</div>');
                            itemArr.push('</td>');

                            itemArr.push('<td>');
                            itemArr.push('<button id="delete_' + rowCount + '" type="button" class="btn-delete layui-btn layui-btn-sm layui-btn-danger" rownumber="' + rowCount + '"><i class="layui-icon layui-icon-delete"></i></button>');
                            itemArr.push('</td>');
                            itemArr.push('</tr> ');
                            $("#tbody_items").append(itemArr.join(''));
                            //初始化事件
                            initDeleteEvent(rowCount);
                            initUploadEvent(rowCount);
                            form.render();
                        });

                        form.render();
                        $("#tbody_items input[name='displayOrder']").keyup(function () {
                            var c = $(this);
                            if (/[^\d]/.test(c.val())) {
                                var temp_amount = c.val().replace(/[^\d]/g, '');
                                $(this).val(temp_amount);
                            }
                        });
                        $("#tbody_items input[name='score']").keyup(function () {
                            var c = $(this);
                            if (/[^\d]/.test(c.val())) {
                                var temp_amount = c.val().replace(/[^\d]/g, '');
                                $(this).val(temp_amount);
                            }
                        });
                        //普通图片上传
                        upload.render({
                            elem: '#uploadImg'
                            , url: setter.apiAddress.image.imageupload+"?filePath=content/question/edit"
                            , field: "imgFile"
                            , accept: 'file'
                            , size: 2048
                            , exts: 'jpg|png'
                            , data: { imgType: "1" }
                            , before: function (obj) {
                                obj.preview(function (index, file, result) {
                                    $('#showImg').attr('src', result); //图片链接（base64）
                                    $('#showImg').css('width', '80px');
                                });
                            }
                            , done: function (res) {
                                if (res.code == 200) {
                                    $("#attachmentUrl").val(res.data.src);
                                    layer.msg(res.msg);
                                }
                            }
                            , error: function (e) {
                                layer.msg("上传失败!");
                            }
                        });

                        form.render();
                        //提交数据
                        form.on('submit(question-edit-form-submit)', function () {
                            var data = {
                                Id: $("#Id").val(),
                                QuestionType: $("#QuestionType").val(),
                                Name: document.getElementById("name").value,///layedit.getContent(questionname),
                                Version: $("#Version").val(),
                                DegreeOfDifficulty: $("#DegreeOfDifficulty").val(),
                                Remark: $("#Remark").val(),
                                Analysis: $("#Analysis").val(),
                                AbilityTypeId: $("#abilityType").val(),
                                FirstAbilityId: $("#firstAbilities").val(),
                                SecondAbilityId: $("#secondAbilities").val(),
                                AttachmentUrl: $("#attachmentUrl").val(),
                                QuestionItems: [],
                            };
                            //添加选项
                            $("#tbody_items").find("tr").each(function () {
                                var tdArr = $(this).children();
                                var itemTitle = tdArr.eq(0).find('input').val();
                                if (itemTitle != "") {
                                    if (!/^[\S]{1,200}$/.test(itemTitle)) {
                                        layer.msg("题目选项必须输入1到200个字符");
                                        return;
                                    }// /^\d+(\.{1}\d+)?$/
                                }
                                var score = tdArr.eq(1).find('input').val();
                                if (! /^\d+(\.{1}\d+)?$/.test(score)) {
                                    layer.msg("分值只能是数字2到200个字符");
                                    return;
                                }
                                var isRightChoice = tdArr.eq(2).find('select').val();
                                var displayOrder = tdArr.eq(3).find('input').val() == "" ? 0 : tdArr.eq(3).find('input').val();
                                var itemAttachmentUrl = tdArr.eq(4).find('input:hidden').val();
                                if (! /^\d+(\.{1}\d+)?$/.test(score)) {
                                    layer.msg("显示顺序只能是数字");
                                    return;
                                }
                                data.QuestionItems.push({
                                    ItemTitle: itemTitle,
                                    ItemType: 0,
                                    IsRightChoice: isRightChoice,
                                    Score: score,
                                    DisplayOrder: displayOrder,
                                    ItemAttachmentUrl: itemAttachmentUrl
                                });
                            });

                            //如果是矩阵题则添加行标题
                            var questionTypeVal = $("#QuestionType").val();
                            if (questionTypeVal == 4 || questionTypeVal == 5 || questionTypeVal == 6) {
                                var rowtitles = $("#questionrowtitle").val();
                                var rowtitiesarry = $("#questionrowtitle").val().split("\n");
                                var areaRows = rowtitiesarry.length;
                                for (var i = 0; i < areaRows; i++) {
                                    data.QuestionItems.push({
                                        ItemTitle: rowtitiesarry[i],
                                        ItemType: 1,
                                        Score: 0,
                                        DisplayOrder: i + 1,
                                    });
                                }
                            }
                            if (data.QuestionItems.length <= 0) {
                                layer.msg("题目没有选项");
                                return;
                            }
                            //if ($("#attachmentUrl").val() == "") {
                            //    layer.msg("请上传图标");
                            //    return;
                            //}
                            common.ajax(setter.apiAddress.question.update, "POST", "", data, function (res) {
                                if (res.statusCode == 200) {
                                    layer.close(index);
                                    table.reload('questions-table');
                                }
                                layer.msg(res.message);
                            });
                        });
                    });
                }
            });
        }
    });
    exports('question', {})
});