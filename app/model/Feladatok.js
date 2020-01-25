Ext.define('feladat.model.Feladatok', {
    extend: 'feladat.model.Base',

    idProperty: 'feladat_azonosito',
    clientIdProperty: 'clientId',
    identifier: 'negative',

    fields: [
        {
            name: "feladat_azonosito"
        },
        {
            name: "ugyintezo_nev"
        },
        {
            name: "ugyintezo_email"
        },
        {
            name: "letrehozas_datuma"
        },
        {
            name: "feladat_leiras"
        }
    ],

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
            writeRecordId: false
        }
    }
});
