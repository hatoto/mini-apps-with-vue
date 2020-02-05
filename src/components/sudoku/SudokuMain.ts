import { Component, Prop } from "vue-property-decorator";
import { Mixins } from 'vue-property-decorator';
import CommonMixin from '@/utils/CommonMixin';
import OuterGrid from "@/components/sudoku/OuterGrid.vue";


@Component({
    components: {
        OuterGrid
    }
})
export default class SukudoMain extends Mixins(CommonMixin) {

    ansInBlock: number[][] = [];
    quizInBlock: number[][] = [];

    mounted() {

        this.restart();
        
    }

    restart(){

        this.ansInBlock = [];
        this.quizInBlock = [];
        this.$nextTick(function() {
            const sudokuAll = this.createSudokuQuiz();
            console.log('sukudoAll:\n', sudokuAll);
    
            this.ansInBlock = this.arrangeBlocks(sudokuAll.ans);
            this.quizInBlock = this.arrangeBlocks(sudokuAll.quiz);
            
          });
    }

    arrangeBlocks(sudokuArray: any[][]) {

        const arrayInBlock: number[][] = [];

        for (let i = 0; i < 9; i++) { //每個OuterGrid

            let rowStart = 0;
            let rowEnd = 3;

            if (2 < i && i < 6) {
                rowStart = 3;
                rowEnd = 6;
            } else if (i > 5) {
                rowStart = 6;
                rowEnd = 9;
            }


            let colStart = 0;
            let colEnd = 3;

            if ([0, 3, 6].indexOf(i) > -1) {
                colStart = 0;
                colEnd = 3;
            } else if ([1, 4, 7].indexOf(i) > -1) {
                colStart = 3;
                colEnd = 6;
            } else {
                colStart = 6;
                colEnd = 9;
            }



            let numberOne: number[] = [];
            sudokuArray.slice(rowStart, rowEnd).forEach((s, index, array) => {
                numberOne = numberOne.concat(s.slice(colStart, colEnd));
                if (index === array.length - 1) {
                    arrayInBlock.push(numberOne);
                }
            });
        }

        return arrayInBlock;
    }

}
