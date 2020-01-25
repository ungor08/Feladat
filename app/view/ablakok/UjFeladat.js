Ext.define('feladat.view.ablakok.UjFeladat', {
    extend: 'Ext.form.Panel',
    xtype: 'uj-feladat',

    controller: 'main',
    requires: [
        'feladat.store.Ugyintezok'
    ],

    title: 'Új Feladat',
    bodyPadding: 5,
    frame: true,
    width: 450,
    height: 250,
    alwaysOnTop: true,
    floating: true,
    closable: true,
    modal: true,
    id: 'addRecForm',
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
                labelAlign: 'top',
                cls: 'field-margin',
                flex: 1        
            }
        ]
        
    }],

    buttons: [
        {
            text   : 'Mentés',
            handler: 'mentes'
        }, 
        {
            text   : 'Mégse',
            handler: 'megse'
        }
    ]
});    


