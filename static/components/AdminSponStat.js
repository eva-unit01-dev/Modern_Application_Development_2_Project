export default {
    template: `
      <div>
        <h2>Sponsor Statistics</h2>
        <div v-if="loading">Loading statistics...</div>
        <div v-else>
          <div>
            <h3>General Statistics</h3>
            <p>Total Sponsors: {{ stats.total_sponsors }}</p>
            <p>Average Evaluation: {{ stats.avg_evaluation.toFixed(2) }}</p>
            <p>Highest Evaluation: {{ stats.highest_evaluation }}</p>
            <p>Lowest Evaluation: {{ stats.lowest_evaluation }}</p>
            <p>Industry Counts:</p>
            <ul>
              <li v-for="(count, industry) in stats.industry_counts" :key="industry">{{ industry }}: {{ count }}</li>
            </ul>
          </div>
  
          <div>
            <h3>Budget Stats</h3>
            <p>Highest Budget in $: {{ stats.highest_budget.toFixed(2) }}</p>
            <p>Lowest Budget in $: {{ stats.lowest_budget.toFixed(2) }}</p>
            <p>Average Budget in $: {{ stats.avg_budget.toFixed(2) }}</p>
          </div>
  
          <div>
            <h3>Ad Request Stats</h3>
            <p>Total Ad Requests: {{ stats.total_ad_requests }}</p>
            <p>Accepted Ad Requests: {{ stats.accepted_ad_requests }}</p>
            <p>Rejected Ad Requests: {{ stats.rejected_ad_requests }}</p>
            <p>Ad Requests by Sponsors: {{ stats.ad_requests_by_sponsors }}</p>
            <p>Ad Requests by Influencers: {{ stats.ad_requests_by_influencers }}</p>
          </div>
  
          <div>
            
          </div>
        </div>
      </div>
    `,
    data() {
      return {
        stats: {},
        sponsorBudgets: [],
        loading: true,
      };
    },
    async mounted() {
      await this.fetchStats();
    },
    methods: {
      async fetchStats() {
        try {
          const response = await fetch('/admin_spon_stats', {
            headers: {
              'Authentication-Token': localStorage.getItem('auth-token')
            }
          });
  
          if (!response.ok) {
            throw new Error('Failed to fetch statistics.');
          }
  
          const data = await response.json();
          this.stats = data;
          this.sponsorBudgets = data.names.map((name, index) => ({
            name,
            budget: data.budgets[index]
          }));
        } catch (error) {
          console.error('Error:', error);
        } finally {
          this.loading = false;
        }
      }
    }
  };
  