Ext.define('Loto.controller.Sessions', {
    extend: 'Ext.app.Controller',
    views: [
        'Sessions'
    ],
    models: [
        'GameSession'
    ],
    init: function()
    {
        this.control({
            'sessions': {
                selectionchange: this._selectSession,
            },
            'sessions button[action=pay]': {
                click: this._paySession
            }
        })
    },

    _selectSession: function(selection, rows)
    {
	    var record = rows[0].tickets();
	    var tickets = selection.view.up("tabpanel").down("tickets");
	    tickets.store.loadData(record.data.items);
    },
    
    _paySession: function(btn)
    {
    	var id = btn.up("grid").getSelectionModel().lastSelected.getId();
        Ext.Ajax.request({
        	url: '/lotora/admin/ajax/session/pay/' + id,
        	success: function(response){
        		btn.up("grid").store.load();
        	}
        });
    }

});