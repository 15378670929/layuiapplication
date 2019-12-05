/**
 @Name：系统模块按钮管理
 */
layui.define(['form', 'common', 'setter', 'table', 'element'], function (exports) {
  var $ = layui.$
      , admin = layui.admin
      , view = layui.view
      , table = layui.table
      , common = layui.common
      , setter = layui.setter
      , element = layui.element
      , form = layui.form;

  //按钮列表
  table.render({
      elem: '#application-buttons-table'
      , url: setter.apiAddress.SysFunction.pagelist
      , cols: [[
          { field: 'name', title: '名称' },
          { field: 'functionCode', title: '功能编码' },
          { field: 'description', title: '描述' },
          {
            field: 'isEnable', title: '状态', align: 'center', width: 100,
            templet: function (d) { return d.enabled == 1 ? '<span style="color:#009688;">启用</span>' : '<span style="color:#FF5722;">禁用</span>'; }
          },
          {
              field: 'updateTime', title: '更新时间', align: 'center', width: 150,
              templet: function (d) { return common.formatDate(d.updateTime, "yyyy-MM-dd"); }
          },
          {
              width: 300, title: '操作', align: 'center'
              , templet: function (d) {
                  var htmlButton = new Array();
                  htmlButton.push('<div class="layui-btn-group">')
                  htmlButton.push('<a class="layui-btn layui-btn-normal layui-btn-xs" lay-event="edit"><i class="layui-icon layui-icon-edit"></i>编辑</a>');
                  if (d.enabled) {
                    htmlButton.push('<a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="changestatus"><i class="layui-icon layui-icon-close"></i>禁用</a>');
                  } else {
                      htmlButton.push('<a class="layui-btn layui-btn-warm layui-btn-xs" lay-event="changestatus"><i class="layui-icon layui-icon-ok"></i>启用</a>');
                  }
                  htmlButton.push('<a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del"><i class="layui-icon layui-icon-delete"></i>删除</a>');
                  htmlButton.push('</div>')
                  return htmlButton.join('');
              }
          }
      ]]
      , where: {
        ModuleId: layui.router().search.module,
      }
      , page: true
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

  //监听按钮表格事件
  table.on('tool(application-buttons-table)', function (obj) {
      var data = obj.data;
      console.log(data)
      if (obj.event === 'del') {
          layer.confirm('确定删除？', function (index) {
              var models = [];
              models.push({
                Id: data.id
              })
              common.ajax(setter.apiAddress.SysFunction.delete, "POST", "", { 
                list: models
              }, function (res) {
                  if (res.statusCode == 200) {
                      layui.table.reload('application-buttons-table');
                  }
                  layer.msg(res.message);
              });
          });
      } else if (obj.event === 'edit') {
          admin.popup({
              title: '编辑'
              , area: ['50%', '40%']
              , resize: false
              , success: function (layero, index) {
                  view(this.id).render('settings/applicationtemplate/editbutton', data).done(function () {
                      $("input[name=enabled][value=true]").attr("checked", data.enabled == true ? true : false);
                      $("input[name=enabled][value=false]").attr("checked", data.enabled == false ? true : false);
                      form.render();
                      form.on('submit(button-edit-form-submit)', function (data) {
                          common.ajax(setter.apiAddress.SysFunction.update, "POST", "", $('#button-edit-form').serialize(), function (res) {
                              if (res.statusCode == 200) {
                                  layer.close(index);
                                  layui.table.reload('application-buttons-table');
                              }
                              layer.msg(res.message);
                          });
                      });
                  });
              }
          });
      } else if (obj.event === 'changestatus') {
        var titletext = "确认禁用？";
        if (!data.enabled) {
            titletext = "确认启用？";
        }
        layer.confirm(titletext, { icon: 3, title: '提示' }, function (index) {
            common.ajax(setter.apiAddress.SysFunction.updatestatus, "POST", "", {
              id: data.id, 
              Name: data.name,
              Description: data.description,
              Enabled: !data.enabled,
              FunctionCode: data.functionCode,
              ModuleId: data.moduleId
            }, function (res) {
                console.log(res)
                if (res.statusCode == 200) {
                    layer.close(index);
                    table.reload('application-buttons-table');
                }
                layer.msg(res.message);
            });
        });
      }
  });

  exports('applicationbuttons', {})
});