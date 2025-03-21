import Home from "./components/Home.js"
import Login from "./components/Login.js"
import Users from "./components/Users.js"
import Signup from "./components/Signup.js"
import SponsorProfile from "./components/SponsorProfile.js"
import CreateCampaign from "./components/CreateCampaign.js"
import ManageCampaigns from "./components/ManageCampaigns.js"
// import CampaignDetails from "./components/CampaignDetails.js"
//import EditCampaign from "./components/EditCampaign.js"
import CreateAdRequest from "./components/CreateAdRequest.js"
import RequestSent from "./components/RequestSent.js"
import RequestStatus from "./components/RequestStatus.js"
import SponFindInf from "./components/SponFindInf.js"
import InfProfile from "./components/InfProfile.js"
// import InfFindSpon from "./components/InfFindSpon.js"
// import InfCreateAr from "./components/InfCreateAr.js"
import InfFindCamp from "./components/InfFindCamp.js"
// import InfCreateAr from "./components/InfCreateAr.js"
import IcAr from "./components/IcAr.js"
import SentRequest from "./components/SentRequest.js"
import StatusRequest from "./components/StatusRequest.js"
import ReceivedRequests from "./components/ReceivedRequests.js"
import MyCampaigns from "./components/MyCampaigns.js"
import RequestReceived from "./components/RequestReceived.js"
import InfluencersAtWork from "./components/InfluencersAtWork.js"
import AdminInfSearch from "./components/AdminInfSearch.js"
import AdminSponSearch from "./components/AdminSponSearch.js"
import AdminCamp from "./components/AdminCamp.js"
import AdminAr from "./components/AdminAr.js"
import AdminInfStat from "./components/AdminInfStat.js"
import AdminSponStat from "./components/AdminSponStat.js"






const routes =[
    {path:'/', component:Home, name:"Home"},
    {path:'/user/login', component:Login, name:"Login"},
    {path:'/users', component:Users, name:"Users"},
    {path:'/register', component:Signup, name:"Signup"},
    {path:'/sponsor/profile', component:SponsorProfile, name:"Profile"},
    {path:'/createcampaign', component:CreateCampaign, name:"Create Campaign"},
    {path:'/manage-campaign', component:ManageCampaigns, name:"Manage Campaigns"},
    // {path:'/campaign/:id', component:CampaignDetails, name:"Campaign Details"}
    //{ path: '/campaign/edit/:id', name: 'Edit Campaign', component: EditCampaign },
    {path:'/create-ad-request/:camp_id', component:CreateAdRequest, name:"CreateAdRequest", props: route => ({ camp_id: route.params.camp_id })},
    {path:'/manage-adreq', component:RequestSent, name:"Request Sent"},
    {path:'/sponsor-adreq-status', component:RequestStatus, name:"Request Status"},
    {path:'/sponfindinf', component:SponFindInf, name:"Find Influencers"},
    {path:'/inf/prof', component:InfProfile, name:"InfProfile"},
    // {path: '/find-campaigns',name: 'Find Campaigns', component: InfFindSpon},
    // {path: '/create-ad-requestt/:camp_Id',name: 'InfCreateAr',component: InfCreateAr}
    {path:'/inffindcamp', component:InfFindCamp, name:"Find Campaign"},
    {path:'/createar-inf', component:IcAr, name:"Create_Ad_Request"},
    {path:'/manage-inf-adreq', component:SentRequest, name:"Sent Request"},
    {path:'/influencer-adreq-status', component:StatusRequest, name:"Status of Request"},
    {path:'/inf-ar', component:ReceivedRequests, name:"Recieved Requests"},
    {path:'/mycamp', component:MyCampaigns, name:"My Campaigns"},
    {path:'/spon-ar', component:RequestReceived, name:"Request Received"},
    {path:'/infatw', component:InfluencersAtWork, name:"Influencers At Work"},
    {path:'/adins', component:AdminInfSearch, name:"Admin Finding Influencers"},
    {path:'/adsps', component:AdminSponSearch, name:"Admin Finding Sponsors"},
    {path:'/adcs', component:AdminCamp, name:"Admin Managing Campaign"},
    {path:'/adar', component:AdminAr, name:"Admin Seeing AdRequestStatus"},
    {path:'/adinfstat', component:AdminInfStat, name:"Influencer Statistics"},
    {path:'/adspostat', component:AdminSponStat, name:"Sponsor Statistics"},
    
      
      
    
    
    
]

export default new VueRouter({
    routes,
})