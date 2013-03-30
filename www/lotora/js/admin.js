Ext.onReady(function() {
  var options = new Ext.FormPanel({
    url:'/lotora/admin/options/save/',
    frame:true,
    title: 'Настройки',
    fieldDefaults: {
      labelAlign: 'left',
      labelWidth: 200,
      anchor: '100%'
    },
    defaultType: 'textfield',
    buttonAlign: 'left',
    standardSubmit: true,
    items: [
      {
        xtype:'fieldset',
        title: 'Настройки',
        collapsible: false,
        autoHeight: true,
        width: 600,
        defaults: {
          minValue: 0,
          maxValue: 100,
          allowBlank: false
        },
        defaultType: 'numberfield',
        items: [
          {
            fieldLabel: 'Количество чисел',
            name: 'maxNumbers',
          },
          {
            fieldLabel: 'Максимальное число',
            name: 'maxNumber',
          },
          {
            fieldLabel: 'Стоимость 1 игры (ПЕ)',
            name: 'gamePrice',
            allowDecimals: true,
            decimalPrecision: 1,
            step: 0.1,
          },
          {
            fieldLabel: 'Максимальное количество игр',
            name: 'maxGames',
          }
        ]
      },
      {
        xtype:'fieldset',
        title: 'Розыгрыш',
        collapsible: false,
        autoHeight: true,
        width: 600,
        defaults: {
          allowBlank: true
        },
        items: [
          {
            xtype: 'button',
            text: 'Немедленный розыгрыш',
            handler: function() {
              Ext.Msg.confirm('Немедленный розыгрыш', 'Вы уверены что хотите провести розыгрыш сейчас?', function(btn, text){
                if (btn == 'yes'){
                  options.getForm().url = '/lotora/admin/game/run/';
                  options.getForm().submit();
                }
              });              
            }                                  
          },
          {
            xtype:'fieldset',
            title: 'Расписание',
            collapsible: false,
            autoHeight: true,
            width: 600,
            layout: 'column',
            defaults: {
              labelWidth: 90,
              allowBlank: true,
              layout: 'form',
              width: 150
            },
            items: [
              {
                xtype: 'checkbox',
                fieldLabel: 'понедельник',
                name: 'scheduleMonday'
              },
              {
                xtype: 'checkbox',
                fieldLabel: 'вторник',
                name: 'scheduleTuesday'
              },
              {
                xtype: 'checkbox',
                fieldLabel: 'среда',
                name: 'scheduleWendesday'
              },
              {
                xtype: 'checkbox',
                fieldLabel: 'четверг',
                name: 'scheduleThursday'
              },
              {
                xtype: 'checkbox',
                fieldLabel: 'пятница',
                name: 'scheduleFriday'
              },
              {
                xtype: 'checkbox',
                fieldLabel: 'суббота',
                name: 'scheduleSaturday'
              },
              {
                xtype: 'checkbox',
                fieldLabel: 'воскресенье',
                name: 'scheduleSunday'
              },
              {
                xtype: 'textfield',
                fieldLabel: 'время',
                name: 'scheduleTime'
              }
            ]
          },       
          {
            xtype: 'checkbox',
            fieldLabel: 'Автоматический розыгрыш',
            name: 'autoGame',
            handler: function(field, checked)
            {
              if(checked)
              {
                field.up("fieldset").down("textfield[name='luckyNumbers']").disable();
              }
              else
              {
                field.up("fieldset").down("textfield[name='luckyNumbers']").enable();
              }
            }
                                       
          },
          {
            xtype: 'textfield',
            fieldLabel: 'Выигрышные числа для следующего розыгрыша',
            name: 'luckyNumbers'
          },
        ]
      },
      {
        xtype:'fieldset',
        title: 'Оплата',
        collapsible: false,
        autoHeight: true,
        width: 600,
        defaults: {
        },
        items: [
          {
            xtype: 'textfield',
            fieldLabel: 'ASFN ID',
            name: 'asfnId',
            allowBlank: true
          }
        ]
      },
      {
        xtype:'fieldset',
        title: 'Бюджет',
        autoHeight: true,
        width: 600,
        layout: 'column',
        defaults: {
          layout: 'form',
          width: 500,
          minValue: 0,
          maxValue: 100,
          tipText: function(thumb) {
            return String(thumb.value) + '%';
          },
          listeners : {
            change: {scope: this, fn: balanceSliders}
          }
        },
        defaultType: 'sliderfield',
        items : [
          {
            fieldLabel: 'Приз',
            name: 'budgetPrize',
          },
          {
            xtype: 'label',
            name: 'budgetPrize',
            width: 50,
            margin: '0 0 0 15'
          },
          {
            fieldLabel: 'Затраты',
            name: 'budgetCosts'
          },
          {
            xtype: 'label',
            name: 'budgetCosts',
            width: 50,
            margin: '0 0 0 15'
          },
          {
            fieldLabel: 'Промоушен',
            name: 'budgetMarketing'
          },
          {
            xtype: 'label',
            name: 'budgetMarketing',
            width: 50,
            margin: '0 0 0 15'
          },
          {
            fieldLabel: 'Поддержка общества',
            name: 'budgetSupport'
          },
          {
            xtype: 'label',
            name: 'budgetSupport',
            width: 50,
            margin: '0 0 0 15'
          },
          {
            fieldLabel: 'Прибыль',
            name: 'budgetProfit'
          },
          {
            xtype: 'label',
            name: 'budgetProfit',
            width: 50,
            margin: '0 0 0 15'
          }
        ]
      },
      {
        xtype:'fieldset',
        title: 'Информация для пользователя',
        autoHeight: true,
        width: 600,
        defaultType: 'numberfield',
        items : [
          {
            fieldLabel: 'Всего выиграно (ПЕ)',
            name: 'totalWin',
            allowDecimals: true,
            decimalPrecision: 1,
            step: 0.1,
          },
          {
            fieldLabel: 'Последний выигрыш (ПЕ)',
            name: 'lastWin',
            allowDecimals: true,
            decimalPrecision: 1,
            step: 0.1,
          },
          {
            xtype: 'textfield',
            fieldLabel: 'Код Youtube видео',
            name: 'lastVideo'
          },
          {
            fieldLabel: 'Время жизни видео (час)',
            name: 'lastVideoLifespan',
          }
        ]
      }
    ],
    buttons: [{
      text: 'Сохранить',
      handler: function() {
        if(options.getForm().isValid())
        {
          options.getForm().submit({
            success: function(form, action) {
              Ext.Msg.alert('Success', action.result.msg);
            },
            failure: function(form, action) {
              Ext.Msg.alert('Failed', action.result.msg);
            }
          })
        }
      }
    }],
  });
 
  var sessions = Ext.create('Ext.grid.Panel', {
    title: 'Сессии',
    store: 'sessionsStore',
    stateful: true,
    dockedItems: [{
      dock: 'top',
      xtype: 'toolbar',
      items: [
        {
          tooltip: 'Отметить сессию как оплаченую',
          text: 'Отметить оплачено',
          listeners: {
            click: function() {
              var id = sessions.getSelectionModel().lastSelected.data.id;
              Ext.Ajax.request({
                url: '/lotora/admin/ajax/session/pay/' + id,
                success: function(response){
                  sessions.store.load();
                }
              });
            }
          },
          pressed: false
        }
      ]
    }],
    columns: [
      {
        text     : 'ID',
        sortable : true,
        dataIndex: 'id'
      },
      {
        text     : 'Создана',
        sortable : true,
        dataIndex: 'created',
        format   : 'Y-m-d H:i',
        renderer : Ext.util.Format.dateRenderer('Y-m-d H:i')          
      },
      {
        text     : 'Пользователь',
        sortable : true,
        dataIndex: 'user',
        renderer : function(value, meta, record){
          var user_id = record.get('user_id');
          var user = Ext.data.StoreManager.lookup('usersStore').getById(user_id);
          if(user)
          {
            return user.get('asfn_id');
          }
          return "";
        }
      },
      {
        text     : 'Билеты',
        sortable : true,
        dataIndex: 'tickets',
        renderer : function(value, meta, record){
          return record.tickets().count();
        }
      },
      {
        text     : 'Стоимость',
        sortable : true,
        dataIndex: 'price',
        renderer : function(value, meta, record){
          var price = record.get('game_price');
          if(price && (record.tickets().count() > 0))
          {
            var sum = 0;
            for(var i = 0; i < record.tickets().count(); i++)
            {
              sum += price * record.tickets().getAt(i).get('games');
            }
            return Ext.util.Format.number(sum, '0.00');
          }
          return 0;   
        }
      },
      {
        text     : 'Ключ оплаты',
        sortable : false,
        dataIndex: 'key',
      },
      {
        text     : 'Дата оплаты',
        sortable : true,
        dataIndex: 'paid',
        format   : 'Y-m-d H:i',
        renderer : Ext.util.Format.dateRenderer('Y-m-d H:i')          
      }
                            
    ]
  });
  
  var tickets = Ext.create('Ext.grid.Panel', {
    title: 'Билеты',
    store: 'ticketsStore',
    stateful: true,
    columns: [
      {
        text     : 'ID',
        sortable : true,
        dataIndex: 'id'
      },
      {
        text     : 'Числа',
        sortable : true,
        dataIndex: 'numbers',
        width    : 200
                           
      },
      {
        text     : 'Игр',
        sortable : true,
        dataIndex: 'games'
      },
      {
        text     : 'Игр осталось',
        sortable : true,
        dataIndex: 'games_left'
      }
    ]
  });
  
  var games = Ext.create('Ext.grid.Panel', {
    title: 'Розыгрыши',
    store: 'gamesStore',
    stateful: true,
    columns: [
      {
        text     : 'ID',
        sortable : true,
        dataIndex: 'id'
      },
      {
        text     : 'Дата',
        sortable : true,
        dataIndex: 'date',
        format   : 'Y-m-d H:i',
        renderer : Ext.util.Format.dateRenderer('Y-m-d H:i')          
      },
      {
        text     : 'Выигрышные числа',
        sortable : true,
        dataIndex: 'lucky_numbers',
        width    : 200
      },
      {
        text     : 'Билеты',
        sortable : true,
        dataIndex: 'tickets',
        renderer : function(value, meta, record){
          return record.tickets().count();
        }
      },
      {
        text     : 'Стоимость',
        sortable : true,
        dataIndex: 'sum'
      },
      {
        text     : 'Приз',
        sortable : true,
        dataIndex: 'prize',
      },
      {
        text     : 'Победители',
        sortable : true,
        dataIndex: 'winners',
        width    : 200
      }
    ]
  });

  var gameTickets = Ext.create('Ext.grid.Panel', {
    title: 'Билеты',
    store: 'playedTicketsStore',
    stateful: true,
    columns: [
      {
        text     : 'ID',
        sortable : true,
        dataIndex: 'id'
      },
      {
        text     : 'Пользователь',
        sortable : true,
        dataIndex: 'asfn_id'
      },
      {
        text     : 'Числа',
        sortable : true,
        dataIndex: 'numbers',
        width    : 200
                           
      },
      {
        text     : 'Угадано',
        sortable : true,
        dataIndex: 'guessed'
      }
    ]
  });

  var budget = Ext.create('Ext.grid.Panel', {
    title: 'Бюджет',
    store: 'budgetStore',
    stateful: true,
    features: [{
      ftype: 'summary'
    }],
    columns: [
      {
        text     : 'Розыгрыш',
        sortable : true,
        dataIndex: 'game_id'
      },
      {
        text     : 'Стоимость',
        sortable : true,
        dataIndex: 'sum',
        summaryType: 'sum',
        summaryRenderer: function(value, summaryData, dataIndex) {
          return Ext.util.Format.number(value, '0.00');
        }
      },
      {
        text     : 'Приз',
        sortable : true,
        dataIndex: 'prize',
        summaryType: 'sum',
        summaryRenderer: function(value, summaryData, dataIndex) {
          return Ext.util.Format.number(value, '0.00');
        }
      },
      {
        text     : 'Затраты',
        sortable : true,
        dataIndex: 'costs',
        summaryType: 'sum',
        summaryRenderer: function(value, summaryData, dataIndex) {
          return Ext.util.Format.number(value, '0.00');
        }
      },
      {
        text     : 'Промоушен',
        sortable : true,
        dataIndex: 'marketing',
        summaryType: 'sum',
        summaryRenderer: function(value, summaryData, dataIndex) {
          return Ext.util.Format.number(value, '0.00');
        }
      },
      {
        text     : 'Поддержка общества',
        sortable : true,
        dataIndex: 'support',
        summaryType: 'sum',
        summaryRenderer: function(value, summaryData, dataIndex) {
          return Ext.util.Format.number(value, '0.00');
        }
      },
      {
        text     : 'Прибыль',
        sortable : true,
        dataIndex: 'profit',
        summaryType: 'sum',
        summaryRenderer: function(value, summaryData, dataIndex) {
          return Ext.util.Format.number(value, '0.00');
        }
      }
    ]
  });

  var users = Ext.create('Ext.grid.Panel', {
    title: 'Пользователи',
    store: 'usersStore',
    stateful: true,
    columns: [
      {
        text     : 'Дата регистрации',
        sortable : true,
        dataIndex: 'created',
        format   : 'Y-m-d H:i',
        renderer : Ext.util.Format.dateRenderer('Y-m-d H:i')          
      },
      {
        text     : 'Последняя активность',
        sortable : true,
        dataIndex: 'last_seen',
        format   : 'Y-m-d H:i',
        renderer : Ext.util.Format.dateRenderer('Y-m-d H:i')          
      },
      {
        text     : 'ASFN ID',
        sortable : true,
        dataIndex: 'asfn_id'
      },
      {
        text     : 'Имя',
        sortable : true,
        dataIndex: 'name'
      },
      {
        text     : 'E-mail',
        sortable : true,
        dataIndex: 'email'
      },
      {
        text     : 'Страна',
        sortable : true,
        dataIndex: 'country'
      },
      {
        text     : 'Населенный пункт',
        sortable : true,
        dataIndex: 'city'
      }
    ]
  });

  var tabs = new Ext.TabPanel({
    renderTo: 'admin-screen',
    width: "100%",
    activeTab: 0,
    frame:true,
    defaults:{autoHeight: true},
    items:[
      options,
      {
       title: 'Розыгрыши',
       items:[
          games,
          gameTickets
       ]
      },
      {
       title: 'Сессии',
       items:[
          sessions,
          tickets
       ]
      },
      budget,
      users
    ]
  });

  
  
  options.getForm().load({
    url: '/lotora/admin/options/load/ajax/'
  });
  
  sessions.on('cellClick', function() {
    var records = sessions.getSelectionModel().lastSelected.tickets();
    tickets.store.loadData(records.data.items);
  });
  
  games.on('cellClick', function() {
    var records = games.getSelectionModel().lastSelected.tickets();
    gameTickets.store.loadData(records.data.items);
  });
  
  function balanceSliders(slider) {
    var sliders = slider.up("fieldset").query("sliderfield");
    sliders = Ext.Array.remove(sliders, slider);
    var currentSlider = slider.thumbs[0].value;
    var otherSliders = sumSliders(sliders);
    if((otherSliders + currentSlider) > 100)
    {
      slider.setValue(100 - otherSliders)
      slider.syncThumbs();
    }
    var labels = slider.up("fieldset").query("label[name='" + slider.name + "']");
    if(labels && labels.length > 0)
    {
      labels[0].update(String(slider.thumbs[0].value) + '%');
    }
  }
  
  function sumSliders(sliders)
  {
    var total = 0;
    for(var i = 0; i < sliders.length; i++)
    {
      if(!isNaN(sliders[i].thumbs[0].value))
      {
        total += sliders[i].thumbs[0].value;
      }
    }
    return total;
  }
  
}); 

