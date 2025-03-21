import InfDash from "./InfDash.js"
import AdminDash from "./AdminDash.js"
import SponDash from "./SponDash.js"





export default {
    template:`<div>
    <InfDash v-if="userRole=='inf'"/>
    <AdminDash v-if="userRole=='admin'"/>
    <SponDash v-if="userRole=='spon'"/>
    
    </div>`,

    data(){
        return {
            userRole:localStorage.getItem('role'),
        }
    },
    components:{
        InfDash,
        AdminDash,
        SponDash
    }

}