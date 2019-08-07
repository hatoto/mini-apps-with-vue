<template>
  <div class="card" @click="cardClick" v-bind:class="{ 'is-flipped': isFlipped }">
    <div class="card__face card__face--front">      
      <i class="far fa-question-circle" />
    </div>
    <div class="card__face card__face--back">
      <i v-bind:class="icon" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class OneCard extends Vue {
  @Prop() public icon!: string;
  @Prop() private idx!: string;

  private isFlipped:boolean = false; 
  
  data() {
    return {
      isFlipped: false
    };
  }

  private cardClick() {
    if (!this.isFlipped) {
      this.isFlipped = true;
      this.$emit("card-click", this.idx);
    }
  }
  public coverCard() {
    this.isFlipped = false;
  }
}
</script>

<style scoped>
</style>
