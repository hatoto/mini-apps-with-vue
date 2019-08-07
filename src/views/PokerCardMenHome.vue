<template>
  
    
    <PokerCardMen />
  
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PokerCardMen from '@/components/PokerCardMen.vue'; 

@Component({
  components: {
    PokerCardMen,
  },
})
export default class PokerCardMenHome extends Vue {}
</script>
