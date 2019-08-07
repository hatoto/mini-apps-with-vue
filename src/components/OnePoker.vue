<template>
  <section
    class="card"
    @click="cardClick"
    v-bind:class="{ 'red_card': isRed, 'covered': isCovered }"
  >
    <div class="card_content">{{card_number}}</div>

    <div class="card_content" v-html="the_shape"></div>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class OnePoker extends Vue {
  @Prop() public shape!: string;
  @Prop() private idx!: number;
  @Prop() private displayOnly!: boolean;

  private isFlipped: boolean = false;
  isDisplayOnly: boolean = true;

  characterMap: Map<number, string> = new Map([
    [11, "J"],
    [12, "Q"],
    [13, "K"]
  ]);
  isRed: boolean = false;
  card_number: string = "";
  the_shape: string = "";
  isCovered: boolean = false;

  created() {
    this.isDisplayOnly = this.displayOnly === undefined ? true : false;
    if (["hearts", "diams"].indexOf(this.shape) > -1) {
      this.isRed = true;
    }

    if( this.shape === undefined){
      return;
    }

    this.the_shape = "&" + this.shape + ";";
    if (this.idx == 1) {
      this.card_number = "A";
    } else if (this.idx > 10) {
      this.card_number = this.characterMap.get(this.idx) || "";
    } else {
      this.card_number = this.idx + "";
    }
  }

  cardClick() {
    if (this.isCovered || this.isDisplayOnly) {
      return;
    }

    this.$emit("card-click", this.shape, this.idx);
    this.isCovered = true;
  }
  coverCard() {
    this.isCovered = true;
  }
}
</script>

<style scoped>
</style>
