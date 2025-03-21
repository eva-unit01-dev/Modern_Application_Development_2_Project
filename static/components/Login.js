export default{
    template:`
    <div class='d-flex justify-content-center' style="margin-top: 25vh">
    <div class="mb-3 p-5 bg-light">
        <label for="username" class="form-label">User Name</label>
        <input type="username" class="form-control" id="username" aria-describedby="emailHelp" placeholder="Enter username" v-model="cred.username">
        <small id="usernameHelp" class="form-text text-muted">We'll never share your details with anyone else.</small>
        
        <label for="password" class="form-label">Password</label>
        <input type="password" class="form-control" id="password" placeholder="Enter Password" v-model="cred.password"> 
        <button class="btn btn-primary mt-2" @click='login'>Login </button>
    </div>  
    </div>
    `,
    data(){
        return{
            cred:{
                username:null,
                password:null,
            },
            
            
        }
        
    },
    methods:{
        async login(){
            const res=await fetch("/user/login",{
                method: 'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify(this.cred),

                
            })
            if(res.ok){
                const data=await res.json()
                
                localStorage.setItem("auth-token", data.token)
                localStorage.setItem("role", data.role)
                this.$router.push({path:'/'})
            } 

        },
    },
}