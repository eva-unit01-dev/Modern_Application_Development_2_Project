export default {
    template: `
      <div>
        <h1>Influencers at Work</h1>
        <div v-if="influencers.length === 0">
          <p>No influencers found.</p>
        </div>
        <div v-else>
          <ul>
            <li v-for="influencer in influencers" :key="influencer.id">
              
              <p><strong>Influencer ID:</strong> {{ influencer.id }}</p>
              <p><strong>Influencer Name:</strong> {{ influencer.full_name }}</p>
              <p><strong>Email:</strong> {{ influencer.email }}</p>
              <p><strong>Category:</strong> {{ influencer.category }}</p>
              <p><strong>Followers:</strong> {{ influencer.no_of_followers }}</p>
              
            </li>
          </ul>
        </div>
      </div>
    `,
    data() {
      return {
        influencers: []
      };
    },
    methods: {
      async fetchInfluencersAtWork() {
        try {
          const response = await fetch('/sponsor/influencers-at-work', {
            headers: {
              'Authentication-Token': localStorage.getItem('auth-token')
            }
          });
          if (!response.ok) {
            throw new Error('Failed to fetch influencers');
          }
          const data = await response.json();
          this.influencers = data.influencers;
        } catch (error) {
          console.error(error);
          alert('Failed to fetch influencers');
        }
      }
    },
    mounted() {
      this.fetchInfluencersAtWork();
    }
  };
  