// // // // export default {
// // // //     template: `
// // // //     <div>
// // // //         <div v-if="error">{{ error }}</div>
// // // //         <div v-if="loading">Loading campaigns...</div>
// // // //         <div v-if="campaigns.length === 0">No unflagged campaigns available.</div>
// // // //         <div v-if="campaigns.length > 0">
// // // //             <h1>Available Campaigns</h1>
// // // //             <ul>
// // // //                 <li v-for="campaign in campaigns" :key="campaign.id">
// // // //                     <p><strong>Campaign Name:</strong> {{ campaign.name }}</p>
// // // //                     <p><strong>Description:</strong> {{ campaign.description }}</p>
// // // //                     <p><strong>Start Date:</strong> {{ campaign.sdate }}</p>
// // // //                     <p><strong>End Date:</strong> {{ campaign.edate }}</p>
// // // //                     <button @click="preFillAdRequest(campaign.id)">Create Ad Request</button>
// // // //                 </li>
// // // //             </ul>
// // // //         </div>

// // // //         <!-- Ad Request Modal -->
// // // //         <div v-if="adRequestModalOpen">
// // // //             <h2>Create Ad Request</h2>
// // // //             <form @submit.prevent="submitAdRequest">
// // // //                 <input type="hidden" v-model="adRequest.camp_id" :value="selectedCampaignId" />
// // // //                 <label for="requirements">Requirements:</label>
// // // //                 <textarea id="requirements" v-model="adRequest.requirements" required></textarea>
// // // //                 <label for="payment">Payment:</label>
// // // //                 <input type="number" id="payment" v-model="adRequest.payment" required />
// // // //                 <button type="submit">Submit</button>
// // // //                 <button type="button" @click="adRequestModalOpen = false">Cancel</button>
// // // //             </form>
// // // //         </div>
// // // //     </div>`,
// // // //     data() {
// // // //         return {
// // // //             campaigns: [],
// // // //             error: null,
// // // //             loading: true,
// // // //             adRequestModalOpen: false,
// // // //             selectedCampaignId: null,
// // // //             adRequest: {
// // // //                 camp_id: null,
// // // //                 inf_id: null,
// // // //                 requirements: '',
// // // //                 payment: ''
// // // //             },
// // // //             token: localStorage.getItem("auth-token")
// // // //         };
// // // //     },
// // // //     async mounted() {
// // // //         await this.fetchCampaigns();
// // // //     },
// // // //     methods: {
// // // //         async fetchCampaigns() {
// // // //             try {
// // // //                 const res = await fetch('/campaigns/unflagged', {
// // // //                     headers: {
// // // //                         'Authentication-Token': this.token
// // // //                     }
// // // //                 });
// // // //                 const data = await res.json();
// // // //                 if (res.ok) {
// // // //                     this.campaigns = data.campaigns;
// // // //                 } else {
// // // //                     this.error = data.message || 'Error fetching campaigns';
// // // //                 }
// // // //             } catch (err) {
// // // //                 this.error = err.message;
// // // //             } finally {
// // // //                 this.loading = false;
// // // //             }
// // // //         },
// // // //         preFillAdRequest(campaignId) {
// // // //             this.selectedCampaignId = campaignId;
// // // //             this.adRequest.camp_id = campaignId;
// // // //             this.adRequest.inf_id = this.$route.params.id; // Assuming influencer ID is in route params
// // // //             this.adRequestModalOpen = true;
// // // //         },
// // // //         async submitAdRequest() {
// // // //             try {
// // // //                 const res = await fetch('/adrequests', {
// // // //                     method: 'POST',
// // // //                     headers: {
// // // //                         'Content-Type': 'application/json',
// // // //                         'Authentication-Token': this.token
// // // //                     },
// // // //                     body: JSON.stringify(this.adRequest)
// // // //                 });
// // // //                 const data = await res.json();
// // // //                 if (res.ok) {
// // // //                     alert('Ad request submitted successfully!');
// // // //                     this.adRequestModalOpen = false;
// // // //                     // Optionally refresh the campaigns list or redirect
// // // //                 } else {
// // // //                     this.error = data.message || 'Error submitting ad request';
// // // //                 }
// // // //             } catch (err) {
// // // //                 this.error = err.message;
// // // //             }
// // // //         }
// // // //     }
// // // // };
// // // export default {
// // //     template: `
// // //     <div>
// // //         <div v-if="error">{{ error }}</div>
// // //         <div>
// // //             <h1>Find Campaigns</h1>
// // //             <div>
// // //                 <input type="text" v-model="searchTerm" placeholder="Search by industry">
// // //                 <label for="evaluation_min">Min Evaluation:</label>
// // //                 <input type="number" id="evaluation_min" v-model.number="minEvaluation" placeholder="Min evaluation">
// // //                 <label for="evaluation_max">Max Evaluation:</label>
// // //                 <input type="number" id="evaluation_max" v-model.number="maxEvaluation" placeholder="Max evaluation">
// // //                 <button @click="fetchCampaigns">Search</button>
// // //             </div>
// // //             <ul v-if="campaigns.length">
// // //                 <li v-for="campaign in campaigns" :key="campaign.id">
// // //                     <p><strong>Campaign Name:</strong> {{ campaign.name }}</p>
// // //                     <p><strong>Description:</strong> {{ campaign.description }}</p>
// // //                     <p><strong>Budget:</strong> {{ campaign.budget }}</p>
// // //                     <p><strong>Visibility:</strong> {{ campaign.visibility }}</p>
// // //                     <p><strong>Completion Status:</strong> {{ campaign.completion_status }}</p>
// // //                     <button @click="createAdRequest(campaign.id)">Create Ad Request</button>
// // //                 </li>
// // //             </ul>
// // //             <div v-if="!campaigns.length">No campaigns found</div>
// // //         </div>
// // //     </div>`,
// // //     data() {
// // //         return {
// // //             campaigns: [],
// // //             searchTerm: '',
// // //             minEvaluation: null,
// // //             maxEvaluation: null,
// // //             error: null,
// // //             token: localStorage.getItem("auth-token")
// // //         };
// // //     },
// // //     methods: {
// // //         async fetchCampaigns() {
// // //             try {
// // //                 const res = await fetch(`/campaigns/unflagged`, {
// // //                     headers: {
// // //                         "Authentication-Token": this.token
// // //                     }
// // //                 });
// // //                 const data = await res.json().catch((e) => {});
// // //                 if (res.ok) {
// // //                     this.campaigns = data.campaigns;
// // //                 } else {
// // //                     this.error = res.status;
// // //                 }
// // //             } catch (err) {
// // //                 this.error = err.message;
// // //             }
// // //         },
// // //         async createAdRequest(campaignId) {
// // //             // Save the campaignId in the local state or pass it directly to the next step
// // //             this.$router.push({ name: 'CreateAdRequest', params: { campaignId } });
// // //         }
// // //     }
// // // };


// // export default {
// //     template: `
// //       <div>
// //       <div v-if="error">{{ error }}</div>
// //       <div v-if="loading">Loading...</div>
// //       <div v-else>
// //         <div>
// //           <label for="industry">Industry:</label>
// //           <select id="industry" v-model="filter.industry">
// //             <option value="">All</option>
// //             <option v-for="industry in industries" :key="industry" :value="industry">{{ industry }}</option>
// //           </select>
          
// //           <label for="minBudget">Min Budget:</label>
// //           <input type="number" id="minBudget" v-model="filter.minBudget" />
          
// //           <label for="maxBudget">Max Budget:</label>
// //           <input type="number" id="maxBudget" v-model="filter.maxBudget" />
          
// //           <button @click="applyFilters">Apply Filters</button>
// //         </div>
        
// //         <div v-if="filteredCampaigns.length">
// //           <div v-for="campaign in filteredCampaigns" :key="campaign.id">
// //             <h2>{{ campaign.name }}</h2>
// //             <p>{{ campaign.description }}</p>
// //             <p>Budget: {{ campaign.budget }}</p>
// //             <p>Industry: {{ campaign.industry }}</p>
// //             <router-link :to="{ name: 'InfCreateAR', params: { camp_id: campaign.id } }">Send Ad Request</router-link>
// //           </div>
// //         </div>
// //         <div v-else>
// //           <p>No campaigns found.</p>
// //         </div>
// //       </div>
// //     </div>
// //   `,
// //   data() {
// //     return {
// //       campaigns: [],
// //       industries: [],
// //       filter: {
// //         industry: '',
// //         minBudget: 0,
// //         maxBudget: Infinity
// //       },
// //       loading: true,
// //       error: null,
// //       token: localStorage.getItem("auth-token")
// //     };
// //   },
// //   computed: {
// //     filteredCampaigns() {
// //       return this.campaigns.filter(campaign => {
// //         return (
// //           (this.filter.industry === '' || campaign.industry === this.filter.industry) &&
// //           campaign.budget >= this.filter.minBudget &&
// //           campaign.budget <= this.filter.maxBudget
// //         );
// //       });
// //     }
// //   },
// //   async created() {
// //     await this.fetchCampaigns();
// //     this.loading = false;
// //   },
// //   methods: {
// //     async fetchCampaigns() {
// //       try {
// //         const res = await fetch("/campaign-drop", {
// //           headers: {
// //             "Authentication-Token": this.token
// //           }
// //         });
        
// //         if (!res.ok) {
// //           throw new Error(`Error fetching campaigns: ${res.status}`);
// //         }

// //         const data = await res.json();
// //         this.campaigns = data.campaigns;
// //         this.industries = [...new Set(this.campaigns.map(c => c.industry))];
// //       } catch (err) {
// //         this.error = `Error fetching campaigns: ${err.message}`;
// //       }
// //       },
// //       filterCampaigns() {
// //         this.filteredCampaigns = this.campaigns.filter(campaign => {
// //           const matchesIndustry = this.selectedIndustry ? campaign.sponsor.industry === this.selectedIndustry : true;
// //           const matchesBudget = (!this.minBudget || campaign.budget >= this.minBudget) && 
// //                                 (!this.maxBudget || campaign.budget <= this.maxBudget);
// //           return matchesIndustry && matchesBudget;
// //         });
// //       },
// //       sendAdRequest(camp_id) {
// //         this.$router.push({ name: 'CreateAdRequest', params: { camp_id } });
// //       }
// //     }
// //   };
  
// export default {
//   template: `
//     <div>
//       <div v-if="error">{{ error }}</div>
//       <div v-if="loading">Loading...</div>
//       <div v-else>
//         <div>
//           <label for="industry">Industry:</label>
//           <select id="industry" v-model="filter.industry">
//             <option value="">All</option>
//             <option v-for="industry in industries" :key="industry" :value="industry">{{ industry }}</option>
//           </select>
          
//           <label for="minBudget">Min Budget:</label>
//           <input type="number" id="minBudget" v-model="filter.minBudget" />
          
//           <label for="maxBudget">Max Budget:</label>
//           <input type="number" id="maxBudget" v-model="filter.maxBudget" />
          
//           <button @click="applyFilters">Apply Filters</button>
//         </div>
        
//         <div v-if="filteredCampaigns.length">
//           <div v-for="campaign in filteredCampaigns" :key="campaign.id">
//             <h2>{{ campaign.name }}</h2>
//             <p>{{ campaign.description }}</p>
//             <p>Budget: {{ campaign.budget }}</p>
//             <p>Industry: {{ campaign.industry }}</p>
//             <router-link :to="{ name: 'InfCreateAR', params: { camp_id: campaign.id } }">Send Ad Request</router-link>
//           </div>
//         </div>
//         <div v-else>
//           <p>No campaigns found.</p>
//         </div>
//       </div>
//     </div>
//   `,
//   data() {
//     return {
//       campaigns: [],
//       industries: [],
//       filter: {
//         industry: '',
//         minBudget: 0,
//         maxBudget: Infinity
//       },
//       loading: true,
//       error: null,
//       token: localStorage.getItem("auth-token")
//     };
//   },
//   computed: {
//     filteredCampaigns() {
//       return this.campaigns.filter(campaign => {
//         return (
//           (this.filter.industry === '' || campaign.industry === this.filter.industry) &&
//           campaign.budget >= this.filter.minBudget &&
//           campaign.budget <= this.filter.maxBudget
//         );
//       });
//     }
//   },
//   async created() {
//     await this.fetchCampaigns();
//     this.loading = false;
//   },
//   methods: {
//     async fetchCampaigns() {
//       try {
//         const res = await fetch("/campaign-drop", {
//           headers: {
//             "Authentication-Token": this.token
//           }
//         });
        
//         if (!res.ok) {
//           throw new Error(`Error fetching campaigns: ${res.status}`);
//         }

//         const data = await res.json();
//         this.campaigns = data.campaigns;
//         this.industries = [...new Set(this.campaigns.map(c => c.industry))];
//       } catch (err) {
//         this.error = `Error fetching campaigns: ${err.message}`;
//       }
//     },
//     applyFilters() {
//       // This method can be used for any additional logic needed when applying filters
//       // Currently, the filteredCampaigns computed property will automatically re-evaluate when the filters change
//     }
//   }
// };

export default {
  template: `
    <div>
      <h1>Search Campaigns</h1>
      <div>
        <label for="industry">Industry:</label>
        <select v-model="filters.industry" id="industry">
          <option value="">All</option>
          <option v-for="industry in industries" :key="industry" :value="industry">{{ industry }}</option>
        </select>

        <label for="evaluationRange">Evaluation Range:</label>
        <input type="number" v-model="filters.minEvaluation" placeholder="Min" id="evaluationRange">
        <input type="number" v-model="filters.maxEvaluation" placeholder="Max">

        <label for="budgetRange">Budget Range:</label>
        <input type="number" v-model="filters.minBudget" placeholder="Min" id="budgetRange">
        <input type="number" v-model="filters.maxBudget" placeholder="Max">

        <button @click="applyFilters">Apply Filters</button>
      </div>
      <div v-if="error">{{ error }}</div>
      <div v-if="loading">Loading...</div>
      <div v-else>
        <div v-if="filteredCampaigns.length === 0">No campaigns found</div>
        <div v-for="campaign in filteredCampaigns" :key="campaign.id">
          
          <h2>{{ campaign.name }}</h2>
          <p>Campaign ID: {{ campaign.id }}</p>
          <p>Description: {{ campaign.description }}</p>
          <p>Campaign Budget in $: {{ campaign.budget }}</p>
          <p>Industry: {{ campaign.sponsor.industry }}</p>
          <p>Sonsor Evaluation in $: {{ campaign.sponsor.evaluation }}</p>
          
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      campaigns: [],
      filters: {
        industry: '',
        minEvaluation: '',
        maxEvaluation: '',
        minBudget: '',
        maxBudget: ''
      },
      industries: [
        'game', 'tech', 'education', 'pet', 'beauty', 'lifestyle',
        'finance', 'travel', 'food', 'performing arts', 'literature and writing', 'others'
      ],
      loading: true,
      error: null,
      token: localStorage.getItem('auth-token')
    };
  },
  computed: {
    filteredCampaigns() {
      return this.campaigns.filter(campaign => {
        const matchesIndustry = !this.filters.industry || campaign.sponsor.industry === this.filters.industry;
        const matchesEvaluation = (!this.filters.minEvaluation || campaign.sponsor.evaluation >= this.filters.minEvaluation) &&
                                  (!this.filters.maxEvaluation || campaign.sponsor.evaluation <= this.filters.maxEvaluation);
        const matchesBudget = (!this.filters.minBudget || campaign.budget >= this.filters.minBudget) &&
                              (!this.filters.maxBudget || campaign.budget <= this.filters.maxBudget);
        return matchesIndustry && matchesEvaluation && matchesBudget;
      });
    }
  },
  async created() {
    try {
      const res = await fetch('/campaigns-drop', {
        headers: {
          'Authentication-Token': this.token
        }
      });
      if (!res.ok) throw new Error('Error fetching campaigns');
      const data = await res.json();
      this.campaigns = data.campaigns;
    } catch (error) {
      this.error = error.message;
    } finally {
      this.loading = false;
    }
  },
  methods: {
    applyFilters() {
      // No need to do anything here, filters are reactive
    },
    
  }
};
