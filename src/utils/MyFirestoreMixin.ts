import { Vue, Component } from 'vue-property-decorator';
import db from './FirebaseConfig';

@Component
export default class MyFirestoreMixin extends Vue {


    addCardGameRecords(level: string, tableName: string, record: GameRecord) {
        return new Promise(function (resolve, reject) {
            db.collection(tableName).doc(level).collection('records').add(record).then(function (ref) {
                resolve(ref);
            }).catch(function (error) {
                reject(error);
            });
        });
    }


    getCardGameRecords(level: string, tableName: string, docToCardGameRecordMap: Function) {
        return new Promise(function (resolve, reject) {

            db.collection(tableName).doc(level).collection('records').orderBy('time', 'asc').limit(10).get().then(function (doc) {
                let records: {}[] = [];
                if (!doc.empty) {
                    doc.docs.forEach(querySnapshot => {
                        records.push(docToCardGameRecordMap(querySnapshot));
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




}


export class GameRecord {
    name?: string;
    time?: string;
}
export function docToCardGameRecordMap(doc: any): GameRecord {
    var rowData = doc.data();
    var record = {
        name: rowData.name,
        time: rowData.time
    };
    return record;
}


