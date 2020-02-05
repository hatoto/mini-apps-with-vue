<template>
  <div class="outer-grid">
    <div class="outer-square">
      <InnerGrid
        v-for="(number, index) in gridNumbers"
        :gridNumber="number"
        :quizNumber="inputQuizNumbers[index]"
        :blockNumbers="blockNumbers"
        v-bind:key="index+'_'+position"
        :pkey="index+'_'+position"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Mixins } from "vue-property-decorator";
import CommonMixin from "@/utils/CommonMixin";
import InnerGrid from "@/components/sudoku/InnerGrid.vue";

@Component({
  components: {
    InnerGrid
  }
})
export default class OuterGrid extends Mixins(CommonMixin) {
  @Prop() public position!: number;
  @Prop() public inputGridNumbers!: number[];
  @Prop() public inputQuizNumbers!: number[];

  gridNumbers: number[] = [];
  blockNumbers: number[] = [];

  created() {
    this.gridNumbers = this.inputGridNumbers;

    if( this.inputGridNumbers && this.inputQuizNumbers){
        this.inputGridNumbers.forEach( (val, idx) => {
            if( val != this.inputQuizNumbers[idx]){
                this.blockNumbers.push(val);
            }
        });
    }
    //console.info('position: ', this.position);
    //console.info('gridNumbers: ', this.gridNumbers);
    //console.info('quizNumbers: ', this.inputQuizNumbers);
  }
}
</script>

