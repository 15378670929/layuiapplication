/**
 @Name：系统角色
 */
layui.define(['table', 'form', 'common', 'setter', 'laydate', 'verification'], function (exports) {
  var $ = layui.$
      , admin = layui.admin
      , view = layui.view
      , table = layui.table
      , common = layui.common
      , setter = layui.setter
      , laydate = layui.laydate
      , verification = layui.verification
      , form = layui.form;

  table.render({
      elem: '#application-table'
      , url: setter.apiAddress.SysApplication.loadall
      , cols: [[
          { type: 'checkbox' },
          { field: 'applicationName', title: '应用名称' },
          { field: 'description', title: '描述' },
          { field: 'enabled', title: '状态', templet: function(d) {
              return d.enabled ? '<span style="color:#009688;">启用</span>' : '<span style="color:#FF5722;">禁用</span>';
            } 
          },
          {
              width: 200,
              title: '操作',
              align: 'center',
              templet: function (d) {
                console.log(d.enabled)
                var htmlButton = new Array();
                htmlButton.push('<div class="layui-btn-group">')
                htmlButton.push('<a class="layui-btn layui-btn-normal layui-btn-xs" lay-event="edit"><i class="layui-icon layui-icon-edit"></i>编辑</a>');
                if (d.enabled) {
                  htmlButton.push('<a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="changestatus"><i class="layui-icon layui-icon-close"></i>禁用</a>');
                } else {
                  htmlButton.push('<a class="layui-btn layui-btn-warm layui-btn-xs" lay-event="changestatus"><i class="layui-icon layui-icon-ok"></i>启用</a>');
                }
                htmlButton.push('<a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="delete"><i class="layui-icon layui-icon-set-fill"></i>删除</a>');
                htmlButton.push('</div>')
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
              "count": res.data.length,
              "data": res.data
          };
      }
  });



  //claims
  table.on('tool(application-table)', function (obj) {
      var data = obj.data;
      console.log(data)
      // 是否禁用
      if (obj.event === 'changestatus') {
        var titletext = "确认禁用？";
        if (!data.enabled) {
            titletext = "确认启用？";
        }
        layer.confirm(titletext, { icon: 3, title: '提示' }, function (index) {
            common.ajax(setter.apiAddress.SysApplication.updatestatus, "POST", "", { 
              id: data.id, 
              ApplicationName: data.applicationName,
              Description: data.description,
              Enabled: !data.enabled
            }, function (res) {
                console.log(res)
                if (res.statusCode == 200) {
                    layer.close(index);
                    table.reload('application-table');
                }
                layer.msg(res.message);
            });
        });
      } else if (obj.event === 'edit') {
          admin.popup({
            title: '编辑'
            , area: ['500px', '30%']
            , resize: true
            , success: function (layero, index) {
                view(this.id).render('settings/application/edit', data).done(function () {
                    $("input[name=enabled][value=true]").attr("checked", data.enabled == true ? true : false);
                    $("input[name=enabled][value=false]").attr("checked", data.enabled == false ? true : false);
                    form.render();
                    //监听提交
                    form.on('submit(application-form-submit)', function (data) {
                        common.ajax(setter.apiAddress.SysApplication.updata, "POST", "", $('#application-edit-form').serialize(), function (res) {
                            if (res.statusCode == 200) {
                                layer.close(index);
                                table.reload('application-table');
                            }
                            layer.msg(res.message);
                        });
                    });
                });
              }
          });
      } else if (obj.event === 'delete') {
        layer.confirm('确定删除？', function (index) {
          var models = [];
          models.push({
            Id: data.id
          })
          common.ajax(setter.apiAddress.SysApplication.delete, "POST", "", { list: models }, function (res) {
              if (res.statusCode == 200) {
                table.reload('application-table');
              }
              layer.msg(res.message);
          });
        });
      }
  });

  $("#btn-add-application").click(function () {
    admin.popup({
        title: '添加系统应用'
        , area: ['50%', '55%']
        , resize: false
        , success: function (layero, index) {
            view(this.id).render('settings/application/add').done(function () {
                form.render(null, "application-add-form");
                form.on('submit(application-form-submit)', function (data) {
                    common.ajax(setter.apiAddress.SysApplication.add, "POST", "", data.field, function (res) {
                        if (res.statusCode == 200) {
                            layer.close(index);
                            table.reload('application-table');
                        }
                        layer.msg(res.message);
                    });
                });
            });
        }
    });
  });
  $('.layui-btn.btn-configgroup').on('click', function () {
    var checkStatus = table.checkStatus('application-table');
    if (checkStatus.data.length > 0) {
        layer.confirm('一共选择' + checkStatus.data.length + '个用户，确定删除？', function (index) {
            var models = [];
            var userconfigdata = checkStatus.data;
            for (var i = 0; i < userconfigdata.length; i++) {
                models.push({ 
                  Id: userconfigdata[i].id, 
                });
            }
            common.ajax(setter.apiAddress.SysApplication.delete, "POST", "", { list: models }, function (res) {
                if (res.statusCode == 200) {
                    layer.close(index);
                    table.reload('application-table');
                }
                layer.msg(res.message);
            });
        });
    } else {
        layer.msg("请选择用户");
    }
  })

  exports('application', {})
});