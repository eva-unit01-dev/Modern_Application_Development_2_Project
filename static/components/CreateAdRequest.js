// export default {
//     template: `
//     <div>
//         <div v-if="error">{{ error }}</div>
//         <div v-if="success">{{ success }}</div>
//         <div v-if="sponsor && sponsor.flag_status !== 'flagged'">
//             <h1>Create Ad Request</h1>
//             <form @submit.prevent="createAdRequest">
//                 <label for="camp_id">Campaign ID:</label>
//                 <input type="number" id="camp_id" v-model="adRequest.camp_id" required>
                
//                 <label for="inf_id">Influencer ID:</label>
//                 <input type="number" id="inf_id" v-model="adRequest.inf_id" required>
                
//                 <label for="messeges">Messages:</label>
//                 <input type="text" id="messages" v-model="adRequest.messages">
                
//                 <label for="requirements">Requirements:</label>
//                 <input type="text" id="requirements" v-model="adRequest.requirements" required>
                
//                 <label for="payment">Payment:</label>
//                 <input type="number" id="payment" v-model="adRequest.payment" required>
                
//                 <label for="req_status">Request Status:</label>
//                 <select id="req_status" v-model="adRequest.req_status">
//                     <option value="PENDING">Pending</option>
//                     <option value="APPROVED">Approved</option>
//                     <option value="REJECTED">Rejected</option>
//                 </select>

//                 <button type="submit">Create Ad Request</button>
//             </form>
//         </div>
//         <div v-else-if="sponsor && sponsor.flag_status === 'flagged'">
//             <p>Your account is flagged and you cannot create ad requests.</p>
//         </div>
//         <div v-else>
//             <p>Loading sponsor details...</p>
//         </div>
//     </div>`,
//     data() {
//         return {
//             sponsor: null,
//             adRequest: {
//                 camp_id: '',
//                 inf_id: '',
//                 messeges: '',
//                 requirements: '',
//                 payment: '',
//                 req_status: 'PENDING',
//                 sender: 'S'
//             },
//             error: null,
//             success: null,
//             token: localStorage.getItem("auth-token")
//         };
//     },
//     async mounted() {
//         const res = await fetch("/sponsor/profile", {
//             headers: {
//                 "Authentication-Token": this.token
//             }
//         });
//         const data = await res.json().catch(() => {});
//         if (res.ok) {
//             this.sponsor = data.sponsor;
//         } else {
//             this.error = res.status === 403 ? "Access Forbidden: You do not have permission to access this resource." : res.status;
//         }
//     },
//     methods: {
//         async createAdRequest() {
//             // Ensure sender is set to 'S' for sponsors
//             //this.adRequest.sender = 'S';

//             const res = await fetch(`/api/adrequest`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Authentication-Token": this.token
//                 },
//                 body: JSON.stringify(this.adRequest)
//             });
//             const data = await res.json().catch(() => {});
//             if (res.ok) {
//                 this.success = "Ad request created successfully!";
//                 this.adRequest = {
//                     camp_id: '',
//                     inf_id: '',
//                     messages: 'DEFAULT TEMPLATE',
//                     requirements: '',
//                     payment: '',
//                     req_status: 'PENDING',
//                     sender: 'S'
//                 };
//             } else {
//                 this.error = res.status === 403 ? "Sponsor is flagged and cannot create ad requests." : res.status;
//             }
//         }
//     }
// };

export default{
    template:`
    <div>
    <div v-if="error">{{ error }}</div>
    <div v-if="success">{{ success }}</div>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <h1>Create Ad Request</h1>
      <form @submit.prevent="submitAdRequest">
        <!-- Campaign ID (prefilled) -->
        <div>
          <label for="camp_id">Campaign ID:</label>
          <input type="number" id="camp_id" v-model="camp_id" readonly />
        </div>

        <!-- Influencer ID (dropdown) -->
        <div>
          <label for="inf_id">Influencer:</label>
          <select id="inf_id" v-model="adRequest.inf_id" required>
            <option value="" disabled>Select an influencer</option>
            <option v-for="inf in influencers" :key="inf.id" :value="inf.id">
              {{ inf.full_name }}
            </option>
          </select>
        </div>

        <!-- Messages -->
        <div>
          <label for="messeges">Messages:</label>
          <textarea id="messeges" v-model="adRequest.messeges" required></textarea>
        </div>

        <!-- Requirements -->
        <div>
          <label for="requirements">Requirements:</label>
          <textarea id="requirements" v-model="adRequest.requirements" required></textarea>
        </div>

        <!-- Payment -->
        <div>
          <label for="payment">Payment:</label>
          <input type="number" id="payment" v-model="adRequest.payment" required />
        </div>

        <button type="submit">Create Ad Request</button>
      </form>
    </div>
  </div>
    `,
        props: {
            camp_id: {
                type: Number,
                required: true,
            }
        },
   
        data() {
          return {
            adRequest: {
              camp_id: '', // Pre-filled from ManageCampaign.js
              inf_id: '',
              messeges: '',
              requirements: '',
              payment: ''
            },
            influencers: [], // List of influencers for the dropdown
            error: null,
            success: null,
            loading: true,
            token: localStorage.getItem("auth-token")
          };
        },
        async mounted() {
          // Fetch influencers
          const infRes = await fetch("/influencers-drop", {
            headers: {
              "Authentication-Token": this.token
            }
          });
          if (infRes.ok) {
            const infData = await infRes.json();
            this.influencers = infData.influencers;
          } else {
            this.error = "Failed to fetch influencers.";
          }
      
          // Fetch campaign ID from route params
          const camp_id = this.$route.params.camp_id;
          if (camp_id) {
            this.adRequest.camp_id = camp_id;
          }
      
          this.loading = false;
        },
        methods: {
          async submitAdRequest() {
            const res = await fetch("/api/adrequest", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authentication-Token": this.token
              },
              body: JSON.stringify({
                ...this.adRequest,
                sender: 'S' // Sender should be "S" for sponsor
              })
            });
            if (res.ok) {
              this.success = "Ad request created successfully!";
              this.adRequest = {
                camp_id: this.adRequest.camp_id, // Keep the campaign ID
                inf_id: '',
                messeges: '',
                requirements: '',
                payment: ''
              };
            } else {
              this.error = "Failed to create ad request.";
            }
          }
        }
    
};
