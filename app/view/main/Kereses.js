Ext.define('feladat.view.main.Kereses', {
    extend: 'Ext.panel.Panel',
    controller: 'main',
    // Uncomment to give this component an xtype 
    xtype : 'feladat-kereses', 
    requires: [
        'feladat.store.Feladatok',
        'feladat.view.main.Feladatok'
    ],
    
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        items: [
            {
                xtype: 'button',
                text: 'Keresés',
                handler: 'Kereses'

            },
            {
                xtype: 'button',
                text: 'Kiürítés',
                handler: 'Kiurites'
            }
        ]
    }],

    items: [{
        xtype: 'container',
        layout: 'form',
        items: [
            {
                xtype: 'textfield',
                fieldLabel: 'Ügyintéző', 
                name: 'ui_nev',
                id: 'ui_nev',
                labelAlign: 'top',
                cls: 'field-margin',
                flex: 1
            }, 
            {
                xtype: 'textfield',
                fieldLabel: 'Leírás',
                name: 'fe_leiras',
                id: 'fe_leiras',
                labelAlign: 'top',
                cls: 'field-margin',
                flex: 1       
            },
            {
                xtype: 'datefield',
                fieldLabel: 'Létrehozás dátuma', 
                name: 'lh_datuma',
                id: 'lh_datuma',
                format: 'Y.m.d.',
                placeholder: 'ÉÉÉÉ.hh.nn.',
                labelAlign: 'top',
                cls: 'field-margin',
                flex: 1
            },
        ]
        
    }],

   


});