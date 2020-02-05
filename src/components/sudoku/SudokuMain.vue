<template>
  <div>
    <section class="control-panel">
      <b-button variant="success" v-on:click="restart">RESTART</b-button>
    </section>
    <div class="grid-container">
      <OuterGrid
        :outerGridNumber="0"
        v-for="(numbers, index) in ansInBlock"
        :inputGridNumbers="numbers"
        :inputQuizNumbers="quizInBlock[index]"
        :position="index"
        v-bind:key="index+'_'"
      />

      <!--
    #C8ADA6
    #E39B9E
    #B78F9A
    #917986
    #454452
      -->
    </div>
  </div>
</template>

<script lang="ts" src="./SudokuMain.ts" />

<style>
body {
  margin: 0;
  padding: 0;
}
section > button{
    margin-bottom: 5px;
}

div {
  overflow: hidden;
  box-sizing: border-box;
}
.outer-grid {
  position: relative;
  float: left;
  width: 33.3%;
  padding-bottom: 33.3%;
  border: 1.5px solid gray;
  background-color: #9cc;
}
.outer-square {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #e39b9e;
  /* margin: 5%; */
  display: -webkit-flex;
  -webkit-flex-wrap: wrap;
  display: flex;
  flex-wrap: wrap;
}
.inner-grid {
  width: 33.3%;
  height: 33.3%;
  border: 0.5px solid #454452;
  display: table;
}
.inner-square {
  line-height: 100%;
  font-size: 3em;
  font-weight: bold;
  display: table-cell;
  text-align: center;
  vertical-align: middle;
}

.inner-square button {
  height: 50%;
  width: 60%;
  background-color: #9cc;
}


</style>

