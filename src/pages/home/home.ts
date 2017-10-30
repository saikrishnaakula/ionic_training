import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SQLite,SQLiteObject  } from '@ionic-native/sqlite';
import { Platform } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
}) 
export class HomePage {
  name = <any>[];
  people =[];
  constructor(public platform: Platform,public navCtrl: NavController,private sqlite: SQLite,public alertCtrl: AlertController) {
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
    var param = [this.name.fname, this.name.lname];
    this.sqlite.create({
      name: 'test.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {
      db.executeSql(sql, param)
      .then(() => {
        this.refresh();
        this.name.fname ="";
        this.name.lname="";
      })
      .catch(e => console.log(e));
    })
    .catch(e => console.log(e));
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
            this.people.push({firstname: data.rows.item(i).firstname, lastname: data.rows.item(i).lastname,id :data.rows.item(i).id});
          }
        }
      })
      .catch(e => console.log(e));
    })
    .catch(e => console.log(e));
  }
  public rmName(id){
    this.sqlite.create({
      name: 'test.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {
      var sql = "delete FROM people where id =(?)"
      db.executeSql(sql, [id])
      .then((data) => {
        this.refresh();
      })
      .catch(e => console.log(e));
    })
    .catch(e => console.log(e));
  }



  public  editName(pfname,plname,id) {
    let prompt = this.alertCtrl.create({
      title: 'Edit Name',
      message: "Enter the new name",
      inputs: [
        {
          name: 'fname',
          placeholder: 'firstname',
          value: pfname
        },
        {
          name: 'lname',
          placeholder: 'lastname',
          value: plname
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.sqlite.create({
              name: 'test.db',
              location: 'default'
            })
            .then((db: SQLiteObject) => {
              var sql = "";
              var param =[];
              if(data.fname.length !=0 && data.lname.length !=0){
                sql = "update people set firstname = (?), lastname =(?) where id =(?)";
                param = [data.fname,data.lname,id];
              } else if(data.fname.length!=0&& data.lname.length ==0){
                sql = "update people set firstname = (?) where id =(?)";
                param = [data.fname,id];
              } else if(data.fname.length ==0 && data.lname.length !=0){
                sql = "update people set lastname =(?) where id =(?)";
                param = [data.lname,id];
              }
              db.executeSql(sql, param)
              .then((data) => {
                this.refresh();
              })
              .catch(e => console.log(e));
            })
            .catch(e => console.log(e));
          }
        }
      ]
    });
    prompt.present();
  }


}
