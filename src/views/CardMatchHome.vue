<template>
  
    
    <CardMatch msg="Welcome to Your Vue.js"/>
  
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import CardMatch from '@/components/CardMatch.vue'; // @ is an alias to /src

@Component({
  components: {
    CardMatch,
  },
})
export default class CardMatchHome extends Vue {}
</script>
