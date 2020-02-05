import { Vue, Component } from 'vue-property-decorator'
import Sudoku from './Sudoku'
@Component
export default class CommonMixin extends Vue {
    

    createSudokuQuiz() {
        const su = new Sudoku();
        su._newGame()   

        
        const quizWrapper = [];
        if (su.matrix) {
            var chunk = 9;

            for (let i = 0, j = su.matrix.length; i < j; i += chunk) {
                let tempArray = su.matrix.slice(i, i + chunk);
                quizWrapper.push(tempArray)
            }
        }


        const answerWrapper = [];
        if (su.save) {
            var chunk = 9;

            for (let i = 0, j = su.save.length; i < j; i += chunk) {
                let tempArray = su.save.slice(i, i + chunk);
                answerWrapper.push(tempArray)
            }
        }


        return { quiz: quizWrapper, ans: answerWrapper}  
    }
}


