<template>
  <!-- <div class="container"> -->
  <div>
    <div>
      <b-jumbotron header="Marty玩具箱" lead="使用Vue製作的小遊戲和工具" >
        <!-- <p>使用Vue製作的小遊戲和工具</p> -->
      </b-jumbotron>      
    </div>

    <b-card-group deck>
      <b-card
        title="翻牌配對遊戲"
        img-src="https://picsum.photos/600/300/?random=1"
        img-alt="Image"
        img-top
        tag="article"
        style="max-width: 20rem;"
        class="mb-2"
      >
        <b-card-text>挑戰完全配對完成最速時間！</b-card-text>

        <b-button href="/cardmatch" variant="primary">進入遊戲</b-button>
      </b-card>

      <b-card
        title="撲克牌記牌訓練"
        img-src="https://picsum.photos/600/300/?random=2"
        img-alt="Image"
        img-top
        tag="article"
        style="max-width: 20rem;"
        class="mb-2"
      >
        <b-card-text>你能記住撲克牌的出牌順序嗎？</b-card-text>

        <b-button href="/pokerorder" variant="primary">進入遊戲</b-button>
      </b-card>

      <b-card
        title="數獨"
        img-src="https://picsum.photos/600/300/?random=3"
        img-alt="Image"
        img-top
        tag="article"
        style="max-width: 20rem;"
        class="mb-2"
      >
        <b-card-text>簡易的數獨</b-card-text>

        <b-button href="/sudoku" variant="primary">進入遊戲</b-button>
      </b-card>
      <!-- <b-card bg-variant="success" text-variant="white" header="Success" class="text-center">
        <b-card-text>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</b-card-text>
      </b-card> -->
    </b-card-group>
    <div class="bg-light">
    </div>
    <div class="mt-3"></div>
    <div class="mt-3"></div>
  </div>
</template>

<script lang="ts" src="./HelloWorld.ts" />

