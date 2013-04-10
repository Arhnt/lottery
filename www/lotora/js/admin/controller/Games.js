Ext.define('Loto.controller.Games', {
    extend: 'Ext.app.Controller',
    views: [ 'Games' ],
    models: [ 'Game' ],
    stores: [ 'User' ],
    init: function()
    {
        this.control({
            'games': {
                selectionchange: this._selectGame
            }
        })
    },
    
    _selectGame: function(selection, rows)
    {
        var record = rows[0].tickets();
        var gameTickets = selection.view.up("tabpanel").down("playedTickets");
        gameTickets.store.loadData(record.data.items);

        var users = selection.view.up("tabpanel").down("users");
        users.store.removeAll();
        users.store.model = 'Loto.model.User';
        var userIds = rows[0].get('winners').split(",");
        var store = Ext.data.StoreManager.lookup('User');
        for(var i = 0; i < userIds.length; i++)
        {
            var user = store.findRecord('asfn_id', userIds[i], 0, false, true, true);
            user.internalId = i;
            users.store.add(user);
        }
    }
});