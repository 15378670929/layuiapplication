/**
 @Name：系统模块管理
 */
layui.define(['form', 'common', 'setter', 'treeGrid', 'treeSelect', 'table', 'element'], function (exports) {
  var $ = layui.$
      , admin = layui.admin
      , view = layui.view
      , table = layui.table
      , common = layui.common
      , setter = layui.setter
      , treeGrid = layui.treeGrid
      , treeSelect = layui.treeSelect
      , element = layui.element
      , form = layui.form;

  treeGrid.set({ headers: { Authorization: "Bearer " + sessionStorage.access_token } });

  //系统模块树型表格
  treeGrid.render({
      id: "applicationtemplate-table"
      , elem: '#applicationtemplate-table'
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
          { field: 'name', title: '模块名称', sort: false }
          , { field: 'description', title: '描述', sort: false }
          , { field: 'redirectUri', title: '跳转地址', sort: false }
          , {
              field: 'isEnable', title: '状态', align: 'center', width: 100, sort: true,
              templet: function (d) { return d.enabled == 1 ? '<span style="color:#009688;">启用</span>' : '<span style="color:#FF5722;">禁用</span>'; }
          }
          , {
              field: 'icon', title: 'Icon', align: 'center', width: 100,
              templet: function (d) { return '<i class="layui-icon ' + d.icon + '"></i>'; }
          }
          , { field: 'displayOrder', title: '显示顺序', width: 100, sort: false, align: 'center' }
          , {
              width: 260, title: '操作', align: 'center'
              , templet: function (d) {
                console.log(d.enabled)
                  var htmlButton = new Array();
                  htmlButton.push('<a class="layui-btn layui-btn-normal layui-btn-xs" lay-event="edit"><i class="layui-icon layui-icon-edit"></i>编辑</a>');
                  htmlButton.push('<a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del"><i class="layui-icon layui-icon-delete"></i>删除</a>');
                  if (d.enabled) {
                      htmlButton.push('<a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="changestatus"><i class="layui-icon layui-icon-close"></i>禁用</a>');
                  } else {
                      htmlButton.push('<a class="layui-btn layui-btn-warm layui-btn-xs" lay-event="changestatus"><i class="layui-icon layui-icon-ok"></i>启用</a>');
                  }
                  htmlButton.push('<a class="layui-btn layui-btn-normal layui-btn-xs" lay-event="buttons"><i class="layui-icon layui-icon-edit"></i>按钮</a>');
                  return htmlButton.join('');
              }
          }
      ]]
      , response: {
        statusCode: 200
      }
      , parseData: function (res) {
          return {
              "code": res.statusCode,
              "msg": res.message,
              "count": res.data.totalCount,
              "data": res.data
          };
      }
  });

  //监听模块表格事件
  treeGrid.on('tool(applicationtemplate-table)', function (obj) {
      var data = obj.data;
      console.log(obj)
      if (obj.event === 'changestatus') {
          var titletext = "确认禁用？";
          if (!data.enabled) {
              titletext = "确认启用？";
          }
          layer.confirm(titletext, { icon: 3, title: '提示' }, function (index) {
              common.ajax(setter.apiAddress.SysApplicationModule.updatestatus, "POST", "", { 
                id: data.id,
                SysApplicationId: data.SysApplicationId,
                Name: data.name,
                ParentId: data.parentId,
                Description: data.description,
                RedirectUri: data.redirectUri,
                Icon: data.icon,
                DisplayOrder: data.displayOrder,
                Enabled: !data.enabled
              }, function (res) {
                  if (res.statusCode == 200) {
                      layer.close(index);
                      treeGrid.reload('applicationtemplate-table');
                  }
                  layer.msg(res.message);
              });
          });
      } else if (obj.event === 'del') {
          layer.confirm('确定删除？', function (index) {
              var models = [];
              models.push({
                Id: data.id
              })
              common.ajax(setter.apiAddress.SysApplicationModule.delete, "POST", "", { list: models }, function (res) {
                  if (res.statusCode == 200) {
                      treeGrid.reload('applicationtemplate-table');
                  }
                  layer.msg(res.message);
              });
          });
      } else if (obj.event === "edit") {
          admin.popup({
              title: '编辑系统功能模块'
              , area: ['50%', '55%']
              , resize: false
              , success: function (layero, index) {
                  view(this.id).render('settings/applicationtemplate/edit', data).done(function () {
                    initTree("module-edit-select-tree", data.parentId, data.sysApplicationId);
                      setTimeout(() => {
                        $("input[name=enabled][value=true]").attr("checked", data.enabled == true ? true : false);
                        $("input[name=enabled][value=false]").attr("checked", data.enabled == false ? true : false);
                        form.render();
                        common.ajax(setter.apiAddress.SysApplication.loadall, "Get", "", {}, function (res) {
                          $("#edit-clientId").append("<option value=\"\">请选择应用</option>");
                          $.each(res.data, function (index, item) {
                              if (obj.data.sysApplicationId == item.id) {
                                  $("#edit-clientId").append("<option value=\"" + item.id + "\" selected=\"selected\">" + item.applicationName + "</option>");
                              } else {
                                  $("#edit-clientId").append("<option value=\"" + item.id + "\">" + item.applicationName + "</option>");
                              }
                          });
                          // console.log($("#edit-clientId").val())
                          form.render("select");
                          form.on('select', function(data){
                              initTree("module-edit-select-tree", data.parentId, data.value);
                          })
                          
                        });
                      },100)
                      

                      form.on('submit(modules-edit-form-submit)', function (data) {
                          common.ajax(setter.apiAddress.SysApplicationModule.update, "POST", "", $('#modules-edit-form').serialize(), function (res) {
                              if (res.statusCode == 200) {
                                  layer.close(index);
                                  treeGrid.reload('applicationtemplate-table');
                              }
                              layer.msg(res.message);
                          });
                      });
                  });
              }
          });
      } else if (obj.event === "buttons") {
          location.hash = '/settings/applicationtemplate/modulebuttons/module=' + data.id;
      }
  });

  //添加模块事件
  $("#btn-add-applicationtemplate").click(function () {
      admin.popup({
          title: '添加系统功能模块'
          , area: ['50%', '55%']
          , resize: false
          , success: function (layero, index) {
              view(this.id).render('settings/applicationtemplate/add').done(function () {
                  
                  common.ajax(setter.apiAddress.SysApplication.loadall, "Get", "", {}, function (res) {
                    console.log(res)
                      $("#add-clientId").append("<option value=\"\">请选择应用</option>");
                      $.each(res.data, function (index, item) {
                          $("#add-clientId").append("<option value=\"" + item.id + "\">" + item.applicationName + "</option>");
                      });
                      form.render("select");
                      form.on('select', function(data) {
                        initTree("module-select-tree", '', data.value);
                      })
                  });
                  form.render(null, "modules-add-form");
                  form.on('submit(modules-form-submit)', function (data) {
                      common.ajax(setter.apiAddress.SysApplicationModule.add, "POST", "", data.field, function (res) {
                          if (res.statusCode == 200) {
                              layer.close(index);
                              treeGrid.reload('applicationtemplate-table');
                          }
                          layer.msg(res.message);
                      });
                  });
              });
          }
      });
  });

  function initTree(elementId, nodeId, value) {
      treeSelect.render({
          elem: "#" + elementId,
          url: setter.apiAddress.SysApplicationModule.getModulesByApplicationId + '?applicationId='+value,
          type: 'get',
          placeholder: '请选择所属系统模块',
          style: {
              folder: {
                  enable: true
              },
              line: {
                  enable: true
              }
          },
          search: true,
          click: function (data) {
              console.log(data)
              $("#parentId").val(data.current.id);
              $("#add-clientId").val(value);
              $("#edit-clientId").val(value);
          },
          success: function (data) {
              treeObj = treeSelect.zTree(elementId);
              var defaultNode = { id: "00000000-0000-0000-0000-000000000000", name: "添加一级系统模块" };
              treeObj.addNodes(null, 0, defaultNode);
              if (nodeId != "") {
                  var node = treeObj.getNodeByParam('id', nodeId);
                  treeObj.selectNode(node, true);
                  treeObj.checkNode(node, true, true);
                  $(".layui-unselect").val(node.name);
              }
          }
      });
  }

  exports('applicationtemplate', {})
});