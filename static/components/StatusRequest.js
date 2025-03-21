export default {
    template: `
    <div>
        <div v-if="error">{{ error }}</div>
        <div v-if="success">{{ success }}</div>
        <div v-if="loading">Loading ad requests...</div>
        <div v-else>
            <h1>Ad Requests Status</h1>
            <div v-if="adRequests.length > 0">
                <table>
                    <thead>
                        <tr>
                            <th>Campaign ID</th>
                            <th>Influencer ID</th>
                            <th>Messages</th>
                            <th>Requirements</th>
                            <th>Payment</th>
                            <th>Request Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="adRequest in adRequests" :key="adRequest.id">
                            <td>{{ adRequest.camp_id }}</td>
                            <td>{{ adRequest.inf_id }}</td>
                            <td>{{ adRequest.messeges }}</td>
                            <td>{{ adRequest.requirements }}</td>
                            <td>{{ adRequest.payment }}</td>
                            <td>{{ adRequest.req_status }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-else>
                <p>No ad requests found.</p>
            </div>
        </div>
    </div>`,
    data() {
        return {
            adRequests: [],
            error: null,
            success: null,
            loading: true,
            token: localStorage.getItem("auth-token")
        };
    },
    async mounted() {
        const res = await fetch("/influencer/adrequests/status", {
            headers: {
                "Authentication-Token": this.token
            }
        });
        const adRequestData = await res.json().catch((e) => {});
        if (res.ok) {
            this.adRequests = adRequestData.adRequests;
        } else {
            this.error = res.status === 403 ? "Access Forbidden: You do not have permission to access this resource." : adRequestData.message;
        }
        this.loading = false;
    }
};
