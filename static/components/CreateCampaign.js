// export default {
//     template: `
//     <div>
//         <div v-if="error">{{ error }}</div>
//         <div v-if="success">{{ success }}</div>
//         <div v-if="sponsor && sponsor.flag_status !== 'flagged'">
//             <h1>Create Campaign</h1>
//             <form @submit.prevent="createCampaign">
//                 <label for="name">Name:</label>
//                 <input type="text" id="name" v-model="campaign.name" required>
//                 <label for="description">Description:</label>
//                 <input type="text" id="description" v-model="campaign.description" required>
//                 <label for="sdate">Start Date:</label>
//                 <input type="date" id="sdate" v-model="campaign.sdate" required>
//                 <label for="edate">End Date:</label>
//                 <input type="date" id="edate" v-model="campaign.edate" required>
//                 <label for="budget">Budget:</label>
//                 <input type="number" id="budget" v-model="campaign.budget" required>
//                 <label for="visibility">Visibility:</label>
//                 <select id="visibility" v-model="campaign.visibility" required>
//                     <option value="public">Public</option>
//                     <option value="private">Private</option>
//                 </select>
               
//                 <button type="submit">Create Campaign</button>
//             </form>
//         </div>
//         <div v-else-if="sponsor && sponsor.flag_status === 'flagged'">
//             <p>Your account is flagged and you cannot create campaigns.</p>
//         </div>
//         <div v-else>
//             <p>Loading sponsor details...</p>
//         </div>
//     </div>`,
//     data() {
//         return {
//             sponsor: null,
//             campaign: {
//                 name: '',
//                 description: '',
//                 sdate: '',
//                 edate: '',
//                 budget: '',
//                 visibility: 'public',
//                 completion_status: ''
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
//         const data = await res.json().catch((e) => {});
//         if (res.ok) {
//             this.sponsor = data.sponsor;
//         } else {
//             this.error = res.status === 403 ? "Access Forbidden: You do not have permission to access this resource." : res.status;
//         }
//     },
//     methods: {
//         async createCampaign() {
//             const res = await fetch(`/api/campaign`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Authentication-Token": this.token
//                 },
//                 body: JSON.stringify(this.campaign)
//             });
//             const data = await res.json().catch((e) => {});
//             if (res.ok) {
//                 this.success = "Campaign created successfully!";
//                 this.campaign = {
//                     name: '',
//                     description: '',
//                     sdate: '',
//                     edate: '',
//                     budget: '',
//                     visibility: 'public',
//                     completion_status: ''
//                 };
//             } else {
//                 this.error = res.status === 403 ? "Sponsor is flagged and cannot create campaigns." : res.status;
//             }
//         }
//     }
// };

export default {
    template: `
    <div>
        <div v-if="error">{{ error }}</div>
        <div v-if="success">{{ success }}</div>
        <div v-if="sponsor && sponsor.flag_status !== 'flagged'">
            <h1>Create Campaign</h1>
            <form @submit.prevent="createCampaign">
                <label for="name">Name:</label>
                <input type="text" id="name" v-model="campaign.name" required>
                <label for="description">Description:</label>
                <input type="text" id="description" v-model="campaign.description" required>
                <label for="sdate">Start Date:</label>
                <input type="date" id="sdate" v-model="campaign.sdate" required>
                <label for="edate">End Date:</label>
                <input type="date" id="edate" v-model="campaign.edate" required>
                <label for="budget">Budget:</label>
                <input type="number" id="budget" v-model="campaign.budget" required>
                <label for="visibility">Visibility:</label>
                <select id="visibility" v-model="campaign.visibility" required>
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                </select>
                
                <button type="submit">Create Campaign</button>
            </form>
        </div>
        <div v-else-if="sponsor && sponsor.flag_status === 'flagged'">
            <p>Your account is flagged and you cannot create campaigns.</p>
        </div>
        <div v-else>
            <p>Loading sponsor details...</p>
        </div>
    </div>`,
    data() {
        return {
            sponsor: null,
            campaign: {
                name: '',
                description: '',
                sdate: '',
                edate: '',
                budget: '',
                visibility: 'public',
                completion_status: ''
            },
            error: null,
            success: null,
            token: localStorage.getItem("auth-token")
        };
    },
    async mounted() {
        const res = await fetch("/sponsor/profile", {
            headers: {
                "Authentication-Token": this.token
            }
        });
        const data = await res.json().catch((e) => {});
        if (res.ok) {
            this.sponsor = data.sponsor;
        } else {
            this.error = res.status === 403 ? "Access Forbidden: You do not have permission to access this resource." : res.status;
        }
    },
    methods: {
        async createCampaign() {
            // Ensure the date values are in the correct format
            this.campaign.sdate = new Date(this.campaign.sdate).toISOString().split('T')[0];
            this.campaign.edate = new Date(this.campaign.edate).toISOString().split('T')[0];

            const res = await fetch(`/api/campaign`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": this.token
                },
                body: JSON.stringify({
                    
                    spon_id:this.sponsor.id,
                    name:this.campaign.name,
                    description:this.campaign.description,
                    sdate:this.campaign.sdate,
                    edate:this.campaign.edate,
                    budget:this.campaign.budget,
                    visibility:this.campaign.visibility,
                    flag_status:'Unflagged'
                    })
            });
            const data = await res.json().catch((e) => {});
            if (res.ok) {
                this.success = "Campaign created successfully!";
                this.campaign = {
                    //spon_id:this.spon_id,
                    name: '',
                    description: '',
                    sdate: '',
                    edate: '',
                    budget: '',
                    visibility: 'public',
                    completion_status: ''
                };
            } else {
                this.error = res.status === 403 ? "Sponsor is flagged and cannot create campaigns." : res.status;
            }
        }
    }
};
