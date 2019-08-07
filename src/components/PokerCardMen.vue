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
      <div class="timer">TIME:{{timeCount}}</div>
    </div>

    <section class="card_deck_wrap" v-if="isReading && gameStarted">
      <div>Card Left: {{amountLeft}}</div>
      <div class="card-stacked">
        <div class="lower-card" v-for="(l, index) in lowerCardCnt" :key="'lowerCardCnt:'+index"></div>

        <div class="cardQ" v-on:click="clickNext()" v-bind:class="{'red_card': isRed}">
          <div class="card_content_q">{{card_no}}</div>
          <div class="card_content_q symbol" v-html="main_shape" unselectable="on" onselectstart="return false;" 
 onmousedown="return false;"></div>
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
        <h3 v-if="isSuccess">You Made It!!!</h3>
        <template v-else>
            <h3>Not Match!!!!</h3>
            <div class="d-flex flex-wrap">
              <OnePoker v-for="ans in ansOfQuestion" :shape="ans.shape" :idx="ans.idx" :key="ans.key"></OnePoker>
            </div>
        </template>
      </div>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import OnePoker from "@/components/OnePoker.vue";
import { BModal } from "bootstrap-vue/src/components/modal";

@Component({
  components: {
    OnePoker
  }
})
export default class PokerCardMen extends Vue {
    public $refs!: {
        cards: OnePoker[];
        modal: BModal;
    };

    levels: number[] = [5, 10, 20, 30, 40, 52];
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

    created() {}

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
        this.cards_using_backup.forEach( (c, index)=>{
            console.info(c, index);
                this.ansOfQuestion.push({
                shape: c[0],
                idx: c[1],
                key: 2000 - index
        }); 
        });

        /* const shapesMap = new Map([
        ["hearts", "♥"],
        ["clubs", "♣"],
        ["diams", "♦"],
        ["spades", "♠"]
        ]);
        const characterMap = new Map([[1, "A"], [11, "J"], [12, "Q"], [13, "K"]]);
        let qs = "";
        this.cards_using_backup.forEach(c => {
        qs +=
            shapesMap.get(c[0]) ||
            "" +
            (characterMap.get(c[1]) !== undefined
                ? characterMap.get(c[1])
                : c[1]) +
            " : ";
        });
        this.ansOfQuestion = qs; */
    }

    coverAllCards() {
        this.$refs.cards.forEach(c => {
        c.coverCard();
        });
    }
}
</script>




<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
$color: #c0c0c0;
$background: #f0f0f0;
$gutter: 1px;
$font-size: 16px;

$card-background: #fff;
$card-padding: 3px;
$card-width: 48.16px;
$card-height: 67.2px;
$card-color-red: #e44145;
$card-color-black: #252525;
$card-symbol-size-q: 70px;
$card-symbol-size: 20px;

body {
  padding: 0;
  margin: 0;
  background: $background;
}

.title {
  font: 18px "Trebuchet MS";
  color: #444;
  text-align: center;
}

.center-control {
  margin: 0 auto;
  width: 760px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

fieldset {
  padding: 20px;
}

.switch-toggle {
  width: 360px;
}

.card_deck_wrap {
  margin: 0 auto;
  display: flex;
  justify-content: center;
  width: 680px;
}

@mixin card-shadow {
  box-shadow: 2px 2px 8px -2px rgba(0, 0, 0, 0.15);
}
@mixin card-shadow-back {
  box-shadow: 2px 2px 8px -2px rgba(0, 0, 0, 0.1); // more subtle
}

.card-stacked {
  cursor: pointer;
  position: relative;
  display: inline-block;
  margin: 30px;
}
.cardQ {
  margin: 0;
  padding: 1em;
  width: 172px;
  height: 240px;
  background-color: white;
  //  position: relative;
  z-index: 1;
  @include card-shadow;

  &.red_card {
    color: red;
  }

  .card_content_q {
    margin: 0 auto;
    font-size: $card-symbol-size-q;
    text-align: center;

    &.symbol {
      font-size: 80px;
    }
  }
}

.lower-card {
  position: absolute;
  background: #fff;
  width: 100%;
  height: 100%;
  &:nth-of-type(1) {
    top: 6px;
    left: 7px;
    z-index: -1;
  }
  &:nth-of-type(2) {
    top: 12px;
    left: 14px;
    z-index: -2;
    @include card-shadow-back;
  }
  @include card-shadow;
}

.card_table_wrap {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 720px;
}

.card_table {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.18);
  text-align: center;
  width: 720px;
  margin: 3px auto;
  background: #1f4037;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #99f2c8, #1f4037);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #99f2c8, #1f4037); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

  &.inputs {
    background: #CAC531;  /* fallback for old browsers */
    background: -webkit-linear-gradient(to right, #F3F9A7, #CAC531);  /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to right, #F3F9A7, #CAC531); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

  }
}

.card_row {
  display: flex;
  justify-content: space-evenly;
  &.wrap {
    flex-wrap: wrap;
    justify-content: flex-start;
  }
}

.card {
  cursor: pointer;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: $card-width;
  height: $card-height;
  //font: $font-size 'Trebuchet MS';

  margin: $gutter;
  border-radius: $card-padding;
  background: $card-background;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.18);

  &.covered {
    text-indent: -4000px;
    background-color: #ccc;
    background-repeat: repeat;
    background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1NiIgaGVpZ2h0PSIxMDAiPgo8cmVjdCB3aWR0aD0iNTYiIGhlaWdodD0iMTAwIiBmaWxsPSIjZjhkMjAzIj48L3JlY3Q+CjxwYXRoIGQ9Ik0yOCA2NkwwIDUwTDAgMTZMMjggMEw1NiAxNkw1NiA1MEwyOCA2NkwyOCAxMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZjYyOSIgc3Ryb2tlLXdpZHRoPSIyIj48L3BhdGg+CjxwYXRoIGQ9Ik0yOCAwTDI4IDM0TDAgNTBMMCA4NEwyOCAxMDBMNTYgODRMNTYgNTBMMjggMzQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZTUwMyIgc3Ryb2tlLXdpZHRoPSIyIj48L3BhdGg+Cjwvc3ZnPg==); /* image is "Pattern 069" from http://www.squidfingers.com/patterns/ */
    //background-image: -moz-repeating-linear-gradient(34% 6% 135deg,#0F1E59, #75A1BF, #3E3E63 50%);
    //background-image: -webkit-gradient(radial, center center, 20, center center, 80, from(#3c3), color-stop(0.4, #363), to(#030));
    /* yes, it's intentional that Mozilla, Webkit, Opera and IE all will get different backgrounds ... why not? :) */
  }

  &.red_card {
    color: red;
  }

  .card_content {
    height: 20px;
    font-size: $card-symbol-size;
  }
}

.button {
  -moz-box-shadow: 2px 4px 0px -2px #3dc21b;
  -webkit-box-shadow: 2px 4px 0px -2px #3dc21b;
  box-shadow: 2px 4px 0px -2px #3dc21b;
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    color-stop(0.05, #44c767),
    color-stop(1, #5cbf2a)
  );
  background: -moz-linear-gradient(top, #44c767 5%, #5cbf2a 100%);
  background: -webkit-linear-gradient(top, #44c767 5%, #5cbf2a 100%);
  background: -o-linear-gradient(top, #44c767 5%, #5cbf2a 100%);
  background: -ms-linear-gradient(top, #44c767 5%, #5cbf2a 100%);
  background: linear-gradient(to bottom, #44c767 5%, #5cbf2a 100%);
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#44c767', endColorstr='#5cbf2a',GradientType=0);
  background-color: #44c767;
  -moz-border-radius: 12px;
  -webkit-border-radius: 12px;
  border-radius: 12px;
  border: 3px solid #18ab29;
  display: inline-block;
  cursor: pointer;
  color: #ffffff;
  font-family: Arial;
  font-size: 12px;
  padding: 7px 19px;
  text-decoration: none;
  text-shadow: 0px 0px 0px #2f6627;
}
.button:hover {
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    color-stop(0.05, #5cbf2a),
    color-stop(1, #44c767)
  );
  background: -moz-linear-gradient(top, #5cbf2a 5%, #44c767 100%);
  background: -webkit-linear-gradient(top, #5cbf2a 5%, #44c767 100%);
  background: -o-linear-gradient(top, #5cbf2a 5%, #44c767 100%);
  background: -ms-linear-gradient(top, #5cbf2a 5%, #44c767 100%);
  background: linear-gradient(to bottom, #5cbf2a 5%, #44c767 100%);
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#5cbf2a', endColorstr='#44c767',GradientType=0);
  background-color: #5cbf2a;
}
.button:active {
  position: relative;
  top: 1px;
}

.button:focus {
  text-decoration: none;
  outline-style: none;
}
</style>
