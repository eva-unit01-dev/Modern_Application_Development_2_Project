export default {
    template: `
    <div>
        <h1>Find Influencers</h1>
        <div>
            <input type="text" v-model="searchQuery" placeholder="Search by name or niche..." />
            <select v-model="selectedCategory">
                <option value="">All Categories</option>
                <option value="tech">tech</option>
                <option value="game">game</option>
                <option value="writing and literature">writing and literature</option>
                <option value="movies">movies</option>
                <option value="fitness">fitness</option>
                <option value="food">food</option>
                <option value="lifestyle">lifestyle</option>
                <option value="pop-Culture">pop-Culture</option>
                <option value="finance">finance</option>
                <option value="pet">pet</option>
                <option value="beauty">beauty</option>
                <option value="travel">travel</option>
                <option value="performing arts">performing arts</option>
                <option value="education">education</option>
                <option value="others">others</option>
            </select>
            <input type="number" v-model.number="followersMin" placeholder="Min Followers" />
            <input type="number" v-model.number="followersMax" placeholder="Max Followers" />
        </div>
        <div v-if="loading">Loading influencers...</div>
        <div v-if="error">{{ error }}</div>
        <div v-else>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Category</th>
                        <th>Niche</th>
                        <th>Followers</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="influencer in filteredInfluencers" :key="influencer.id">
                        <td>{{ influencer.full_name }}</td>
                        <td>{{ influencer.email }}</td>
                        <td>{{ influencer.category }}</td>
                        <td>{{ influencer.niche }}</td>
                        <td>{{ influencer.no_of_followers }}</td>
                    </tr>
                </tbody>
            </table>
            <div v-if="filteredInfluencers.length === 0">No influencers found.</div>
        </div>
    </div>`,
    data() {
        return {
            influencers: [],
            searchQuery: '',
            selectedCategory: '',
            followersMin: 0,
            followersMax: Infinity,
            loading: true,
            error: null,
            token: localStorage.getItem("auth-token")
        };
    },
    computed: {
        filteredInfluencers() {
            return this.influencers.filter(influencer => {
                return (
                    (this.searchQuery === '' || influencer.full_name.toLowerCase().includes(this.searchQuery.toLowerCase()) || influencer.niche.toLowerCase().includes(this.searchQuery.toLowerCase())) &&
                    (this.selectedCategory === '' || influencer.category === this.selectedCategory) &&
                    influencer.no_of_followers >= this.followersMin &&
                    influencer.no_of_followers <= this.followersMax
                );
            });
        }
    },
    async mounted() {
        try {
            const res = await fetch("/influencers-drop", {
                headers: {
                    "Authentication-Token": this.token
                }
            });
            const data = await res.json();
            if (res.ok) {
                this.influencers = data.influencers;
            } else {
                this.error = data.message || "Failed to load influencers.";
            }
        } catch (err) {
            this.error = "An error occurred while fetching influencers.";
        } finally {
            this.loading = false;
        }
    }
};
