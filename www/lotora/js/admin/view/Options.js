Ext.define('Loto.view.Options', {
    extend: 'Ext.FormPanel',
    alias: 'widget.options',
    title: 'Настройки',
    frame: true,
    fieldDefaults: {
    	labelAlign: 'left',
    	labelWidth: 200,
    	anchor: '100%'
    },
    defaultType: 'textfield',
    buttonAlign: 'left',
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
            action: 'runGame'
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
        	  name: 'autoGame'
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
        	tipText: function(thumb)
        	{
        		return String(thumb.value) + '%';
        	},
        },
        defaultType: 'sliderfield',
        items: [
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
    	action: 'save'
    }]
  });
 