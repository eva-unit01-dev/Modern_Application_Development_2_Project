export default {
    template: `
      <div>
        <h2>Received Ad Requests</h2>
        <div v-if="loading">Loading received ad requests...</div>
        <div v-else>
          <div v-if="adRequests.length > 0">
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
                    <button @click="handleResponse(adRequest.id, 'Accepted')">Accept</button>
                    <button @click="handleResponse(adRequest.id, 'Rejected')">Reject</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else>
            <p>No received ad requests found.</p>
          </div>
        </div>
      </div>
    `,
    data() {
      return {
        adRequests: [],
        loading: true,
        token: localStorage.getItem("auth-token"),
      };
    },
    async mounted() {
      await this.fetchAdRequests();
    },
    methods: {
      async fetchAdRequests() {
        try {
          const response = await fetch('/adrequests-for-spon', {
            headers: {
              'Authentication-Token': localStorage.getItem('auth-token')
            }
          });
  
          if (!response.ok) {
            throw new Error('Failed to fetch ad requests.');
          }
  
          const data = await response.json();
          this.adRequests = data.adRequests.filter(req => req.sender === 'I' && req.req_status === 'PENDING');
        } catch (error) {
          console.error('Error:', error);
        } finally {
          this.loading = false;
        }
      },
      async handleResponse(adRequestId, status) {
        try {
          const response = await fetch(`/api/adrequest/${adRequestId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authentication-Token': localStorage.getItem('auth-token')
            },
            body: JSON.stringify({ req_status: status })
          });
  
          if (!response.ok) {
            throw new Error(`Failed to update ad request with status: ${status}`);
          }
  
          // Update the local state to reflect the change
          this.adRequests = this.adRequests.filter(adRequest => adRequest.id !== adRequestId);
        } catch (error) {
          console.error('Error:', error);
        }
      }
    }
  };
  