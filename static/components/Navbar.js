export default{
    template:`<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <a class="navbar-brand" href="#">Welcome to SyncIt</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarNav">
    <ul class="navbar-nav">
      <li class="nav-item active">
        <router-link class="nav-link" to="/">Home <span class="sr-only">(current)</span></router-link>
      </li>
      <li class="nav-item" v-if="role=='spon'">
        <router-link class="nav-link" to="/sponsor/profile">Profile</router-link>
      </li>
      <li class="nav-item" v-if="role=='inf'">
        <router-link class="nav-link" to="/inf/prof">Profile</router-link>
      </li>
      <li class="nav-item" v-if="role=='inf'">
        <router-link class="nav-link" to="/mycamp">My Campaigns</router-link>
      </li>
      <li class="nav-item" v-if="role=='spon'">
        <router-link class="nav-link" to="/infatw">Influencers at Work</router-link>
      </li>
      <li class="nav-item" v-if="role=='spon'">
        <router-link class="nav-link" to="/sponfindinf">Find Influencers</router-link>
      </li>
      <li class="nav-item" v-if="role=='inf'">
        <router-link class="nav-link" to="/inffindcamp">Find Campaigns</router-link>
      </li>
    
      <li class="nav-item" v-if="role=='spon'">
        <router-link class="nav-link" to="/createcampaign">Create Campaign</router-link>
      </li>
      <li class="nav-item" v-if="role=='inf'">
        <router-link class="nav-link" to="/createar-inf">Create Ad Request</router-link>
      </li>
      <li class="nav-item" v-if="role=='spon'">
        <router-link class="nav-link" to="/manage-campaign">Manage Campaigns</router-link>
      </li>
      <li class="nav-item" v-if="role=='spon'">
        <router-link class="nav-link" to="/manage-adreq">Request Sent</router-link>
      </li>
      <li class="nav-item" v-if="role=='spon'">
        <router-link class="nav-link" to="/spon-ar"> Requests Received </router-link>
      </li>
      <li class="nav-item" v-if="role=='inf'">
        <router-link class="nav-link" to="/inf-ar">Received Requests</router-link>
      </li>
      <li class="nav-item" v-if="role=='inf'">
        <router-link class="nav-link" to="/manage-inf-adreq">Sent Request</router-link>
      </li>
       <li class="nav-item" v-if="role=='spon'">
        <router-link class="nav-link" to="/sponsor-adreq-status">Request Status</router-link>
      </li>
      <li class="nav-item" v-if="role=='inf'">
        <router-link class="nav-link" to="/influencer-adreq-status">Status of Request</router-link>
      </li>
      <li class="nav-item" v-if="!is_login">
        <router-link class="nav-link" to="/register">Signup</router-link>
      </li>
      <li class="nav-item" v-if="!is_login">
        <router-link class="nav-link" to="/user/login">Login</router-link>
      </li>
      <li class="nav-item" v-if="role=='admin'">
        <router-link class="nav-link" to="/users">Users</router-link>
      </li>
      <li class="nav-item" v-if="role=='admin'">
        <router-link class="nav-link" to="/adins">Influencer Information</router-link>
      </li>
      <li class="nav-item" v-if="role=='admin'">
        <router-link class="nav-link" to="/adsps">Sponsor Information</router-link>
      </li>
      <li class="nav-item" v-if="role=='admin'">
        <router-link class="nav-link" to="/adcs">Campaign Information</router-link>
      </li>
      <li class="nav-item" v-if="role=='admin'">
        <router-link class="nav-link" to="/adar">Ad Request Information</router-link>
      </li>
      <li class="nav-item" v-if="role=='admin'">
        <router-link class="nav-link" to="/adinfstat">Influencer Statistics</router-link>
      </li>
       <li class="nav-item" v-if="role=='admin'">
        <router-link class="nav-link" to="/adspostat">Sponser Statistics</router-link>
      </li>
      <li class="nav-item text-end" v-if="is_login">
        <span class="nav-link" @click='logout'>Logout</span>
      </li>
      
    </ul>
  </div>
</nav>`,
data(){
    return{
        role:localStorage.getItem("role"),
        is_login: localStorage.getItem("auth-token"),
    }
},
methods:{
    logout(){
      localStorage.removeItem('auth-token')  
      localStorage.removeItem('role')
      this.$router.push('/user/login')
    },

},
}