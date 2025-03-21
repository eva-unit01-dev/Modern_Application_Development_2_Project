export default {
    template: `
      <div>
        <h2>Send Ad Request</h2>
        <form @submit.prevent="sendAdRequest">
          <div>
            <label for="camp_id">Campaign ID:</label>
            <input v-model="formData.camp_id" type="number" id="camp_id" required />
          </div>


          <div>
            <label for="inf_id">Influencer ID:</label>
            <input v-model="formData.inf_id" type="number" id="inf_id" required />
          </div>
          <div>
            <label for="messeges">Message:</label>
            <textarea v-model="formData.messeges" id="messeges" required></textarea>
          </div>
          <div>
            <label for="requirements">Requirements:</label>
            <textarea v-model="formData.requirements" id="requirements" required></textarea>
          </div>
          <div>
            <label for="payment">Payment:</label>
            <input v-model="formData.payment" type="number" id="payment" required />
          </div>
          <button type="submit">Send Request</button>
        </form>
      </div>
    `,
    
    data() {
      return {
        formData: {
          camp_id: '',
          inf_id: '',  // This will be the ID of the currently logged-in influencer
          messeges: '',
          requirements: '',
          payment: ''
        }
      };
    },
    methods: {
      async sendAdRequest() {
        const response = await fetch('/api/adrequest', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            camp_id: this.formData.camp_id,
            inf_id: this.formData.inf_id,  // This should be replaced with the actual logged-in influencer's ID
            messeges: this.formData.messeges,
            requirements: this.formData.requirements,
            payment: this.formData.payment,
            sender: 'I'  // Sender should be 'I' for influencers
          })
        });
  
        if (response.ok) {
          alert('Ad request sent successfully!');
          this.resetForm();
        } else {
          alert('Failed to send ad request.');
        }
      },
      resetForm() {
        this.formData = {
          camp_id: '',
          inf_id: '',
          messeges: '',
          requirements: '',
          payment: ''
        };
      }
    },
    mounted() {
      // You would need to fetch the current influencer's ID here
      // Example: this.formData.inf_id = this.getInfluencerId();
    }
  };
  