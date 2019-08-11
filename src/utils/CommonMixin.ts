import { Vue, Component } from 'vue-property-decorator'
@Component
export default class CommonMixin extends Vue {
    public getUser(user: string): void {
        console.log(user)
    }
    
}


