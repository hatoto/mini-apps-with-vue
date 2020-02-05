<template>
  <div class="inner-grid">
    <template v-if="isDisplayOnly">
      <div class="inner-square">{{gridNumber}}</div>
    </template>
    <template v-else>
      <div class="inner-square">
        <b-button :id="'popover-button-variant'+pkey">Click!</b-button>
        <b-popover class="inPopup" :target="'popover-button-variant'+pkey" variant="info" triggers="focus">
          <button 
            v-for="(value, index) in blockNumbers"
            v-bind:key="index+'_'+pkey"
            v-on:click="numberClick(value)"
            >{{value}}</button>
          
        </b-popover>
      </div>
    </template>
    <!--  -->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class InnerGrid extends Vue {
  @Prop() public gridNumber!: number;
  @Prop() public quizNumber!: number;  //如果這格是題目，會是0
  @Prop() public pkey!: string;
  @Prop() public blockNumbers!: number[];

  isDisplayOnly: boolean = true;

  created() {
    this.isDisplayOnly = this.gridNumber === this.quizNumber;
    console.info("pkey: ", this.pkey);
    console.info("gridNumber: ", this.gridNumber);
    console.info("quizNumber: ", this.quizNumber);
    console.info("blockNumbers: ", this.blockNumbers);
  }

  numberClick(val: number){
      if( val === this.gridNumber){
          this.isDisplayOnly = true;
          const index = this.blockNumbers.findIndex( value => val === value);
          this.blockNumbers.splice(index, 1);
      }
  }
}
</script>

