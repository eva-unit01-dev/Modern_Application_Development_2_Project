export default {
    template: `
      <div>
        <h2>Influencer Statistics</h2>
        <div v-if="loading">Loading statistics...</div>
        <div v-else>
          <div>
            <h3>General Statistics</h3>
            <p>Total Influencers: {{ stats.total_influencers }}</p>
            <p>Average Followers: {{ stats.avg_followers.toFixed(2) }}</p>
            <p>Category Counts:</p>
            <ul>
              <li v-for="(count, category) in stats.category_counts" :key="category">{{ category }}: {{ count }}</li>
            </ul>
          </div>
  
          <div>
            <h3>Follower and Payment Stats</h3>
            <p>Highest Followers: {{ stats.highest_followers }}</p>
            <p>Lowest Followers: {{ stats.lowest_followers }}</p>
            <p>Highest Payment in $: {{ stats.highest_payment.toFixed(2) }}</p>
            <p>Lowest Payment in $: {{ stats.lowest_payment.toFixed(2) }}</p>
            <p>Average Payment in $: {{ stats.avg_payment.toFixed(2) }}</p>
          </div>
        </div>
      </div>
    `,
    data() {
      return {
        stats: {},
        loading: true,
      };
    },
    async mounted() {
      await this.fetchStats();
    },
    methods: {
      async fetchStats() {
        try {
          const response = await fetch('/admin_inf_stats', {
            headers: {
              'Authentication-Token': localStorage.getItem('auth-token')
            }
          });
  
          if (!response.ok) {
            throw new Error('Failed to fetch statistics.');
          }
  
          const data = await response.json();
          this.stats = data;
        } catch (error) {
          console.error('Error:', error);
        } finally {
          this.loading = false;
        }
      }
    }
  };
  