<template>
  <div>
    <h1 class="title">&hearts; and &clubs; and &diams; and &spades;</h1>
    <div class="center-control">
      <fieldset>
        <div class="switch-toggle switch-candy">
          <template v-for="(l, index) in levels">
            <input v-bind:id="l" name="view" type="radio" :key="'radio:'+index" />
            <label v-bind:for="l" @click="levelClick(l)" :key="'label:'+index">{{l}}</label>
          </template>
          <a></a>
        </div>
      </fieldset>
      <button class="button" v-on:click="startGame">START</button>
      <span class="timer">TIME:{{timeCount}}</span>
      <b-button variant="success" class="my-3" v-on:click="showRecords()">RECORDS</b-button>
    </div>

    <section class="card_deck_wrap" v-if="isReading && gameStarted">
      <div>Card Left: {{amountLeft}}</div>
      <div class="card-stacked">
        <div class="lower-card" v-for="(l, index) in lowerCardCnt" :key="'lowerCardCnt:'+index"></div>

        <div class="cardQ" v-on:click="clickNext()" v-bind:class="{'red_card': isRed}">
          <div class="card_content_q">{{card_no}}</div>
          <div
            class="card_content_q symbol"
            v-html="main_shape"
            unselectable="on"
            onselectstart="return false;"
            onmousedown="return false;"
          ></div>
        </div>
      </div>
    </section>

    <section class="card_table_wrap" v-if="!isReading">
      <section class="card_table">
        <div class="card_row mt-1 mb-1" v-for="(shape, index) in shapes" :key="'shape:'+index">
          <OnePoker
            v-for="n in 13"
            :shape="shape"
            :idx="n"
            :key="n"
            :displayOnly="false"
            v-on:card-click="aCardClicked"
            ref="cards"
          ></OnePoker>
        </div>
      </section>
      <section class="card_table inputs">
        <div class="card_row wrap">
          <OnePoker v-for="ans in answers" :shape="ans.shape" :idx="ans.idx" :key="ans.key"></OnePoker>
          <OnePoker v-for="ans in (cards_using_backup.length - answers.length)" :key="ans+3500"></OnePoker>
        </div>
      </section>
    </section>

    <b-modal ref="modal" hide-header hide-footer centered>
      <div class="d-block text-center">
        <template v-if="isSuccess">
          <h3>You Made It!!!</h3>
          <b-form-input v-model="playerName" placeholder="Enter your name" maxlength="10" :formatter="format" trim></b-form-input>
          <b-button variant="success" class="my-3" v-on:click="addRecord()">Add Record</b-button>
        </template>
        <template v-else>
          <h3>Not Match!!!!</h3>
          <div class="d-flex flex-wrap">
            <OnePoker v-for="ans in ansOfQuestion" :shape="ans.shape" :idx="ans.idx" :key="ans.key"></OnePoker>
          </div>
        </template>
      </div>
    </b-modal>

    <b-modal ref="records" hide-header hide-footer centered>
      <b-tabs content-class="mt-3">
        <template v-for="(n, index) in levelnames" >
         
         <b-tab :title="levelNameMap.get(n)" :key="'pokerlevel_'+index" >
             <b-table striped hover :items="pokerRecords[n]"></b-table>
          </b-tab>
        </template>  
        

      </b-tabs>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import OnePoker from "@/components/OnePoker.vue";
import { BModal } from "bootstrap-vue/src/components/modal";
import { Mixins } from "vue-property-decorator";
import CommonMixin from "@/utils/CommonMixin";
import MyFirestoreMixin, { DocToCardMatchRecordMap } from "@/utils/MyFirestoreMixin";

@Component({
  components: {
    OnePoker
  }
})
export default class PokerCardMen extends Mixins(CommonMixin, MyFirestoreMixin) {
  public $refs!: {
    cards: OnePoker[];
    modal: BModal;
    records: BModal;
  };

  levels: number[] = [5, 10, 20, 30, 40, 52];
  levelnames: string[] = ["five", "ten", "twenty", "thirty", "forty", "full"];

  shapes: string[] = ["hearts", "clubs", "diams", "spades"];
  answers: any[] = [];
  amount: number = 5;
  amountLeft: number = 5;
  cards: [string, number][] = [];
  cards_using: [string, number][] = [];
  cards_using_backup: [string, number][] = [];
  characterMap: Map<number, string> = new Map([
    [11, "J"],
    [12, "Q"],
    [13, "K"]
  ]);
  levelNameMap: Map<string, string> = new Map([
    ["five", "5"],
    ["ten", "10"],
    ["twenty", "20"],
    ["thirty", "30"],
    ["forty", "40"],
    ["full", "52"]
  ]);
  isRed: boolean = false;
  main_shape: string = "";
  card_no: string = "";
  lowerCardCnt: number = 2;
  isReading: boolean = true;
  timeCount: string = "00:00:00.000";
  timeBegan: Date = new Date();
  timeStopped: Date = new Date();
  stoppedDuration = 0;
  started: number = -1;
  isSuccess: boolean = false;
  ansOfQuestion: any[] = [];
  gameStarted: boolean = false;

  pokerRecords: PokerRecords = new PokerRecords();

  playerName: string = '';

  created() {
    this.updateRecords();
  }

  aCardClicked(shape: string, idx: number) {
    this.answers.push({
      shape: shape,
      idx: idx,
      key: 1000 - this.answers.length
    });
    let currentAnsIndex = this.answers.length - 1;
    let questionContent = this.cards_using_backup[currentAnsIndex];
    let currentAns = this.answers[currentAnsIndex];
    if (
      questionContent[0] != currentAns.shape ||
      questionContent[1] != currentAns.idx
    ) {
      setTimeout(() => {
        this.coverAllCards();
        this.isSuccess = false;
        this.getQuestions();
        this.$refs.modal.show();
      }, 1000);
      return;
    }
    if (this.cards_using_backup.length == this.answers.length) {
      setTimeout(() => {
        this.coverAllCards();
        this.isSuccess = true;
        this.$refs.modal.show();
      }, 1000);
    }
  }

  startGame() {
    this.reset();
    if (this.amount == null) {
      this.amount = this.levels[0];
    }
    this.amountLeft = this.amount;
    this.isReading = true;
    this.lowerCardCnt = 2;
    this.answers = [];
    this.cards = [];
    this.cards_using_backup = [];
    this.shapes.forEach(s => {
      const shape = s;
      for (let i = 0; i < 13; i++) {
        this.cards.push([shape, i + 1]);
      }
    });

    for (let i = 0; i < 52; i++) {
      let a = Math.floor(Math.random() * 52);
      let temp = this.cards[i];
      this.cards[i] = this.cards[a];
      this.cards[a] = temp;
    }
    this.cards_using = this.cards.slice(0, this.amount);

    this.showCard(this.cards_using.shift());
    this.gameStarted = true;
    this.start();
  }

  showCard(card: any) {
    this.cards_using_backup.push(card);
    this.isRed = false;
    if (["hearts", "diams"].indexOf(card[0]) > -1) {
      this.isRed = true;
    }
    if (card[1] == 1) {
      this.card_no = "A";
    } else if (card[1] > 10) {
      this.card_no = this.characterMap.get(card[1]) || "-";
    } else {
      this.card_no = card[1] + "";
    }
    this.main_shape = "&" + card[0] + ";";
  }

  clickNext() {
    if (this.cards_using.length == 0) {
      this.stop();
      this.isReading = false;
      return;
    }
    this.amountLeft -= 1;
    if (this.cards_using.length < 3) {
      this.lowerCardCnt = this.cards_using.length - 1;
    }
    this.showCard(this.cards_using.shift());
  }

  start() {
    if (this.timeBegan === null) {
      this.timeBegan = new Date();
    }

    if (this.timeStopped !== null) {
      this.stoppedDuration += new Date().getTime() - this.timeStopped.getTime();
    }

    this.started = setInterval(() => {
      if (this.timeCount > "00:10:00.000") {
        this.stop();
      } else {
        this.clockRunning();
      }
    }, 10);
  }

  clockRunning() {
    let currentTime: Date = new Date();
    let timeVal =
      currentTime.getTime() - this.timeBegan.getTime() - this.stoppedDuration;
    let timeElapsed: Date = new Date(timeVal);
    let hour = timeElapsed.getUTCHours(),
      min = timeElapsed.getUTCMinutes(),
      sec = timeElapsed.getUTCSeconds(),
      ms = timeElapsed.getUTCMilliseconds();

    this.timeCount =
      (hour > 9 ? hour : "0" + hour) +
      ":" +
      (min > 9 ? min : "0" + min) +
      ":" +
      (sec > 9 ? sec : "0" + sec) +
      "." +
      (ms > 99 ? ms : ms > 9 ? "0" + ms : "00" + ms);
  }

  reset() {
    clearInterval(this.started);
    this.stoppedDuration = 0;
    this.timeBegan = new Date();
    this.timeStopped = new Date();
    this.timeCount = "00:00:00.000";
  }

  stop() {
    this.timeStopped = new Date();
    clearInterval(this.started);
  }

  levelClick(level: number) {
    this.amount = level;
  }

  getQuestions() {
    this.ansOfQuestion = [];
    this.cards_using_backup.forEach((c, index) => {
      console.info(c, index);
      this.ansOfQuestion.push({
        shape: c[0],
        idx: c[1],
        key: 2000 - index
      });
    });
  }

  coverAllCards() {
    this.$refs.cards.forEach(c => {
      c.coverCard();
    });
  }

  showRecords() {
    this.$refs.records.show();
  }

  updateRecords() {
    this.levelnames.forEach(level => {
      this.getPokerCardRecords(
        level,
        "poker_card_record",
        DocToCardMatchRecordMap
      )
        .then(resolve => {
          this.pokerRecords.setRec(level, <{}[]>resolve);          
        })
        .catch(reason => {
          console.info(level,' : ' ,reason);
        });
    });
  }

  format(value: string, event: any) {
      value = value.replace(/[^A-Za-z0-9]/g, '-');
      return value.toUpperCase()
  }

  addRecord() {
    console.info('addRecord......., playerName: ', this.playerName);

    if( this.playerName.trim().length > 0){

      const rec = {
        name: this.playerName,
        time: this.timeCount
      }
      console.info('addRecord.., rec: ', rec);

      let levelName = 'five';
      
      this.levelNameMap.forEach((value, key, map) => {        
        if( Number(value) === this.amount ){
          levelName = key;
        }
      });

      console.info('addRecord.., levelName: ', levelName);

       this.addPokerMenRecords(
        levelName,
        "poker_card_record",
        rec
      ).then( ref =>{
        console.info('ref: ',ref);
        this.updateRecords();
      }).catch(reason=>{
        console.error(reason)
      }); 
    }

    this.$refs.modal.hide();
  }
}

export class PokerRecords {
  
  five: {}[] = [];
  ten: {}[] = [];
  twenty: {}[] = [];
  thirty: {}[] = [];
  forty: {}[] = [];
  full: {}[] = [];

  setRec( level:string, record: {}[]){
    console.info( 'record: ', record);
    if( level === 'five'){
      this.five = record;
    }else if( level === 'ten' ){
      this.ten = record;
    }else if( level === 'twenty' ){
      this.twenty = record;
    }else if( level === 'thirty' ){
      this.thirty = record;
    }else if( level === 'forty' ){
      this.forty = record;
    }else{
      this.full = record; }

  }
}
</script>

<style lang="scss" src="../assets/css/pokercard.scss" scoped />