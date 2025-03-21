// // export default {
// //     template: `
// //     <div>
// //         <div v-if="error">{{ error }}</div>
// //         <div v-if="success">{{ success }}</div>
// //         <div v-if="loading">Loading campaigns...</div>
// //         <div v-else>
// //             <h1>Manage Campaigns</h1>
// //             <div v-if="sponsor && campaigns.length > 0">
// //                 <table>
// //                     <thead>
// //                         <tr>
// //                             <th>Name</th>
// //                             <th>Description</th>
// //                             <th>Start Date</th>
// //                             <th>End Date</th>
// //                             <th>Budget</th>
// //                             <th>Visibility</th>
// //                             <th>Actions</th>
// //                         </tr>
// //                     </thead>
// //                     <tbody>
// //                         <tr v-for="campaign in campaigns" :key="campaign.id">
// //                             <td>{{ campaign.name }}</td>
// //                             <td>{{ campaign.description }}</td>
// //                             <td>{{ campaign.sdate }}</td>
// //                             <td>{{ campaign.edate }}</td>
// //                             <td>{{ campaign.budget }}</td>
// //                             <td>{{ campaign.visibility }}</td>
// //                             <td>
// //                                 <button @click="viewDetails(campaign.id)">View</button>
// //                                 <button @click="editDetails(campaign)">Edit</button>
// //                                 <button @click="deleteCampaign(campaign.id)">Delete</button>
// //                                 <button v-if="canCreateAdRequest(campaign)" @click="createAdRequest(campaign)">Create Ad Request</button>
// //                             </td>
// //                         </tr>
// //                     </tbody>
// //                 </table>
// //             </div>
// //             <div v-else>
// //                 <p>No campaigns found or you are not authorized to view them.</p>
// //             </div>
// //         </div>
// //     </div>`,
// //     data() {
// //         return {
// //             sponsor: null,
// //             campaign: [],
// //             error: null,
// //             success: null,
// //             loading: true,
// //             token: localStorage.getItem("auth-token")
// //         };
// //     },
// //     async mounted() {
// //         const res = await fetch("/sponsor/profile", {
// //             headers: {
// //                 "Authentication-Token": this.token
// //             }
// //         });
// //         const sponsorData = await res.json().catch((e) => {});
// //         if (res.ok) {
// //             this.sponsor = sponsorData.sponsor;
// //             const campaignRes = await fetch(`/api/campaign`, {
// //                 headers: {
// //                     "Authentication-Token": this.token
// //                 }
// //             });
// //             const campaignData = await campaignRes.json().catch((e) => {});
// //             if (campaignRes.ok) {
// //                 this.campaign = campaignData.campaign;
// //             } else {
// //                 this.error = "Failed to fetch campaigns.";
// //             }
// //         } else {
// //             this.error = res.status === 403 ? "Access Forbidden: You do not have permission to access this resource." : res.status;
// //         }
// //         this.loading = false;
// //     },
// //     methods: {
// //         viewDetails(campaignId) {
// //             this.$router.push({ path: `/campaign/${campaignId}` });
// //         },
// //         editDetails(campaign) {
// //             // Implement edit details logic, possibly navigating to an edit campaign page
// //             alert(`Editing details for campaign: ${campaign.name}`);
// //         },
// //         async deleteCampaign(campaignId) {
// //             if (confirm("Are you sure you want to delete this campaign?")) {
// //                 const res = await fetch(`/api/campaign/${campaignId}`, {
// //                     method: "DELETE",
// //                     headers: {
// //                         "Authentication-Token": this.token
// //                     }
// //                 });
// //                 if (res.ok) {
// //                     this.success = "Campaign deleted successfully!";
// //                     this.campaign = this.campaign.filter(campaign => campaign.id !== campaignId);
// //                 } else {
// //                     this.error = "Failed to delete campaign.";
// //                 }
// //             }
// //         },
// //         canCreateAdRequest(campaign) {
// //             return this.sponsor.flag_status !== 'flagged' && campaign.flag_status !== 'flagged';
// //         },
// //         createAdRequest(campaign) {
// //             // Implement create ad request logic, possibly navigating to an ad request page
// //             alert(`Creating ad request for campaign: ${campaign.name}`);
// //         }
// //     }
// // };

// export default {
//     template: `
//     <div>
//         <div v-if="error">{{ error }}</div>
//         <div v-if="success">{{ success }}</div>
//         <div v-if="loading">Loading campaigns...</div>
//         <div v-else>
//             <h1>Manage Campaigns</h1>
//             <div v-if="sponsor && campaigns.length > 0">
//                 <table>
//                     <thead>
//                         <tr>
//                             <th>Name</th>
//                             <th>Description</th>
//                             <th>Start Date</th>
//                             <th>End Date</th>
//                             <th>Budget</th>
                            
//                             <th>Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         <tr v-for="campaign in campaigns" :key="campaign.id">
//                             <td>{{ campaign.name }}</td>
//                             <td>{{ campaign.description }}</td>
//                             <td>{{ campaign.sdate }}</td>
//                             <td>{{ campaign.edate }}</td>
//                             <td>{{ campaign.budget }}</td>
                            
//                             <td>
                                
//                                 <button @click="editDetails(campaign)">Edit</button>
//                                 <button @click="deleteCampaign(campaign.id)">Delete</button>
//                                 <button v-if="canCreateAdRequest(campaign)" @click="createAdRequest(campaign)">Create Ad Request</button>
//                             </td>
//                         </tr>
//                     </tbody>
//                 </table>
//             </div>
//             <div v-else>
//                 <p>No campaigns found or you are not authorized to view them.</p>
//             </div>

//             <!-- Edit Form -->
//             <div v-if="editingCampaign">
//                 <h2>Edit Campaign</h2>
//                 <form @submit.prevent="updateCampaign">
//                     <label for="name">Name:</label>
//                     <input type="text" v-model="editingCampaign.name" required />

//                     <label for="description">Description:</label>
//                     <textarea v-model="editingCampaign.description" required></textarea>

//                     <label for="sdate">Start Date:</label>
//                     <input type="date" v-model="editingCampaign.sdate" required />

//                     <label for="edate">End Date:</label>
//                     <input type="date" v-model="editingCampaign.edate" required />

//                     <label for="budget">Budget:</label>
//                     <input type="number" v-model="editingCampaign.budget" required />

//                     <label for="visibility">Visibility:</label>
//                     <input type="text" v-model="editingCampaign.visibility" required />

//                     <button type="submit">Save Changes</button>
//                     <button type="button" @click="cancelEditing">Cancel</button>
//                 </form>
//             </div>
//         </div>
//     </div>`,
//     data() {
//         return {
//             sponsor: null,
//             campaigns: [],
//             error: null,
//             success: null,
//             loading: true,
//             token: localStorage.getItem("auth-token")
//         };
//     },
//     async mounted() {
//         const res = await fetch("/sponsor/profile", {
//             headers: {
//                 "Authentication-Token": this.token
//             }
//         });
//         const sponsorData = await res.json().catch((e) => {});
//         if (res.ok) {
//             this.sponsor = sponsorData.sponsor;
//             const campaignRes = await fetch("/sponsor/campaigns", {
//                 headers: {
//                     "Authentication-Token": this.token
//                 }
//             });
//             const campaignData = await campaignRes.json().catch((e) => {});
//             if (campaignRes.ok) {
//                 this.campaigns = campaignData.campaigns;
//             } else {
//                 this.error = "Failed to fetch campaigns.";
//             }
//         } else {
//             this.error = res.status === 403 ? "Access Forbidden: You do not have permission to access this resource." : res.status;
//         }
//         this.loading = false;
//     },
//     methods: {
//         startEditing(campaign) {
//             this.editingCampaign = { ...campaign }; // Copy campaign for editing
//         },
//         async updateCampaign() {
//             const res = await fetch(`/api/campaign/${this.editingCampaign.id}`, {
//                 method: "PUT",
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Authentication-Token": this.token
//                 },
//                 body: JSON.stringify(this.editingCampaign)
//             });
//             const data = await res.json().catch((e) => {});
//             if (res.ok) {
//                 const index = this.campaigns.findIndex(c => c.id === this.editingCampaign.id);
//                 this.campaigns[index] = this.editingCampaign;
//                 this.editingCampaign = null;
//                 this.success = "Campaign updated successfully!";
//             } else {
//                 this.error = "Failed to update campaign.";
//             }
        
//         },
//         async deleteCampaign(campaignId) {
//             if (confirm("Are you sure you want to delete this campaign?")) {
//                 const res = await fetch(`/api/campaign/${campaignId}`, {
//                     method: "DELETE",
//                     headers: {
//                         "Authentication-Token": this.token
//                     }
//                 });
//                 if (res.ok) {
//                     this.success = "Campaign deleted successfully!";
//                     this.campaigns = this.campaigns.filter(campaign => campaign.id !== campaignId);
//                 } else {
//                     this.error = "Failed to delete campaign.";
//                 }
//             }
//         },
//         canCreateAdRequest(campaign) {
//             return this.sponsor.flag_status !== 'flagged' && campaign.flag_status !== 'flagged';
//         },
//         createAdRequest(campaign) {
//             // Implement create ad request logic, possibly navigating to an ad request page
//             alert(`Creating ad request for campaign: ${campaign.name}`);
//         }
//     }
// };

export default {
    template: `
    <div>
        <div v-if="error">{{ error }}</div>
        <div v-if="success">{{ success }}</div>
        <div v-if="loading">Loading campaigns...</div>
        <div v-else>
            <h1>Manage Campaigns</h1>
            <div v-if="sponsor && campaigns.length > 0">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Budget</th>
                            <th>Visibility</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="campaign in campaigns" :key="campaign.id">
                            <td>{{ campaign.name }}</td>
                            <td>{{ campaign.description }}</td>
                            <td>{{ campaign.sdate }}</td>
                            <td>{{ campaign.edate }}</td>
                            <td>{{ campaign.budget }}</td>
                            <td>{{ campaign.visibility }}</td>
                            <td>
                                <button @click="startEditing(campaign)">Edit</button>
                                <button @click="deleteCampaign(campaign.id)">Delete</button>
                                <button v-if="canCreateAdRequest(campaign)" @click="createAdRequest(campaign)">Create Ad Request</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-else>
                <p>No campaigns found or you are not authorized to view them.</p>
            </div>
            
            <!-- Edit Form -->
            <div v-if="editingCampaign">
                <h2>Edit Campaign</h2>
                <form @submit.prevent="updateCampaign">
                    <label for="name">Name:</label>
                    <input type="text" v-model="editingCampaign.name" required />

                    <label for="description">Description:</label>
                    <textarea v-model="editingCampaign.description" required></textarea>

                    <label for="sdate">Start Date:</label>
                    <input type="date" v-model="editingCampaign.sdate" required />

                    <label for="edate">End Date:</label>
                    <input type="date" v-model="editingCampaign.edate" required />

                    <label for="budget">Budget:</label>
                    <input type="number" v-model="editingCampaign.budget" required />

                    <label for="visibility">Visibility:</label>
                    <input type="text" v-model="editingCampaign.visibility" required />

                    <button type="submit">Save Changes</button>
                    <button type="button" @click="cancelEditing">Cancel</button>
                </form>
            </div>
        </div>
    </div>`,
    data() {
        return {
            sponsor: null,
            campaigns: [],
            editingCampaign: null,
            error: null,
            success: null,
            loading: true,
            token: localStorage.getItem("auth-token")
        };
    },
    async mounted() {
        const res = await fetch("/sponsor/profile", {
            headers: {
                "Authentication-Token": this.token
            }
        });
        const sponsorData = await res.json().catch((e) => {});
        if (res.ok) {
            this.sponsor = sponsorData.sponsor;
            const campaignRes = await fetch("/sponsor/campaigns", {
                headers: {
                    "Authentication-Token": this.token
                }
            });
            const campaignData = await campaignRes.json().catch((e) => {});
            if (campaignRes.ok) {
                this.campaigns = campaignData.campaigns;
            } else {
                this.error = "Failed to fetch campaigns.";
            }
        } else {
            this.error = res.status === 403 ? "Access Forbidden: You do not have permission to access this resource." : res.status;
        }
        this.loading = false;
    },
    methods: {
        startEditing(campaign) {
            this.editingCampaign = { ...campaign }; // Copy campaign for editing
        },
        async updateCampaign() {
            const res = await fetch(`/api/campaign/${this.editingCampaign.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": this.token
                },
                body: JSON.stringify(this.editingCampaign)
            });
            const data = await res.json().catch((e) => {});
            if (res.ok) {
                const index = this.campaigns.findIndex(c => c.id === this.editingCampaign.id);
                this.campaigns[index] = this.editingCampaign;
                this.editingCampaign = null;
                this.success = "Campaign updated successfully!";
            } else {
                this.error = "Failed to update campaign.";
            }
        },
        cancelEditing() {
            this.editingCampaign = null;
        },
        async deleteCampaign(campaignId) {
            if (confirm("Are you sure you want to delete this campaign?")) {
                const res = await fetch(`/api/campaign/${campaignId}`, {
                    method: "DELETE",
                    headers: {
                        "Authentication-Token": this.token
                    }
                });
                if (res.ok) {
                    this.success = "Campaign deleted successfully!";
                    this.campaigns = this.campaigns.filter(campaign => campaign.id !== campaignId);
                } else {
                    this.error = "Failed to delete campaign.";
                }
            }
        },
        canCreateAdRequest(campaign) {
            return this.sponsor.flag_status !== 'flagged' && campaign.flag_status !== 'flagged';
        },
        createAdRequest(campaign) {
            // 
            this.$router.push({ 
                name: 'CreateAdRequest', // Name of the route for the Create Ad Request component
                // query: { camp_id: campaign.id }
                params: { camp_id: campaign.id }
            });

        }
    }
};

