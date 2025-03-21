export default {
    template: `
    <div>
        <div v-if="error">{{ error }}</div>
        <div v-if="influencer">
            <h1>Influencer Profile</h1>
            <p>Influencer ID: {{ influencer.id }}</p>
            <p>Full Name: {{ influencer.full_name }}</p>
            <p>Email: {{ influencer.email }}</p>
            <p>Category: {{ influencer.category }}</p>
            <p>Niche: {{ influencer.niche }}</p>
            <p>Number of Followers: {{ influencer.no_of_followers }}</p>
            <p>Flag Status: {{ influencer.flag_status }}</p>
            <button @click="editMode = !editMode">
                {{ editMode ? 'Cancel' : 'Edit' }}
            </button>
            <div v-if="editMode">
                <h2>Edit Influencer Profile</h2>
                <form @submit.prevent="updateProfile">
                    <label for="full_name">Full Name:</label>
                    <input type="text" id="full_name" v-model="influencer.full_name" required>
                    <label for="email">Email:</label>
                    <input type="email" id="email" v-model="influencer.email" required>
                    <label for="category">Category:</label>
                    <select id="category" v-model="influencer.category" required>
                        <option v-for="option in categories" :key="option" :value="option">{{ option }}</option>
                    </select>
                    <label for="niche">Niche:</label>
                    <input type="text" id="niche" v-model="influencer.niche">
                    <label for="no_of_followers">Number of Followers:</label>
                    <input type="number" id="no_of_followers" v-model="influencer.no_of_followers" required>
                    <label for="flag_status">Flag Status:</label>
                    <input type="text" id="flag_status" v-model="influencer.flag_status" required>
                    <button type="submit">Save</button>
                </form>
            </div>
        </div>
    </div>`,
    data() {
        return {
            influencer: null,
            error: null,
            editMode: false,
            token: localStorage.getItem("auth-token"),
            categories: ['game', 'tech', 'education', 'pet', 'beauty', 'lifestyle', 'finance', 'travel', 'food', 'performing arts', 'literature and writing', 'others']
        };
    },
    async mounted() {
        const res = await fetch("/influencer/profile", {
            headers: {
                "Authentication-Token": this.token
            }
        });
        const data = await res.json().catch((e) => {});
        if (res.ok) {
            this.influencer = data.influencer;
        } else {
            this.error = res.status === 403 ? "Access Forbidden: You do not have permission to access this resource." : res.status;
        }
    },
    methods: {
        async updateProfile() {
            const res = await fetch(`/api/influencer/${this.influencer.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": this.token
                },
                body: JSON.stringify(this.influencer)
            });
            const data = await res.json().catch((e) => {});
            if (res.ok) {
                this.influencer = data;
                this.editMode = false;
            } else {
                this.error = res.status;
            }
        }
    }
};
