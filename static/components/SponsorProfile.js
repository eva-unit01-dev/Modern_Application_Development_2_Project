// export default {
//     template: `
//     <div>
//         <h1>Sponsor Profile</h1>
//         <div v-if="loading">Loading...</div>
//         <div v-if="error">{{ error }}</div>
//         <div v-else>
//             <p><strong>ID:</strong> {{ sponsor.id }}</p>
//             <p><strong>Name:</strong> {{ sponsor.full_name }}</p>
//             <p><strong>Email:</strong> {{ sponsor.email }}</p>
//             <p><strong>Company:</strong> {{ sponsor.industry }}</p>
//             <p><strong>Type:</strong> {{ sponsor.spon_type }}</p>
//             <p><strong>Evaluation in $:</strong> {{ sponsor.evaluation }}</p>
//         </div>
//     </div>`,
//     data() {
//         return {
//             sponsor: {},
//             loading: true,
//             error: null,
//             token: localStorage.getItem("auth-token"),
//         };
//     },
//     methods: {
//         async fetchSponsorDetails() {
//             try {
//                 const res = await fetch('/sponsor/profile', {                                          
//                     method: 'GET',
//                     headers: {
//                         'Authentication-Token': this.token
//                     }
//                 });
//                 const data = await res.json();
//                 if (res.ok) {
//                     this.sponsor = data.sponsor;
//                 } else {
//                     this.error = res.status;
//                 }
//             } catch (err) {
//                 this.error = err.message;
//             } finally {
//                 this.loading = false;
//             }
//         }
//     },
//     async mounted() {
//         await this.fetchSponsorDetails();
//     }
// };


// //const res=await fetch (`/api/sponsor/${id}`, {
// //})


export default {
    template: `
    <div>
        <div v-if="error">{{ error }}</div>
        <div v-if="sponsor">
            <h1>Sponsor Profile</h1>
            <p>Full Name: {{ sponsor.full_name }}</p>
            <p>Email: {{ sponsor.email }}</p>
            <p>Industry: {{ sponsor.industry }}</p>
            <p>Evaluation: {{ sponsor.evaluation }}</p>
            <p>Flag Status: {{ sponsor.flag_status }}</p>
            <p>Sponsor Type: {{ sponsor.spon_type }}</p>
            <button @click="editMode = true">Edit</button>
        </div>
        <div v-if="editMode">
            <h2>Edit Sponsor Profile</h2>
            <form @submit.prevent="updateProfile">
                <label for="full_name">Full Name:</label>
                <input type="text" id="full_name" v-model="sponsor.full_name" required>
                <label for="email">Email:</label>
                <input type="email" id="email" v-model="sponsor.email" required>
                <label for="industry">Industry:</label>
                <input type="text" id="industry" v-model="sponsor.industry" required>
                <label for="evaluation">Evaluation:</label>
                <input type="text" id="evaluation" v-model="sponsor.evaluation" required>
                <label for="flag_status">Flag Status:</label>
                <input type="text" id="flag_status" v-model="sponsor.flag_status" required>
                <label for="spon_type">Sponsor Type:</label>
                <input type="text" id="spon_type" v-model="sponsor.spon_type" required>
                <button type="submit">Save</button>
                <button type="button" @click="editMode = false">Cancel</button>
            </form>
        </div>
    </div>`,
    data() {
        return {
            sponsor: null,
            error: null,
            editMode: false,
            token: localStorage.getItem("auth-token")
        };
    },
    async mounted() {
        const res = await fetch("/sponsor/profile", {
            headers: {
                "Authentication-Token": this.token
            }
        });
        const data = await res.json().catch((e) => {});
        if (res.ok) {
            this.sponsor = data.sponsor;
        } else {
            this.error = res.status === 403 ? "Access Forbidden: You do not have permission to access this resource." : res.status;
        }
    },
    methods: {
        async updateProfile() {
            const res = await fetch(`/api/sponsor/${this.sponsor.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": this.token
                },
                body: JSON.stringify(this.sponsor)
            });
            const data = await res.json().catch((e) => {});
            if (res.ok) {
                this.sponsor = data;
                this.editMode = false;
            } else {
                this.error = res.status;
            }
        }
    }
};
