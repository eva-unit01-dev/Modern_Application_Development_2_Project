// export default {
//     template: `
//       <div>
//         <h2>Influencer Search</h2>
//         <div v-if="loading">Loading influencers...</div>
//         <div v-else>
//           <div v-if="influencers.length > 0">
//             <table>
//               <thead>
//                 <tr>
//                   <th>ID</th>
//                   <th>Full Name</th>
//                   <th>Email</th>
//                   <th>Category</th>
//                   <th>Niche</th>
//                   <th>Followers</th>
//                   <th>Flag Status</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr v-for="influencer in influencers" :key="influencer.id">
//                   <td>{{ influencer.id }}</td>
//                   <td>{{ influencer.full_name }}</td>
//                   <td>{{ influencer.email }}</td>
//                   <td>{{ influencer.category }}</td>
//                   <td>{{ influencer.niche }}</td>
//                   <td>{{ influencer.no_of_followers }}</td>
//                   <td>{{ influencer.flag_status }}</td>
//                   <td>
//                     <button v-if="influencer.flag_status === 'Unflagged'" @click="toggleFlagStatus(influencer.id, 'Flagged')">Flag</button>
//                     <button v-else @click="toggleFlagStatus(influencer.id, 'Unflagged')">Unflag</button>
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//           <div v-else>
//             <p>No influencers found.</p>
//           </div>
//         </div>
//       </div>
//     `,
//     data() {
//       return {
//         influencers: [],
//         loading: true,
//         token: localStorage.getItem("auth-token"),
//       };
//     },
//     async mounted() {
//       await this.fetchInfluencers();
//     },
//     methods: {
//       async fetchInfluencers() {
//         try {
//           const response = await fetch('/inflist', {
//             headers: {
//               'Authentication-Token': this.token
//             }
//           });
  
//           if (!response.ok) {
//             throw new Error('Failed to fetch influencers.');
//           }
  
//           const data = await response.json();
//           this.influencers = data.influencers; // Assuming the response has a `influencers` array
//         } catch (error) {
//           console.error('Error:', error);
//         } finally {
//           this.loading = false;
//         }
//       },
//       async toggleFlagStatus(influencerId, newStatus) {
//         try {
//           const response = await fetch(`/api/influencer/${influencerId}`, {
//             method: 'PUT',
//             headers: {
//               'Content-Type': 'application/json',
//               'Authentication-Token': this.token
//             },
//             body: JSON.stringify({ flag_status: newStatus })
//           });
  
//           if (!response.ok) {
//             throw new Error('Failed to update flag status.');
//           }
  
//           // Update the local state to reflect the change
//           this.influencers = this.influencers.map(influencer => 
//             influencer.id === influencerId ? { ...influencer, flag_status: newStatus } : influencer
//           );
//         } catch (error) {
//           console.error('Error:', error);
//         }
//       }
//     }
//   };
  

export default {
    template: `
      <div>
        <h2>Influencer Search</h2>
        
        <div>
          <label for="categoryFilter">Category:</label>
          <select v-model="filters.category" id="categoryFilter">
            <option value="">All</option>
            <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
          </select>
  
          <label for="followerMin">Followers:</label>
          <input type="number" v-model="filters.followerMin" placeholder="Min" id="followerMin" />
          
          <input type="number" v-model="filters.followerMax" placeholder="Max" id="followerMax" />
          
          <button @click="applyFilters">Search</button>
        </div>
  
        <div v-if="loading">Loading influencers...</div>
        <div v-else>
          <div v-if="filteredInfluencers.length > 0">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Id</th>
                  <th>Email</th>
                  <th>Category</th>
                  <th>Niche</th>
                  <th>Followers</th>
                  <th>Flag Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="influencer in filteredInfluencers" :key="influencer.id">
                  <td>{{ influencer.full_name }}</td>
                  <td>{{ influencer.id }}</td>
                  <td>{{ influencer.email }}</td>
                  <td>{{ influencer.category }}</td>
                  <td>{{ influencer.niche }}</td>
                  <td>{{ influencer.no_of_followers }}</td>
                  <td>{{ influencer.flag_status }}</td>
                  <td>
                    <button v-if="influencer.flag_status === 'Unflagged'" @click="toggleFlag(influencer.id, 'Flagged')">Flag</button>
                    <button v-else @click="toggleFlag(influencer.id, 'Unflagged')">Unflag</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else>
            <p>No influencers found.</p>
          </div>
        </div>
      </div>
    `,
    data() {
      return {
        influencers: [],
        loading: true,
        filters: {
          category: '',
          followerMin: '',
          followerMax: ''
        },
        categories: ['Tech', 'game', 'Writing and Literature', 'Movies', 'Fitness', 'Food', 'lifestyle', 'Pop-Culture', 'Finance', 'Pet', 'Beauty', 'Travel', 'Performing Arts', 'Education', 'others'],
      };
    },
    computed: {
      filteredInfluencers() {
        return this.influencers.filter(influencer => {
          const categoryMatch = this.filters.category === '' || influencer.category === this.filters.category;
          const followerMinMatch = this.filters.followerMin === '' || influencer.no_of_followers >= this.filters.followerMin;
          const followerMaxMatch = this.filters.followerMax === '' || influencer.no_of_followers <= this.filters.followerMax;
          return categoryMatch && followerMinMatch && followerMaxMatch;
        });
      }
    },
    async mounted() {
      await this.fetchInfluencers();
    },
    methods: {
      async fetchInfluencers() {
        try {
          const response = await fetch('/inflist', {
            headers: {
              'Authentication-Token': localStorage.getItem('auth-token')
            }
          });
  
          if (!response.ok) {
            throw new Error('Failed to fetch influencers.');
          }
  
          const data = await response.json();
          this.influencers = data.influencers;
        } catch (error) {
          console.error('Error:', error);
        } finally {
          this.loading = false;
        }
      },
      async toggleFlag(influencerId, status) {
        try {
          const response = await fetch(`/api/influencer/${influencerId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authentication-Token': localStorage.getItem('auth-token')
            },
            body: JSON.stringify({ flag_status: status })
          });
  
          if (!response.ok) {
            throw new Error(`Failed to update influencer status to ${status}`);
          }
  
          // Update local state
          this.influencers = this.influencers.map(influencer =>
            influencer.id === influencerId ? { ...influencer, flag_status: status } : influencer
          );
        } catch (error) {
          console.error('Error:', error);
        }
      },
      applyFilters() {
        // Re-compute the filtered influencers based on current filters
        this.filteredInfluencers;
      }
    }
  };
  