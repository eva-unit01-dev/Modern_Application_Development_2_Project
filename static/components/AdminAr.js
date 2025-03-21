export default {
    template: `
      <div>
        <h2>Ad Request Management</h2>
        <div v-if="loading">Loading ad requests...</div>
        <div v-else>
          <table>
            <thead>
              <tr>
                <th>Ad Request ID</th>
                <th>Campaign ID</th>
                <th>Influencer ID</th>
                
                <th>Sender</th>
                <th>Message</th>
                <th>Requirements</th>
                <th>Payment</th>
                <th>Request Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="adRequest in adRequests" :key="adRequest.id">
                <td>{{ adRequest.id }}</td>
                <td>{{ adRequest.camp_id }}</td>
                <td>{{ adRequest.inf_id }}</td>
                
                <td>{{ adRequest.sender }}</td>
                <td>{{ adRequest.messeges }}</td>
                <td>{{ adRequest.requirements }}</td>
                <td>{{ adRequest.payment }}</td>
                <td>{{ adRequest.req_status }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `,
    data() {
      return {
        adRequests: [],
        loading: true,
      };
    },
    async mounted() {
      await this.fetchAdRequests();
    },
    methods: {
      async fetchAdRequests() {
        try {
          const response = await fetch('/adlist', {
            headers: {
              'Authentication-Token': localStorage.getItem('auth-token')
            }
          });
  
          if (!response.ok) {
            throw new Error('Failed to fetch ad requests.');
          }
  
          const data = await response.json();
          this.adRequests = data.adRequests;
        } catch (error) {
          console.error('Error:', error);
        } finally {
          this.loading = false;
        }
      },
    }
  };
  