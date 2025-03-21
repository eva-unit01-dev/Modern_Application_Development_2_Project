export default {
    template: `
      <div>
        <h2>Sponsor Search</h2>
        <div>
          <input type="text" v-model="searchQuery" placeholder="Search by sponsor name...">
          <select v-model="selectedIndustry">
            <option value="">All Industries</option>
            <option v-for="industry in industries" :key="industry" :value="industry">{{ industry }}</option>
          </select>
          <label>
            Evaluation Range:
            <input type="number" v-model.number="minEvaluation" placeholder="Min">
            -
            <input type="number" v-model.number="maxEvaluation" placeholder="Max">
          </label>
          <button @click="fetchSponsors">Search</button>
        </div>
        <div v-if="loading">Loading sponsors...</div>
        <div v-else>
          <div v-if="filteredSponsors.length > 0">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Id</th>
                  <th>Email</th>
                  <th>Industry</th>
                  <th>Evaluation</th>
                  <th>Flag Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="sponsor in filteredSponsors" :key="sponsor.id">
                  <td>{{ sponsor.full_name }}</td>
                  <td>{{ sponsor.id }}</td>
                  <td>{{ sponsor.email }}</td>
                  <td>{{ sponsor.industry }}</td>
                  <td>{{ sponsor.evaluation }}</td>
                  <td>{{ sponsor.flag_status }}</td>
                  <td>
                    <button v-if="sponsor.flag_status === 'Unflagged'" @click="flagSponsor(sponsor.id)">Flag</button>
                    <button v-else @click="unflagSponsor(sponsor.id)">Unflag</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else>
            <p>No sponsors found.</p>
          </div>
        </div>
      </div>
    `,
    data() {
      return {
        sponsors: [],
        loading: true,
        searchQuery: '',
        selectedIndustry: '',
        minEvaluation: null,
        maxEvaluation: null,
        industries: ['tech', 'game', 'writing and literature', 'movies', 'fitness', 'food', 'lifestyle', 'pop-culture', 'finance', 'pet', 'beauty', 'travel', 'performing Arts', 'education', 'others'], // Add more industries if needed
      };
    },
    computed: {
      filteredSponsors() {
        return this.sponsors.filter(sponsor => {
          const matchesQuery = sponsor.full_name.toLowerCase().includes(this.searchQuery.toLowerCase());
          const matchesIndustry = this.selectedIndustry ? sponsor.industry === this.selectedIndustry : true;
          const matchesEvaluation = (!this.minEvaluation || sponsor.evaluation >= this.minEvaluation) &&
                                     (!this.maxEvaluation || sponsor.evaluation <= this.maxEvaluation);
          return matchesQuery && matchesIndustry && matchesEvaluation;
        });
      }
    },
    async mounted() {
      await this.fetchSponsors();
    },
    methods: {
      async fetchSponsors() {
        this.loading = true;
        try {
          const response = await fetch('/sponlist', {
            headers: {
              'Authentication-Token': localStorage.getItem('auth-token')
            }
          });
  
          if (!response.ok) {
            throw new Error('Failed to fetch sponsors.');
          }
  
          const data = await response.json();
          this.sponsors = data.sponsors;
        } catch (error) {
          console.error('Error:', error);
        } finally {
          this.loading = false;
        }
      },
      async flagSponsor(sponsorId) {
        try {
          const response = await fetch(`/api/sponsor/${sponsorId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authentication-Token': localStorage.getItem('auth-token')
            },
            body: JSON.stringify({ flag_status: 'Flagged' })
          });
  
          if (!response.ok) {
            throw new Error('Failed to flag sponsor.');
          }
  
          this.sponsors = this.sponsors.map(sponsor => 
            sponsor.id === sponsorId ? { ...sponsor, flag_status: 'Flagged' } : sponsor
          );
        } catch (error) {
          console.error('Error:', error);
        }
      },
      async unflagSponsor(sponsorId) {
        try {
          const response = await fetch(`/api/sponsor/${sponsorId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authentication-Token': localStorage.getItem('auth-token')
            },
            body: JSON.stringify({ flag_status: 'Unflagged' })
          });
  
          if (!response.ok) {
            throw new Error('Failed to unflag sponsor.');
          }
  
          this.sponsors = this.sponsors.map(sponsor => 
            sponsor.id === sponsorId ? { ...sponsor, flag_status: 'Unflagged' } : sponsor
          );
        } catch (error) {
          console.error('Error:', error);
        }
      }
    }
  };
  