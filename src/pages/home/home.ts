import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SQLite,SQLiteObject  } from '@ionic-native/sqlite';
import { Platform } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  name = <any>[];
  // name.fname=[];
  // name.lname=[];
  people =[];
  constructor(public platform: Platform,public navCtrl: NavController,private sqlite: SQLite) {
    this.platform.ready().then(() => {
            this.sqlite.create({name: "test.db", location: "default"}).then(() => {
                this.refresh();
            }, (error) => {
                console.log("ERROR: ", error);
            });
        });
  }
  public saveName(){
    var sql = "INSERT INTO people (firstname, lastname) VALUES (?,?)";
    this.sqlite.create({
      name: 'test.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {
      db.executeSql(sql, [this.name.fname, this.name.lname])
      .then(() => console.log('Executed SQL'))
      .catch(e => console.log(e));
    })
  .catch(e => console.log(e));
    // this.database.executeSql(sql, [this.name.fname, this.name.lname]).then((data) => {
    //             console.log("INSERTED: " + JSON.stringify(data));
    //         }, (error) => {
    //             console.log("ERROR: " + JSON.stringify(error.err));
    //         });
  }
  public refresh() {
    this.sqlite.create({
      name: 'test.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {
      db.executeSql("SELECT * FROM people", [])
      .then((data) => {
        this.people = [];
        if(data.rows.length > 0) {
            for(var i = 0; i < data.rows.length; i++) {
                this.people.push({firstname: data.rows.item(i).firstname, lastname: data.rows.item(i).lastname});
            }
        }
      })
    .catch(e => console.log(e));
  })
      .catch(e => console.log(e));
      //  this.database.executeSql("SELECT * FROM people", []).then((data) => {
      //      this.people = [];
      //      if(data.rows.length > 0) {
      //          for(var i = 0; i < data.rows.length; i++) {
      //              this.people.push({firstname: data.rows.item(i).firstname, lastname: data.rows.item(i).lastname});
      //          }
      //      }
      //  }, (error) => {
      //      console.log("ERROR: " + JSON.stringify(error));
      //  });
   }
}
