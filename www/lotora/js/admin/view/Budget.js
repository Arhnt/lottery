Ext.define('Loto.view.Budget', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.budget',
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
