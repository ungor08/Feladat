Ext.define('feladat.view.ablakok.Modositas', {
    extend: 'Ext.form.Panel',
    xtype: 'modositas',

    controller: 'main',
    requires: [
        'feladat.store.Ugyintezok'
    ],
    title: 'Módosítás',
    bodyPadding: 5,
    frame: true,
    width: 450,
    height: 250,
    alwaysOnTop: true,
    floating: true,
    closable: true,
    modal: true,
    id: 'dataRecForm',
    // defaultType: 'numberfield',

    fieldDefaults: {
        labelWidth: 110,
        anchor: '100%'
    },

    items: [{
        xtype: 'container',
        layout: 'form',
        items: [
                {
                xtype: 'combobox',
                fieldLabel: 'Ügyintéző', 
                name: 'u_azonosito',
                id: 'u_azonosito',
                queryMode: 'local',
                displayField: 'ugyintezo_nev',
                valueField: 'ugyintezo_azonosito',
                store : {
                    type : 'ugyintezok'
                },
                required: true,
                validator: function(val) {
                    return (val.trim().length > 0) ? true : "A mező kitöltése kötelező!";
                },
                labelAlign: 'top',
                cls: 'field-margin',
                flex: 1
            }, 
            {
                xtype: 'textareafield',
                fieldLabel: 'Leírás',
                id: 'f_leiras',
                maxRows: 4,
                border: true,
                name: 'feladat_leiras',
                required: true,
                validator: function(val) {
                    return (val.trim().length > 0) ? true : "A mező kitöltése kötelező!";
                },
                labelAlign: 'top',
                cls: 'field-margin',
                flex: 1        
            }
        ]
        
    }],

    buttons: [
        {
            text   : 'Módosítás',
            handler: 'modosit'
        }, 
        {
            text   : 'Mégse',
            handler: 'megse'
        }
    ]

});    


