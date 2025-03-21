// // export default {
// //     template: `
// //       <div>
// //         <h2>Send Ad Request</h2>
// //         <form @submit.prevent="sendAdRequest">
// //           <div>
// //             <label for="camp_id">Campaign ID:</label>
// //             <input v-model="formData.camp_id" type="number" id="camp_id" required />
// //           </div>
// //           <div>
// //             <label for="inf_id">Influencer ID:</label>
// //             <input v-model="formData.inf_id" type="number" id="inf_id" disabled />
// //           </div>
// //           <div>
// //             <label for="messeges">Message:</label>
// //             <textarea v-model="formData.messeges" id="messeges" required></textarea>
// //           </div>
// //           <div>
// //             <label for="requirements">Requirements:</label>
// //             <textarea v-model="formData.requirements" id="requirements" required></textarea>
// //           </div>
// //           <div>
// //             <label for="payment">Payment:</label>
// //             <input v-model="formData.payment" type="number" id="payment" required />
// //           </div>
// //           <button type="submit">Send Request</button>
// //         </form>
// //       </div>
// //     `,
// //     data() {
// //       return {
// //         formData: {
// //           camp_id: '',
// //           inf_id: '',  // Prefilled with logged-in influencer's ID
// //           messeges: '',
// //           requirements: '',
// //           payment: ''
// //         }
// //       };
// //     },
// //     methods: {
// //       async sendAdRequest() {
// //         const response = await fetch(`/api/adrequest`, {
// //           method: 'POST',
// //           headers: {
// //             'Content-Type': 'application/json'
// //           },
// //           body: JSON.stringify({
// //             camp_id: this.formData.camp_id,
// //             inf_id: this.formData.inf_id,  // Prefilled influencer ID
// //             messeges: this.formData.messeges,
// //             requirements: this.formData.requirements,
// //             payment: this.formData.payment,
// //             sender: 'I'  // Sender should be 'I' for influencers
// //           })
// //         });
  
// //         if (response.ok) {
// //           alert('Ad request sent successfully!');
// //           this.resetForm();
// //         } else {
// //           alert('Failed to send ad request.');
// //         }
// //       },
// //       resetForm() {
// //         this.formData = {
// //           camp_id: '',
// //           inf_id: this.formData.inf_id,  // Retain prefilled influencer ID
// //           messeges: '',
// //           requirements: '',
// //           payment: ''
// //         };
// //       }
// //     },
// //     async mounted() {
// //       // Fetch the current influencer's ID and set it in the formData
// //       try {
// //         const response = await fetch('/current-influencer'); // Endpoint to get current influencer details
// //         const data = await response.json();
// //         this.formData.inf_id = data.id; // Set the logged-in influencer's ID
// //       } catch (error) {
// //         console.error('Failed to fetch influencer ID:', error);
// //       }
// //     }
// //   };



// ////////////////////////////////////////////////////

// export default {
//     template: `
//       <div>
//         <h2>Send Ad Request</h2>
//         <form @submit.prevent="sendAdRequest">
//           <div>
//             <label for="camp_id">Campaign ID:</label>
//             <input v-model="formData.camp_id" type="number" id="camp_id" required />
//           </div>
//           <div>
//             <label for="inf_id">Influencer ID:</label>
//             <input v-model="formData.inf_id" type="number" id="inf_id" disabled />
//           </div>
//           <div>
//             <label for="messeges">Message:</label>
//             <textarea v-model="formData.messeges" id="messeges" required></textarea>
//           </div>
//           <div>
//             <label for="requirements">Requirements:</label>
//             <textarea v-model="formData.requirements" id="requirements" required></textarea>
//           </div>
//           <div>
//             <label for="payment">Payment:</label>
//             <input v-model="formData.payment" type="number" id="payment" required />
//           </div>
//           <button type="submit">Send Request</button>
//         </form>
//       </div>
//     `,
//     data() {
//       return {
//         formData: {
//           camp_id: '',
//           inf_id: '',  // Prefilled with logged-in influencer's ID
//           messeges: '',
//           requirements: '',
//           payment: ''
//         }
//       };
//     },
//     methods: {
//       async sendAdRequest() {
//         try {
//           const response = await fetch(`/api/adrequest`, {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//               'Authentication-Token': localStorage.getItem('auth-token')  // Include auth token if needed
//             },
//             body: JSON.stringify({
//               camp_id: this.formData.camp_id,
//               inf_id: this.formData.inf_id,  // Prefilled influencer ID
//               messeges: this.formData.messeges,
//               requirements: this.formData.requirements,
//               payment: this.formData.payment,
//               sender: 'I'  // Sender should be 'I' for influencers
//             })
//           });
  
//           if (response.ok) {
//             alert('Ad request sent successfully!');
//             this.resetForm();
//           } else {
//             const errorData = await response.json();
//             alert('Failed to send ad request: ' + errorData.message);
//           }
//         } catch (error) {
//           console.error('Error sending ad request:', error);
//           alert('Failed to send ad request.');
//         }
//       },
//       resetForm() {
//         this.formData = {
//           camp_id: '',
//           inf_id: this.formData.inf_id,  // Retain prefilled influencer ID
//           messeges: '',
//           requirements: '',
//           payment: ''
//         };
//       }
//     },
//     async mounted() {
//       try {
//         const response = await fetch('/current-influencer', {
//           headers: {
//             'Authentication-Token': localStorage.getItem('auth-token') // Include auth token if needed
//           }
//         });
  
//         if (response.ok) {
//           const data = await response.json();
//           this.formData.inf_id = data.id; // Set the logged-in influencer's ID
//         } else {
//           console.error('Failed to fetch influencer ID:', await response.text());
//         }
//       } catch (error) {
//         console.error('Failed to fetch influencer ID:', error);
//       }
//     }
//   };


//////////////////////////////////////////////

export default {
    template: `
      <div>
        <h1>Send Ad Request to Sponsor</h1>
        <form @submit.prevent="sendAdRequest">
          <label for="camp_id">Campaign ID:</label>
          <input type="number" v-model="form.camp_id" required />
  
          <label for="inf_id">Influencer ID:</label>
          <input type="number" v-model="form.inf_id" required readonly />
  
          <label for="messeges">Messages:</label>
          <textarea v-model="form.messeges" required></textarea>
  
          <label for="requirements">Requirements:</label>
          <textarea v-model="form.requirements" required></textarea>
  
          <label for="payment">Payment:</label>
          <input type="number" v-model="form.payment" required />
  
          <button type="submit">Send Ad Request</button>
        </form>
      </div>
    `,
    data() {
      return {
        form: {
          camp_id: '',
          inf_id: '',
          messeges: '',
          requirements: '',
          payment: '',
          sender: 'I',
        }
      };
    },
    methods: {
      async fetchCurrentInfluencerId() {
        try {
          const response = await fetch('/current-influencer-id', {
            headers: {
              'Authentication-Token': localStorage.getItem('auth-token')
            }
          });
          if (!response.ok) {
            throw new Error('Failed to fetch influencer ID');
          }
          const data = await response.json();
          this.form.inf_id = data.influencer_id;
        } catch (error) {
          console.error(error);
          alert('Failed to fetch current influencer ID');
        }
      },
      async sendAdRequest() {
        try {
          const response = await fetch('/api/adrequest', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authentication-Token': localStorage.getItem('auth-token')
            },
            body: JSON.stringify(this.form)
          });
          if (!response.ok) {
            throw new Error('Failed to send ad request');
          }
          alert('Ad request sent successfully');
        } catch (error) {
          console.error(error);
          alert('Failed to send ad request');
        }
      }
    },
    mounted() {
      this.fetchCurrentInfluencerId();
    }
  };
  

  
  