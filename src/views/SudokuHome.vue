<template>    
  <SudokuMain />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import SudokuMain from '@/components/sudoku/SudokuMain.vue'; 
// @ is an alias to /src

@Component({
  components: {
    SudokuMain,
  },
})
export default class SudokuHome extends Vue {}
</script>
