import { Component, Prop, Vue } from "vue-property-decorator";
import { Mixins } from 'vue-property-decorator';
import CommonMixin from '@/utils/CommonMixin';


@Component
export default class HelloWorld extends Mixins(CommonMixin) {
  @Prop() private msg!: string;

  
}
