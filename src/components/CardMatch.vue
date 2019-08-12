<template>
  <div class="center">
    <div>
      <div class="center-control">
        <fieldset>
          <div class="switch-toggle switch-candy">
            <input id="basic" name="view" type="radio" checked />
            <label for="basic" v-on:click="levelclick('b')">Basic</label>

            <input id="medium" name="view" type="radio" />
            <label for="medium" v-on:click="levelclick('m')">Medium</label>

            <input id="hard" name="view" type="radio" />
            <label for="hard" v-on:click="levelclick('h')">Hard</label>

            <a></a>
          </div>
        </fieldset>
        <button class="button" v-on:click="startgame()">START</button>
        <div class="timer ml-10 mr-10">TIME:{{timeleft}}</div>
        <button class="button" v-on:click="showRecords()">RECORDS</button>
        <!-- <div class="recordboard">
          <span>
            Basic:{{bestB}}
            <template v-if="bestB != '-'">s</template>
          </span>
          <span>
            Medium:{{bestM}}
            <template v-if="bestM != '-'">s</template>
          </span>
          <span>
            Hard:{{bestH}}
            <template v-if="bestH != '-'">s</template>
          </span>
        </div>-->
      </div>

      <div class="container_match">
        <OneCard
          v-for="(icon, index) in icons"
          :icon="icon"
          :idx="index"
          v-bind:key="index"
          v-on:card-click="updateClass"
          ref="cards"
        />
      </div>
    </div>

    <b-modal ref="modal" hide-header hide-footer centered>
      <div class="d-block text-center">
        <h3>YA!! ALL MATCHED!! </h3>
        <h3>Time : {{timeUsed}} s</h3>        
        <template v-if="timeUsed < 60">
          <b-form-input v-model="playerName" placeholder="Enter your name" maxlength="10" :formatter="format" trim></b-form-input>
          <b-button variant="success" class="my-3" v-on:click="addRecord()">Add Record</b-button>
        </template>
      </div>
    </b-modal>

    <b-modal ref="records" hide-header hide-footer centered>
      <b-tabs content-class="mt-3">
        <b-tab title="Basic" active>
          <b-table striped hover :items="recordsBasic"></b-table>
        </b-tab>
        <b-tab title="Medium">
          <b-table striped hover :items="recordsMedium"></b-table>
        </b-tab>
        <b-tab title="Hard">
          <b-table striped hover :items="recordsHard"></b-table>
        </b-tab>
      </b-tabs>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import OneCard from "@/components/OneCard.vue";
import { BModal } from "bootstrap-vue/src/components/modal";
import { Mixins } from "vue-property-decorator";
import CommonMixin from "@/utils/CommonMixin";
import MyFirestoreMixin, { DocToCardMatchRecordMap } from "@/utils/MyFirestoreMixin";

@Component({
  components: {
    OneCard
  }
})
export default class CardMatch extends Mixins(CommonMixin, MyFirestoreMixin) {
  @Prop() private msg!: string;

  private bestB: number = 0;
  private bestM: number = 0;
  private bestH: number = 0;

  private timeleft: number = 60;

  private icons: string[] = [];
  private matchCount: number = 0;
  private iconAmount: number = 6;

  private level: string = "b";
  private levelIconAmtMap: Map<string, number> = new Map([
    ["b", 6],
    ["m", 9],
    ["h", 12]
  ]);

  private levelNameMap: Map<string, string> = new Map([
    ["b", "basic"],
    ["m", "medium"],
    ["h", "hard"]
  ]);
  private currentCard: any = null;

  private timeHolder: any = null;

  timeUsed: number = 0;

  recordsBasic: {}[] = [];
  recordsMedium: {}[] = [];
  recordsHard: {}[] = [];

  $refs!: {
    cards: OneCard[];
    modal: BModal;
    records: BModal;
  };

  playerName: string = '';

  created() {
    this.iconAmount = this.levelIconAmtMap.get(this.level) || 6;
    this.updateRecords();
  }

  levelclick(lv: string) {
    this.level = lv;
  }

  startgame() {
    this.iconAmount = this.levelIconAmtMap.get(this.level) || 6;
    this.icons = new Array(0);

    this.$nextTick(function() {
      this.gameStart();
    });
  }

  updateClass(idx: number) {
    if (this.currentCard == null) {
      this.currentCard = this.$refs.cards[idx];
    } else {
      const classA = this.currentCard.icon;
      const classB = this.$refs.cards[idx].icon;

      if (classA !== classB) {
        setTimeout(() => {
          this.currentCard.coverCard();
          this.$refs.cards[idx].coverCard();
          this.currentCard = null;
        }, 500);
      } else {
        this.currentCard = null;
        this.matchCount += 1;
        if (this.iconAmount === this.matchCount) {
          if (this.timeHolder != null) {
            clearInterval(this.timeHolder);
          }

          this.timeUsed = 60 - this.timeleft;

          if (
            this.level === "b" &&
            (this.bestB > this.timeUsed || this.bestB === 0)
          ) {
            this.bestB = this.timeUsed;
          } else if (
            this.level === "m" &&
            (this.bestM > this.timeUsed || this.bestM === 0)
          ) {
            this.bestM = this.timeUsed;
          } else if (
            this.level === "h" &&
            (this.bestH > this.timeUsed || this.bestH === 0)
          ) {
            this.bestH = this.timeUsed;
          }

          setTimeout(() => {
            this.$refs.modal.show();
            //alert("YA!! ALL MATCHED!! Time used: " + this.timeUsed + "s");
          }, 500);
        }
      }
    }
  }

  showRecords() {
    this.$refs.records.show();
  }

  updateRecords() {
    ["basic", "medium", "hard"].forEach(level => {
      this.getCardMatchRecords(
        level,
        "match_card_records",
        DocToCardMatchRecordMap
      )
        .then(resolve => {
          if( level === 'basic'){
            this.recordsBasic = <{}[]>resolve;
          }else if( level === 'medium'){
            this.recordsMedium = <{}[]>resolve;
          }else{
            this.recordsHard = <{}[]>resolve;
          }

        })
        .catch(reason => {
          console.info(reason);
        });
    });
  }

  gameStart() {
    this.icons.splice(0);
    this.currentCard = null;
    let tempIcons = [];
    const seqs = this.getRandomSeqArray();
    this.matchCount = 0;
    for (let i = 0; i < this.iconAmount; i++) {
      tempIcons.push(this.iconDatas[seqs[i]]);
    }
    let iconsClones = tempIcons.slice();

    let _icons = tempIcons.concat(iconsClones);

    this.icons = this.shuffle(_icons);

    this.timeleft = 60;
    if (this.timeHolder != null) {
      clearInterval(this.timeHolder);
    }
    this.timeHolder = setInterval(() => {
      this.timeleft -= 1;
      if (this.timeleft <= 0) {
        clearInterval(this.timeHolder);
      }
    }, 1000);
  }

  iconDatas = [
    "fas fa-book",
    "fas fa-bolt",
    "fas fa-car",
    "fas fa-cat",
    "fab fa-codepen",
    "fas fa-crow",
    "fab fa-earlybirds",
    "fas fa-feather-alt",
    "fab fa-firefox",
    "fas fa-hippo",
    "fas fa-oil-can",
    "far fa-paper-plane"
  ];

  getRandom(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getRandomSeqArray(): number[] {
    let set: Set<number> = new Set();
    while (set.size < 12) {
      let ranInt = this.getRandom(0, 11);
      if (!set.has(ranInt)) {
        set.add(ranInt);
      }
    }
    return Array.from(set);
  }

  shuffle(array: string[]) {
    let currentIndex: number = array.length,
      temporaryValue,
      randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
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
        time: this.timeUsed
      }

      this.addCardMatchRecords(
        this.levelNameMap.get(this.level) || 'basic',
        "match_card_records",
        rec
      ).then( ref =>{
        console.info('ref: ',ref);
        this.updateRecords();
      }).catch(reason=>{
        console.error(reason)
      })
    }

    this.$refs.modal.hide();
  }
}
</script>




<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" src="../assets/css/cardmatch.scss" />

