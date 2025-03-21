export default{
    template:`<div>
    <div v-if="error">{{error}}</div>
    <div v-for="(user,index) in allUsers">{{user.username}}{{user.email}} <button class="btn btn-primary"
    v-if="!user.active" @click="approve(user.id)">Approve</button></div>
    
    
    </div>`,
    data(){
        return{
            allUsers:[],
            token:localStorage.getItem("auth-token"),
            error:null,
            
        }
    },
    methods: {
        async approve(sponId){
            const res=await fetch(`/activate/spon/${sponId}`,{
                headers:{
                    "Authentication-Token":this.token,
                },
            })
            const data=await res.json()
            if(res.ok){
                alert(data.message)
            }
        },
    },
    async mounted(){
        const res=await fetch("/users", {
            headers: {
                "Authentication-Token": this.token,
            },
        })
        const data=await res.json().catch((e)=>{})
        if (res.ok){
            this.allUsers=data
        }else{
            this.error=res.status

        }
        
    },
}