/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 */
Ext.define('feladat.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.main',

    onItemSelected: function (sender, record) {
        Ext.Msg.confirm('Confirm', 'Are you sure?', 'onConfirm', this);
    },

    onConfirm: function (choice) {
        if (choice === 'yes') {
            //
        }
    },

    UjFeladat: function (sender, record) {
          var form = Ext.create('feladat.view.ablakok.UjFeladat');
          form.show();
  
    },

    mentes: function() {

        var feladat, ugyintezo_azonosito, feladat_leiras, feladat_store, ugyintezo_store, ugyintezo_record;
        feladat_store = Ext.getStore('feladatok');
        ugyintezo_store = Ext.getStore('ugyintezok');

        ugyintezo_azonosito = Ext.getCmp('u_azonosito').getValue();
        
        feladat_leiras  = Ext.getCmp('f_leiras').getValue();
        
        if (ugyintezo_azonosito == null || ugyintezo_azonosito.length == 0 || feladat_leiras == null || feladat_leiras.length == 0) {
            alert('Nincs minden mező kitöltve!');
        } else {
            ugyintezo_record = ugyintezo_store.getById(ugyintezo_azonosito);

            ugyintezo_nev = ugyintezo_record.data.ugyintezo_nev;
            ugyintezo_email = ugyintezo_record.data.ugyintezo_email;
            
            feladat = Ext.create('feladatok', { ugyintezo_azonosito: ugyintezo_azonosito, ugyintezo_nev: ugyintezo_nev, ugyintezo_email: ugyintezo_email, feladat_leiras: feladat_leiras });
            feladat.save();
            
            this.getView().destroy();
            
            feladat_store.reload();
        }
        
    
    },

    megse: function() {
        this.getView().destroy();
    },

    Modositas: function () {
        var data = Ext.getCmp('feladatokgrid').getSelectionModel().getSelection();
        console.log('data', data);
        
        if (data.length == 0) {
            Ext.Msg.show({
                title:'Hiba',
                message: 'Nincs kijelölve feladat!',
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.ERROR   
            });
        } else {
            var form = Ext.create('feladat.view.ablakok.Modositas');
        
            Ext.getCmp('u_azonosito').setValue(data[0].data.ugyintezo_azonosito);
            Ext.getCmp('f_leiras').setValue(data[0].data.feladat_leiras);

            form.show();
        }
    },

    modosit: function() {
        var data = Ext.getCmp('feladatokgrid').getSelectionModel().getSelection();
        var id, feladat_store, ugyintezo_store, feladat_record, ugyintezo_record, ugyintezo_azonosito, feladat_leiras;
        
        id = data[0].data.feladat_azonosito;
       
        ugyintezo_azonosito  = Ext.getCmp('u_azonosito').getValue();
        feladat_leiras = Ext.getCmp('f_leiras').getValue();

        if (ugyintezo_azonosito == null || ugyintezo_azonosito.length == 0 || feladat_leiras == null || feladat_leiras.length == 0) {
            alert('Nincs minden mező kitöltve!');
        } else {
            feladat_store = Ext.getStore('feladatok');
            feladat_record = feladat_store.getById(id);
            console.log('record.data', feladat_record.data);

            ugyintezo_store = Ext.getStore('ugyintezok');
            ugyintezo_record = ugyintezo_store.getById(ugyintezo_azonosito);         
            console.log('ugyintezo_record.data', ugyintezo_record.data);
            
            feladat_record.data.ugyintezo_azonosito = ugyintezo_azonosito;
            feladat_record.data.ugyintezo_nev = ugyintezo_record.data.ugyintezo_nev;
            feladat_record.data.ugyintezo_email = ugyintezo_record.data.ugyintezo_email;
            feladat_record.data.feladat_leiras  = feladat_leiras;
            feladat_record.data.letrehozas_datuma = data[0].data.letrehozas_datuma;
            
            feladat_record.save();

            feladat_store.sync();

            this.getView().destroy(); 
        }
    },


    Torles: function (sender, record) {
        var data = Ext.getCmp('feladatokgrid').getSelectionModel().getSelection();
        if (data.length == 0) {
            Ext.Msg.show({
                title:'Hiba',
                message: 'Nincs kijelölve feladat!',
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.ERROR   
            });
        } else {
            var id = data[0].data.feladat_azonosito;
            var store = Ext.getStore('feladatok');
            var record = store.getById(id);
            console.log('record', record);
            Ext.Msg.show({
                title:'Törlés',
                message: 'Biztos, hogy törölni szeretné a feladatot?',
                buttons: Ext.Msg.YESNO,
                buttonText: {
                    yes: 'Igen',
                    no: 'Nem'
                },
                icon: Ext.Msg.QUESTION,
                fn: function(btn) {
                    if (btn === 'yes') {
                        store.remove(data);
                        store.sync();
                    } 
                }
            });
            console.log(data);
        }
    },

    // filterGrid: function (property, value) {
    //     console.log('value', value);
        
    //     var grid = Ext.getCmp('feladatokgrid');
    //     if (grid.store.filters) {
    //          grid.store.filters.each(function(item) {
    //           if (item.property === property) {
    //               grid.store.removeFilter(item);
    //           }  
    //         })
    //     };
       
    //     if (value) {
    //         var matcher = new RegExp(Ext.String.escapeRegex(value), "i");
    //         grid.store.addFilter({
    //             filterFn: function (record) {
    //                 return matcher.test(record.get(property));
    //             }
    //         });
    //         grid.store.filters.getAt(grid.store.filters.length-1).property=property;
    //     }
    // },


    Kereses: function () {
        var grid = Ext.getCmp('feladatokgrid');
        var property, value;
        
        property = 'ugyintezo_nev';
        value = Ext.getCmp('ui_nev').getValue();
        console.log('grid.store.filters', grid.store.filters);
        
        if (grid.store.filters) {
             grid.store.filters.each(function(item) {
              if (item.property === property) {
                  console.log('item', item);
                  
                  grid.store.removeFilter(item);
              }  
            })
        };
       
        if (value) {
            var matcher = new RegExp(Ext.String.escapeRegex(value), "i");
            console.log('matcher', matcher);
            
            grid.store.addFilter({
                filterFn: function (record) {
                    return matcher.test(record.get(property));
                }
            });
            grid.store.filters.getAt(grid.store.filters.length-1).property=property;
        }

        property = 'feladat_leiras';
        value = Ext.getCmp('fe_leiras').getValue();

        if (grid.store.filters) {
            grid.store.filters.each(function(item) {
             if (item.property === property) {
                 grid.store.removeFilter(item);
             }  
           })
       };
      
       if (value) {
           var matcher = new RegExp(Ext.String.escapeRegex(value), "i");
           grid.store.addFilter({
               filterFn: function (record) {
                   return matcher.test(record.get(property));
               }
           });
           grid.store.filters.getAt(grid.store.filters.length-1).property=property;
       }

        property = 'letrehozas_datuma';
        value = Ext.getCmp('lh_datuma').getValue();
        Ext.JSON.encodeDate = function(value) {
            value = Ext.Date.format(value, '"Y.m.d."');
        };
        console.log('value.getDate()', value.getDate());
        
        value.setDate(value.getDate() + 1);
        value = value.toISOString();
        console.log('létrehozás dátuma', value);
        
        if (grid.store.filters) {
            grid.store.filters.each(function(item) {
             if (item.property === property) {
                 grid.store.removeFilter(item);
             }  
           })
       };
      
       if (value) {
           var matcher = new RegExp(Ext.String.escapeRegex(value), "i");
           grid.store.addFilter({
               filterFn: function (record) {
                   return matcher.test(record.get(property));
               }
           });
           grid.store.filters.getAt(grid.store.filters.length-1).property=property;
       }
    }, 



    Kiurites: function () {
        var ui_nev = Ext.getCmp('ui_nev').getValue();
        var fe_leiras = Ext.getCmp('fe_leiras').getValue();
        var lh_datuma = Ext.getCmp('lh_datuma').getValue();
        console.log(ui_nev, fe_leiras, lh_datuma);
        
        store = Ext.getCmp('feladatokgrid').getStore();
    
        if (ui_nev.length > 0 || fe_leiras.length > 0 || lh_datuma.length > 0) {
            store.clearFilter();
            Ext.getCmp('ui_nev').setValue('');
            Ext.getCmp('fe_leiras').setValue('');
            Ext.getCmp('lh_datuma').reset();
        }
    },

});
