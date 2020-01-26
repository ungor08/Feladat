Ext.define('feladat.model.Feladatok', {
    extend: 'feladat.model.Base',
    alias: 'feladatok',
    idProperty: 'feladat_azonosito',
    clientIdProperty: 'id',
    identifier: 'negative',

    fields: [
        {
            name: "feladat_azonosito", type: 'int'
        },
        {
            name: "ugyintezo_azonosito", type: 'int'
        },
        {
            name: "ugyintezo_nev", type: 'string'
        },
        {
            name: "ugyintezo_email", type: 'string'
        },
        {
            name: "letrehozas_datuma", type: 'date'
        },
        {
            name: "feladat_leiras", type: 'string'
        }
    ],

    validators: {
        ugyintezo_azonosito: { type: 'length', min: 1 },
        feladat_leiras: { type: 'length', min: 1 },
        
    },

    proxy: {
        type: 'rest',
        url: 'http://localhost/feladat/php/feladatok',
        appendId: true,
        reader: {
            type: 'json',
            rootProperty: 'data'
        },
        writer: {
            type: 'json',
            writeRecordId: true,
            writeAllFields: true
        }
    }
});
