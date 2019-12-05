/**
 @Name：系统角色权限管理
 */
layui.define(['form', 'common', 'setter', 'treeGrid', 'element'], function (exports) {
    var $ = layui.$
        , admin = layui.admin
        , view = layui.view
        , common = layui.common
        , setter = layui.setter
        , treeGrid = layui.treeGrid
        , element = layui.element
        , form = layui.form;

    treeGrid.set({ headers: { Authorization: "Bearer " + sessionStorage.access_token } });

    var buttonView = {
        buttons: [],
        permission_submit: [],
        permission_temp: [],
        initPage: function () {
            //初始化表格前先加载所有按钮，避免表格完成渲染完成后没有按钮的问题
            // common.ajax(setter.apiAddress.modulebuttons.loadall, "Get", "", "", function (res) {
            //     console.log(res)
            //     buttonView.buttons = res.data;
            //     buttonView.initTable();
            // });
            common.ajax(setter.apiAddress.SysFunction.GetSysFunctionByAppID, "Get", "", { appid:'8a7e3d91-99f9-4461-95bd-dd905ba34a3a' }, function (res) {
                buttonView.buttons = res.data;
                buttonView.initTable();
            });
            // common.ajax(setter.apiAddress.SysApplicationModule.getModulesByApplicationId, "Get", "", { applicationId:'8a7e3d91-99f9-4461-95bd-dd905ba34a3a' }, function (res) {
            //     console.log(res)
            // });
            // common.ajax(setter.apiAddress.SysFunction.pagelist, "Get", "", { applicationId:'8a7e3d91-99f9-4461-95bd-dd905ba34a3a' }, function (res) {
            //     console.log(res)
            //     buttonView.buttons = JSON.parse(res.data.jsonList);
            //     buttonView.initTable();
            // });
        },
        generateButtons: function (moduleId) {
            console.log(moduleId)
            var buttonArr = [];
            // console.log(buttonView.buttons)
            $.each(buttonView.buttons, function (index, item) {
                console.log(item)
                if (item.moduleId == moduleId) {
                    buttonArr.push('<input value="' + item.id + '" lay-filter="button-permission-filter" class="' + moduleId + '" moduleId="' + moduleId + '" id="btn_' + item.id + '" type="checkbox" name="' + item.actionName + '" title="' + item.name + '">');
                }
            });
            return buttonArr;
        },
        initTable: function () {
            //初始化角色权限的系统模块树型表格
            treeGrid.render({
                id: "sysmodules-table"
                , elem: '#sysmodules-table'
                , url: setter.apiAddress.SysApplicationModule.pagelist
                , where: {
                    applicationId: '8a7e3d91-99f9-4461-95bd-dd905ba34a3a'
                }
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
                , height: 'full-320'
                , cellMinWidth: 80
                , cols: [[
                    { field: 'name', title: '模块', sort: false, width: 200 },
                    {
                        field: 'id', title: '权限',
                        templet: function (d) {
                          return buttonView.generateButtons(d.parentId).join('');
                        }
                    }
                ]]
                , done: function (res, page, count) {
                    common.ajax(setter.apiAddress.rolepermission.getauthorize, "POST", "", { roleId: layui.router().search.role }, function (res) {
                        console.log(res)
                        $.each(res.data, function (index, item) {
                            var exist_permission = {
                                roleId: item.roleId,
                                moduleId: item.moduleId,
                                functionId: item.functionId,
                                // claimValue: item.claimValue
                            };
                            buttonView.permission_submit.push(exist_permission);
                            $("input[type='checkbox'][value='" + item.functionId + "']").prop("checked", true);
                            form.render('checkbox');
                        });
                    });
                }
                , response: {
                    statusCode: 200
                }
                , parseData: function (res) {
                    console.log(res)
                    return {
                      "code": res.statusCode,
                      "msg": res.message,
                      "data": res.data
                    };
                }
            });
        }
    };

    //初始化页面
    buttonView.initPage();

    form.on('checkbox(button-permission-filter)', function (data) {
        var current_permission = {
            roleId: layui.router().search.role,
            moduleId: $(data.elem).attr("moduleid"),
            functionId: data.value,
            // claimValue: $(data.elem).attr("name")
        };
        if (data.elem.checked) {
            buttonView.permission_submit.push(current_permission);
        } else {
            buttonView.permission_temp = [];
            for (var i = 0; i < buttonView.permission_submit.length; i++) {
                var item = buttonView.permission_submit[i];
                if (item.functionId != current_permission.functionId) {
                    buttonView.permission_temp.push(item);
                }
            }
            buttonView.permission_submit = buttonView.permission_temp;
        }
    //   console.log(buttonView, data)
    });

    //保存角色权限设置
    var active = {
        add: function () {
            //获取所有选中的数据
            //var checkStatus = treeGrid.checkStatus('sysmodules-table'), data = checkStatus.data;
            //layer.alert(JSON.stringify(data));
            // roleId: layui.router().search.role, 
            common.ajax(setter.apiAddress.rolepermission.edit, "POST", "", { models: buttonView.permission_submit }, function (res) {
                layer.msg(res.message);
            });
        }
    };

    //监听保存权限事件
    $('.layui-btn.btn-save-permissions').on('click', function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });

    exports('permissionsettings', {})
});