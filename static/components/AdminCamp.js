export default {
    template: `
      <div>
        <h2>Campaign Management</h2>
        <div v-if="loading">Loading campaigns...</div>
        <div v-else>
          <table>
            <thead>
              <tr>
                <th>Campaign ID</th>
                <th>Sponsor ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Budget</th>
                <th>Visibility</th>
                <th>Flag Status</th>
                <th>Completion Status</th>
                <th>Progress</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="campaign in campaigns" :key="campaign.id">
                <td>{{ campaign.id }}</td>
                <td>{{ campaign.spon_id }}</td>
                <td>{{ campaign.name }}</td>
                <td>{{ campaign.description }}</td>
                <td>{{ campaign.sdate }}</td>
                <td>{{ campaign.edate }}</td>
                <td>{{ campaign.budget }}</td>
                <td>{{ campaign.visibility }}</td>
                <td>{{ campaign.flag_status }}</td>
                <td>{{ campaign.completion_status }}</td>
                <td>
                  <div class="progress-bar">
                    <div class="progress" :style="{ width: campaign.progress + '%' }"></div>
                  </div>
                </td>
                <td>
                  <button @click="toggleFlag(campaign)">
                    {{ campaign.flag_status === 'Flagged' ? 'Unflag' : 'Flag' }}
                  </button>
                  <button @click="toggleCompletionStatus(campaign)">
                    {{ campaign.completion_status === 'Completed' ? 'Activate' : 'Finish' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `,
    data() {
      return {
        campaigns: [],
        loading: true,
      };
    },
    async mounted() {
      await this.fetchCampaigns();
    },
    methods: {
      async fetchCampaigns() {
        try {
          const response = await fetch('/camplist', {
            headers: {
              'Authentication-Token': localStorage.getItem('auth-token')
            }
          });
  
          if (!response.ok) {
            throw new Error('Failed to fetch campaigns.');
          }
  
          const data = await response.json();
          this.campaigns = data.campaigns.map(campaign => {
            const sdate = new Date(campaign.sdate);
            const edate = new Date(campaign.edate);
            const today = new Date();
            const totalDays = (edate - sdate) / (1000 * 60 * 60 * 24);
            const daysPassed = (today - sdate) / (1000 * 60 * 60 * 24);
            const progress = Math.min((daysPassed / totalDays) * 100, 100);
  
            return {
              ...campaign,
              progress: progress.toFixed(2)
            };
          });
        } catch (error) {
          console.error('Error:', error);
        } finally {
          this.loading = false;
        }
      },
      async toggleFlag(campaign) {
        try {
          const updatedFlagStatus = campaign.flag_status === 'Flagged' ? 'Unflagged' : 'Flagged';
  
          const response = await fetch(`/api/campaign/${campaign.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authentication-Token': localStorage.getItem('auth-token')
            },
            body: JSON.stringify({ flag_status: updatedFlagStatus })
          });
  
          if (!response.ok) {
            throw new Error('Failed to update campaign flag status.');
          }
  
          campaign.flag_status = updatedFlagStatus;
        } catch (error) {
          console.error('Error:', error);
        }
      },
      async toggleCompletionStatus(campaign) {
        try {
          const updatedCompletionStatus = campaign.completion_status === 'Completed' ? 'Active' : 'Completed';
  
          const response = await fetch(`/api/campaign/${campaign.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authentication-Token': localStorage.getItem('auth-token')
            },
            body: JSON.stringify({ completion_status: updatedCompletionStatus })
          });
  
          if (!response.ok) {
            throw new Error('Failed to update campaign completion status.');
          }
  
          campaign.completion_status = updatedCompletionStatus;
        } catch (error) {
          console.error('Error:', error);
        }
      }
    }
  };
  