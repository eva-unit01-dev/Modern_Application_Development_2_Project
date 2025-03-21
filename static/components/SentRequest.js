export default {
    template: `
      <div>
          <div v-if="error">{{ error }}</div>
          <div v-if="success">{{ success }}</div>
          <div v-if="loading">Loading ad requests...</div>
          <div v-else>
              <h1>Manage Ad Requests</h1>
              <div v-if="influencer && adRequests.length > 0">
                  <table>
                      <thead>
                          <tr>
                              <th>Campaign ID</th>
                              <th>Influencer ID</th>
                              <th>Message</th>
                              <th>Requirements</th>
                              <th>Payment</th>
                              <th>Actions</th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr v-for="adRequest in adRequests" :key="adRequest.id">
                              <td>{{ adRequest.camp_id }}</td>
                              <td>{{ adRequest.inf_id }}</td>
                              <td>{{ adRequest.messeges }}</td>
                              <td>{{ adRequest.requirements }}</td>
                              <td>{{ adRequest.payment }}</td>
                              <td>
                                  <button @click="startEditing(adRequest)">Edit</button>
                                  <button @click="deleteAdRequest(adRequest.id)">Delete</button>
                              </td>
                          </tr>
                      </tbody>
                  </table>
              </div>
              <div v-else>
                  <p>No ad requests found or you are not authorized to view them.</p>
              </div>
              
              <!-- Edit Form -->
              <div v-if="editingAdRequest">
                  <h2>Edit Ad Request</h2>
                  <form @submit.prevent="updateAdRequest">
                      <label for="camp_id">Campaign ID:</label>
                      <input type="text" v-model="editingAdRequest.camp_id" readonly />
  
                      <label for="inf_id">Influencer ID:</label>
                      <input type="text" v-model="editingAdRequest.inf_id" readonly />
  
                      <label for="messeges">Messeges:</label>
                      <textarea v-model="editingAdRequest.messeges" required></textarea>
  
                      <label for="requirements">Requirements:</label>
                      <textarea v-model="editingAdRequest.requirements" required></textarea>

                      <label for="payment">Payment:</label>
                      <input type="number" v-model.number="editingAdRequest.payment" required/>
                      
  
                      <button type="submit">Save Changes</button>
                      <button type="button" @click="cancelEditing">Cancel</button>
                  </form>
              </div>
          </div>
      </div>`,
    data() {
      return {
        influencer: null,
        adRequests: [],
        editingAdRequest: null,
        error: null,
        success: null,
        loading: true,
        token: localStorage.getItem("auth-token")
      };
    },
    async mounted() {
      const res = await fetch("/influencer/profile", {
        headers: {
          "Authentication-Token": this.token
        }
      });
      const influencerData = await res.json().catch((e) => {});
      if (res.ok) {
        this.influencer = influencerData.influencer;
        const adRequestRes = await fetch("/influencer/adrequests", {
          headers: {
            "Authentication-Token": this.token
          }
        });
        const adRequestData = await adRequestRes.json().catch((e) => {});
        if (adRequestRes.ok) {
          this.adRequests = adRequestData.adRequests.filter(req => req.req_status === 'PENDING');
        } else {
          this.error = "Failed to fetch ad requests.";
        }
      } else {
        this.error = res.status === 403 ? "Access Forbidden: You do not have permission to access this resource." : res.status;
      }
      this.loading = false;
    },
    methods: {
      startEditing(adRequest) {
        this.editingAdRequest = { ...adRequest }; // Copy ad request for editing
      },
      async updateAdRequest() {
        const res = await fetch(`/api/adrequest/${this.editingAdRequest.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": this.token
          },
          body: JSON.stringify(this.editingAdRequest)
        });
        const data = await res.json().catch((e) => {});
        if (res.ok) {
          const index = this.adRequests.findIndex(req => req.id === this.editingAdRequest.id);
          this.adRequests[index] = this.editingAdRequest;
          this.editingAdRequest = null;
          this.success = "Ad request updated successfully!";
        } else {
          this.error = "Failed to update ad request.";
        }
      },
      cancelEditing() {
        this.editingAdRequest = null;
      },
      async deleteAdRequest(adRequestId) {
        if (confirm("Are you sure you want to delete this ad request?")) {
          const res = await fetch(`/api/adrequest/${adRequestId}`, {
            method: "DELETE",
            headers: {
              "Authentication-Token": this.token
            }
          });
          if (res.ok) {
            this.success = "Ad request deleted successfully!";
            this.adRequests = this.adRequests.filter(adRequest => adRequest.id !== adRequestId);
          } else {
            this.error = "Failed to delete ad request.";
          }
        }
      }
    }
  };
  
// export default {
//     template: `
//       <div>
//         <div v-if="error">{{ error }}</div>
//         <div v-if="success">{{ success }}</div>
//         <div v-if="loading">Loading ad requests...</div>
//         <div v-else>
//           <h1>Sent Ad Requests</h1>
//           <div v-if="adRequests.length > 0">
//             <table>
//               <thead>
//                 <tr>
//                   <th>Campaign ID</th>
//                   <th>Influencer ID</th>
//                   <th>Message</th>
//                   <th>Requirements</th>
//                   <th>Payment</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr v-for="adRequest in adRequests" :key="adRequest.id">
//                   <td>{{ adRequest.camp_id }}</td>
//                   <td>{{ adRequest.inf_id }}</td>
//                   <td>{{ adRequest.messeges }}</td>
//                   <td>{{ adRequest.requirements }}</td>
//                   <td>{{ adRequest.payment }}</td>
//                   <td>
//                     <button @click="startEditing(adRequest)">Edit</button>
//                     <button @click="deleteAdRequest(adRequest.id)">Delete</button>
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//           <div v-else>
//             <p>No pending ad requests found.</p>
//           </div>
  
//           <!-- Edit Form -->
//           <div v-if="editingAdRequest">
//             <h2>Edit Ad Request</h2>
//             <form @submit.prevent="updateAdRequest">
//               <label for="camp_id">Campaign ID:</label>
//               <input type="text" v-model="editingAdRequest.camp_id" readonly />
  
//               <label for="inf_id">Influencer ID:</label>
//               <input type="text" v-model="editingAdRequest.inf_id" readonly />
  
//               <label for="messeges">Message:</label>
//               <textarea v-model="editingAdRequest.messeges" required></textarea>
  
//               <label for="requirements">Requirements:</label>
//               <textarea v-model="editingAdRequest.requirements" required></textarea>
  
//               <label for="payment">Payment:</label>
//               <input type="number" v-model.number="editingAdRequest.payment" required />
  
//               <button type="submit">Save Changes</button>
//               <button type="button" @click="cancelEditing">Cancel</button>
//             </form>
//           </div>
//         </div>
//       </div>
//     `,
//     data() {
//       return {
//         adRequests: [],
//         editingAdRequest: null,
//         error: null,
//         success: null,
//         loading: true,
//         token: localStorage.getItem("auth-token")
//       };
//     },
//     async mounted() {
//       try {
//         const response = await fetch(`/api/adrequest/inf_id`, {
          
//           headers: {
//             'Authentication-Token': localStorage.getItem('auth-token')
//           }
//         });
  
//         if (response.ok) {
//           const data = await response.json();
//           this.adRequests = data.filter(req => req.req_status === 'PENDING' && req.sender === 'I');
//         } else {
//           this.error = 'Failed to fetch ad requests.';
//         }
//       } catch (error) {
//         this.error = 'An error occurred while fetching ad requests.';
//         console.error('Error fetching ad requests:', error);
//       } finally {
//         this.loading = false;
//       }
//     },
//     methods: {
//       startEditing(adRequest) {
//         this.editingAdRequest = { ...adRequest }; // Copy ad request for editing
//       },
//       async updateAdRequest() {
//         try {
//           const response = await fetch(`/api/adrequest/${this.editingAdRequest.id}`, {
//             method: 'PUT',
//             headers: {
//               'Content-Type': 'application/json',
//               'Authentication-Token': localStorage.getItem('auth-token')
//             },
//             body: JSON.stringify(this.editingAdRequest)
//           });
  
//           if (response.ok) {
//             const index = this.adRequests.findIndex(req => req.id === this.editingAdRequest.id);
//             this.adRequests.splice(index, 1, this.editingAdRequest); // Update the local list
//             this.editingAdRequest = null;
//             this.success = 'Ad request updated successfully!';
//           } else {
//             this.error = 'Failed to update ad request.';
//           }
//         } catch (error) {
//           this.error = 'An error occurred while updating the ad request.';
//           console.error('Error updating ad request:', error);
//         }
//       },
//       cancelEditing() {
//         this.editingAdRequest = null;
//       },
//       async deleteAdRequest(adRequestId) {
//         if (confirm('Are you sure you want to delete this ad request?')) {
//           try {
//             const response = await fetch(`/api/adrequest/${adRequestId}`, {
//               method: 'DELETE',
//               headers: {
//                 'Authentication-Token': localStorage.getItem('auth-token')
//               }
//             });
  
//             if (response.ok) {
//               this.adRequests = this.adRequests.filter(adRequest => adRequest.id !== adRequestId);
//               this.success = 'Ad request deleted successfully!';
//             } else {
//               this.error = 'Failed to delete ad request.';
//             }
//           } catch (error) {
//             this.error = 'An error occurred while deleting the ad request.';
//             console.error('Error deleting ad request:', error);
//           }
//         }
//       }
//     }
//   };
  