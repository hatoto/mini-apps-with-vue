import { Vue, Component } from 'vue-property-decorator';
import db from './FirebaseConfig';

@Component
export default class MyFirestoreMixin extends Vue {
    
    getRecord(level: string, tableName: string, docToRecordMap: Function) {
        return new Promise(function (resolve, reject) {

            db.collection(tableName).doc(level).collection('records').orderBy('time','asc').limit(10).get().then(function (doc) {
                let records : {}[]= [];
                if (!doc.empty) {
                    doc.docs.forEach(querySnapshot =>{
                        records.push(docToRecordMap(querySnapshot));
                    });
                    resolve(records);
                } else {
                    reject("Record not found");
                }
            }).catch(function (error) {
                reject(error);
            });

        });
    }

    /* getAll(tableName: string, docToRecordMap: Function) {
        return new Promise(function (resolve, reject) {

            var records = [];
            db.collection(tableName)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        records.push(docToRecordMap(doc));
                    });

                    resolve(records);
                });
        });
    } */

 }


 export class GameRecord{
    id: string = '';
    name: string = '';
    time?: number;
    
}

export function DocToTodoRecordMap(doc: any) : GameRecord {
    var rowData = doc.data();
    var record = {
        id: doc.id,
        name: rowData.name,
        time: rowData.time
    };
    
    return record;
}