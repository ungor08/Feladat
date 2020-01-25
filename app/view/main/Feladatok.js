/**
 * This view is an example list of people.
 */
Ext.define('feladat.view.main.Feladatok', {
    extend: 'Ext.grid.Panel',
    xtype: 'mainlist',
    id: 'feladatokgrid',
    controller: 'main',
    requires: [
        'feladat.store.Feladatok'
    ],

    region: 'center',
    flex: 1,
    layout: 'fit',
    split: true,

    plugins: {
        gridfilters: true
    },
        bbar: {
        xtype: 'pagingtoolbar',
        displayinfo: true
    },
    
    title: 'Feladatok',

    store: {
        type: 'feladatok'
    },
   
    columns: [
        {
            text: 'Azonosító',
            dataIndex: 'feladat_azonosito',
            editable: false,
            flex: 0.5,
            cell: {userCls: 'bold'}
        },
        {
            text: 'Ügyintéző neve',
            dataIndex: 'ugyintezo_nev',
            editable: false, 
            flex: 1,
        },
        {
            text: 'Ügyintéző e-mail',
            dataIndex: 'ugyintezo_email',
            editable: false,
            flex: 1,
            renderer: function(value) {
                return Ext.String.format('<a href="mailto:{0}">{1}</a>', value, value);
            }
        },
        {
            text: 'Létrehozás dátuma',
            dataIndex: 'letrehozas_datuma',
            xtype: 'datecolumn',   
            // format:'Y.m.d.',
            editable: false,
            flex: 1,
        },
        {
            text: 'Leírás',
            dataIndex: 'feladat_leiras',
            editable: false,
            flex: 1,
        }
    ],

    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        items: [
            {
                xtype: 'button',
                text: 'Új feladat',
                handler: 'UjFeladat'

            },
            {
                xtype: 'button',
                text: 'Módosítás',
                handler: 'Modositas'
            },
            {
                xtype: 'button',
                text: 'Törlés',
                handler: 'Torles'
            }
        ]
    }],

    
    // listeners: {
    //     select: 'onItemSelected'
    // },
});
