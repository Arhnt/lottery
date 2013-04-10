Ext.define('Loto.view.Sessions', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.sessions',
    title: 'Сессии',
    store: 'sessionsStore',
    stateful: true,
    dockedItems: [{
      dock: 'top',
      xtype: 'toolbar',
      items: [
        {
          action: 'pay',
          tooltip: 'Отметить сессию как оплаченую',
          text: 'Отметить оплачено',
          pressed: false
        }
      ]
    }],
    columns: [
      {
        text     : 'ID',
        dataIndex: 'id'
      },
      {
        text     : 'Создана',
        dataIndex: 'created',
        format   : 'Y-m-d H:i',
        renderer : Ext.util.Format.dateRenderer('Y-m-d H:i'),
        flex	 : 1
      },
      {
        text     : 'Пользователь',
        dataIndex: 'user',
        renderer : function(value, meta, record) 
                    {
                        var user_id = record.get('user_id');
                        var users = Ext.data.StoreManager.lookup('User');
                        var user = users.getById(user_id);
                        if(user)
                        {
                            return user.get('asfn_id');
                        }
                        return user_id;
                    }
      },
      {
        text     : 'Билеты',
        dataIndex: 'tickets',
        renderer : function(value, meta, record)
                    {
                    	return record.tickets().count();
                    }
      },
      {
        text     : 'Стоимость',
        dataIndex: 'price',
        renderer : function(value, meta, record)
                    {
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
          text     : 'Дата оплаты',
          dataIndex: 'paid',
          format   : 'Y-m-d H:i',
          renderer : Ext.util.Format.dateRenderer('Y-m-d H:i'),
          flex	   : 1
      },
      {
        text     : 'Ключ оплаты',
        dataIndex: 'key',
        sortable : false,
        flex	 : 1
      }
    ]
});
  