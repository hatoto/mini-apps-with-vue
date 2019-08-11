import { Component, Prop, Vue } from "vue-property-decorator";
import { Mixins } from 'vue-property-decorator';
import CommonMixin from '@/utils/CommonMixin';
import MyFirestoreMixin, { DocToTodoRecordMap } from '@/utils/MyFirestoreMixin';

@Component
export default class HelloWorld extends Mixins(CommonMixin, MyFirestoreMixin) {
  @Prop() private msg!: string;

  test(){
    this.getRecord('basic', 'match_card_records', DocToTodoRecordMap).then( resolve =>{
      console.info(resolve);
    }).catch( reason =>{ console.info(reason)});
    
  }
}
