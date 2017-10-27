import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SQLite,SQLiteObject  } from '@ionic-native/sqlite';
import { TabsPage } from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,sqlite:SQLite) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
            sqlite.create({
                name: "test.db",
                location: "default"
            }).then((db: SQLiteObject) => {
                db.executeSql("CREATE TABLE IF NOT EXISTS people (id INTEGER PRIMARY KEY AUTOINCREMENT, firstname TEXT, lastname TEXT)", {}).then((data) => {
                    console.log("TABLE CREATED: ", data);
                }, (error) => {
                    console.error("Unable to execute sql", error);
                })
            }, (error) => {
                console.error("Unable to open database", error);
            });
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
