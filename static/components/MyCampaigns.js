export default {
    template: `
      <div>
        <h1>My Campaigns</h1>
        <div v-if="campaigns.length === 0">
          <p>No campaigns found.</p>
        </div>
        <div v-else>
          <ul>
            <li v-for="campaign in campaigns" :key="campaign.id">
              <h2>{{ campaign.name }}</h2>
              <p><strong>Description:</strong> {{ campaign.description }}</p>
              <p><strong>Budget:</strong> {{ campaign.budget }}</p>
              <p><strong>Start Date:</strong> {{ campaign.sdate }}</p>
              <p><strong>End Date:</strong> {{ campaign.edate }}</p>
            </li>
          </ul>
        </div>
      </div>
    `,
    data() {
      return {
        campaigns: []
      };
    },
    methods: {
      async fetchMyCampaigns() {
        try {
          const response = await fetch('/influencer/my-campaigns', {
            headers: {
              'Authentication-Token': localStorage.getItem('auth-token')
            }
          });
          if (!response.ok) {
            throw new Error('Failed to fetch campaigns');
          }
          const data = await response.json();
          this.campaigns = data.campaigns;
        } catch (error) {
          console.error(error);
          alert('Failed to fetch campaigns');
        }
      }
    },
    mounted() {
      this.fetchMyCampaigns();
    }
  };
  