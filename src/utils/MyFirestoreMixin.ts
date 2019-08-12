import { Vue, Component } from 'vue-property-decorator';
import db from './FirebaseConfig';

@Component
export default class MyFirestoreMixin extends Vue {

    getCardMatchRecords(level: string, tableName: string, docToCardMatchRecordMap: Function) {
        return new Promise(function (resolve, reject) {

            db.collection(tableName).doc(level).collection('records').orderBy('time', 'asc').limit(10).get().then(function (doc) {
                let records: {}[] = [];
                if (!doc.empty) {
                    doc.docs.forEach(querySnapshot => {
                        records.push(docToCardMatchRecordMap(querySnapshot));
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

    addCardMatchRecords(level: string, tableName: string, record: GameRecord) {
        //console.info(level, tableName, record);
        return new Promise(function (resolve, reject) {

            db.collection(tableName).doc(level).collection('records').add(record).then(function (ref) {
                resolve(ref);
            }).catch(function (error) {
                reject(error);
            });

        });
    }

    
    getPokerCardRecords(level: string, tableName: string, docToPokerRecordMap: Function) {
        return new Promise(function (resolve, reject) {

            db.collection(tableName).doc(level).collection('records').orderBy('time', 'asc').limit(10).get().then(function (doc) {
                let records: {}[] = [];
                if (!doc.empty) {
                    doc.docs.forEach(querySnapshot => {
                        records.push(docToPokerRecordMap(querySnapshot));
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


    addPokerMenRecords(level: string, tableName: string, record: PokerRecord) {
        //console.info(level, tableName, record);
        return new Promise(function (resolve, reject) {

            db.collection(tableName).doc(level).collection('records').add(record).then(function (ref) {
                resolve(ref);
            }).catch(function (error) {
                reject(error);
            });

        });
    }

}


export class GameRecord {
    //id: string = '';
    name: string = '';
    time?: number;
}
export function DocToCardMatchRecordMap(doc: any): GameRecord {
    var rowData = doc.data();
    var record = {
        name: rowData.name,
        time: rowData.time
    };
    return record;
}

export class PokerRecord {
    name?: string;
    time?: string;
}

export function DocToPokerRecordMap(doc: any): GameRecord {
    var rowData = doc.data();
    return {        
        name: rowData.name,
        time: rowData.time
    };

}