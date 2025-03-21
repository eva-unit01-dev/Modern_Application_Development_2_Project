export default {
  template: `<div> Welcome to Sponsor Dashboard <button @click='downlodResource'>Download Report</button><span v-if='isWaiting'> Waiting... </span></div> `,
  data() {
    return {
      isWaiting: false,
      token: localStorage.getItem('auth-token')
    }
  },
  methods: {
    async downlodResource() {
      this.isWaiting = true;
      const res = await fetch('/download-csv', {
        headers:{
          "Authentication-Token":this.token,
        }
      ,})
      const data = await res.json()
      if (res.ok) {
        const taskId = data['task_id']
        const intv = setInterval(async () => {
          const csv_res = await fetch(`/get-csv/${taskId}`)
          if (csv_res.ok) {
            this.isWaiting = false
            clearInterval(intv)
            window.location.href = `/get-csv/${taskId}`
          }
        }, 1000)
      }
    },
  },
}















































































// ///////////////////////////////////////////////////////////
// // export default{
// //     template: `<div>Welcome to Sponsor Dashboard
// //     <button @click='downlodResource'>Download Report</button>
// //         <span v-if='isWaiting'> Waiting... </span>
    
    
// //     </div>`,


// //     data() {
// //         return {
// //           isWaiting: false,
// //         };
// //       },
// //       methods: {
// //         async downlodResource() {
// //         //   this.isWaiting = true;
// //           const res = await fetch('/download-csv');
// //           const data = await res.blob();
// //           if (res.ok) {
// //             // const task_id = data['task_id']
// //             // console.log(task_id)
// //             // const intv = setInterval (async () => {
// //             //   const csv_res = await fetch(`/get-csv/${task_id}`)
                
               
// //                 var a = document.createElement("a");
// //                 a.href = window.URL.createObjectURL(data);
// //                 a.download = `campaign_data.csv`;
// //                 a.click();
// //                 // this.isWaiting = false;
// //                 // clearInterval(intv);
// //                 // window.location.href = `/get-csv/${task_id}`
               
// //             }
  
              
              
// //         }
// //     },
// // }
     
// ////////////////////////////////////////////////////////////
// // // // // // export default {
// // // // // //     template: `<div> Welcome Sponsor Dashboard <button @click='downlodResource'>Download Resource</button><span v-if='isWaiting'> Waiting... </span></div> `,
// // // // // //     data() {
// // // // // //       return {
// // // // // //         isWaiting: false,
// // // // // //       }
// // // // // //     },
// // // // // //     methods: {
// // // // // //       async downlodResource() {
// // // // // //         this.isWaiting = true
// // // // // //         const res = await fetch('/download-csv')
// // // // // //         const data = await res.json()
// // // // // //         if (res.ok) {
// // // // // //           const taskId = data['task_id']
// // // // // //           const intv = setInterval(async () => {
// // // // // //             const csv_res = await fetch(`/get-csv/${taskId}`)
// // // // // //             if (csv_res.ok) {
// // // // // //               this.isWaiting = false
// // // // // //               clearInterval(intv)
// // // // // //               window.location.href = `/get-csv/${taskId}`
// // // // // //             }
// // // // // //           }, 1000)
// // // // // //         }
// // // // // //       },
// // // // // //     },
// // // // // //   }

// // export default {
// //     template: `
// //       <div>
// //         Welcome to Sponsor Dashboard
// //         <button @click="downlodResource">Download Report</button>
// //         <span v-if="isWaiting">Waiting...</span>
// //       </div>
// //     `,
  
// //     data() {
// //       return {
// //         isWaiting: false,
// //       };
// //     },
  
// //     methods: {
// //       async downlodResource() {
// //         this.isWaiting = true;
// //         try {
// //           const res = await fetch('/download-csv');
          
// //           if (!res.ok) {
// //             throw new Error(`Error: ${res.status} - ${res.statusText}`);
// //           }
  
// //           const data = await res.json();
          
// //           const task_id = data['task-id'];
          
// //           const checkCsvAvailability = async () => {
// //             try {
// //               const csv_res = await fetch(`/get-csv/${task_id}`);
              
// //               if (csv_res.ok) {
// //                 this.isWaiting = false;
// //                 clearInterval(intv);
// //                 window.location.href = `/get-csv/${task_id}`;
// //               } else if (csv_res.status === 404) {
// //                 console.log("CSV file not ready yet. Retrying...");
// //               } else {
// //                 throw new Error(`Error: ${csv_res.status} - ${csv_res.statusText}`);
// //               }
// //             } catch (error) {
// //               console.error('Error fetching CSV:', error);
// //               this.isWaiting = false;
// //               clearInterval(intv);
// //             }
// //           };
  
// //           // Check CSV availability every 1 second
// //           const intv = setInterval(checkCsvAvailability, 1000);
// //         } catch (error) {
// //           console.error('Error downloading resource:', error);
// //           this.isWaiting = false;
// //         }
// //       },
// //     },
// //   };
  

// // // export default {
// // //     template: `<div>
// // //         Welcome to Sponsor Dashboard
// // //         <button @click='downlodResource'>Download Report</button>
// // //         <span v-if='isWaiting'> Waiting... </span>
// // //       </div>`,
  
// // //     data() {
// // //       return {
// // //         isWaiting: false,
// // //       };
// // //     },
// // //     methods: {
// // //       async downlodResource() {
// // //         this.isWaiting = true;
// // //         try {
// // //           // Step 1: Initiate CSV generation
// // //           const res = await fetch('/download-csv');
          
// // //           if (!res.ok) {
// // //             throw new Error(`HTTP error! Status: ${res.status}`);
// // //           }
  
// // //           const data = await res.json();
// // //           const task_id = data['task_id'];
  
// // //           // Step 2: Polling to check if the CSV file is ready
// // //           const intv = setInterval(async () => {
// // //             try {
// // //               const csv_res = await fetch(`/get-csv/${task_id}`);
              
// // //               if (csv_res.ok) {
// // //                 this.isWaiting = false;
// // //                 clearInterval(intv);
  
// // //                 // Step 3: Handle CSV download using Blob
// // //                 const blob = await csv_res.blob();
// // //                 const url = window.URL.createObjectURL(blob);
// // //                 const link = document.createElement('a');
// // //                 link.href = url;
// // //                 link.setAttribute('download', 'campaign_report.csv');
// // //                 document.body.appendChild(link);
// // //                 link.click();
// // //                 link.parentNode.removeChild(link);
// // //               } else if (csv_res.status !== 404) {
// // //                 throw new Error(`CSV fetch error! Status: ${csv_res.status}`);
// // //               }
// // //             } catch (fetchError) {
// // //               clearInterval(intv);
// // //               console.error('Error fetching CSV:', fetchError);
// // //               this.isWaiting = false;
// // //             }
// // //           }, 1000);
// // //         } catch (error) {
// // //           console.error('Error downloading resource:', error);
// // //           this.isWaiting = false;
// // //         }
// // //       },
// // //     },
// // //   };
  

// ////////////////////////////////////////////
// // export default {
// //     template: `
// //       <div>
// //         Welcome to Sponsor Dashboard
// //         <button @click="downloadResource">Download Report</button>
// //         <span v-if="isWaiting"> Waiting... </span>
// //       </div>
// //     `,
  
// //     data() {
// //       return {
// //         isWaiting: false,
// //       };
// //     },
  
// //     methods: {
// //       async downloadResource() {
// //         this.isWaiting = true;
  
// //         try {
// //           // Step 1: Request CSV creation task
// //           const res = await fetch('/download-csv');
// //           const data = await res.json();
  
// //           if (res.ok) {
// //             const task_id = data['task_id'];
  
// //             // Step 2: Check CSV availability periodically
// //             const intv = setInterval(async () => {
// //               const csv_res = await fetch(`/get-csv/${task_id}`);
  
// //               if (csv_res.ok) {
// //                 clearInterval(intv);
// //                 this.isWaiting = false;
  
// //                 // Step 3: Handle file download using Blob
// //                 const blob = await csv_res.blob();
// //                 const url = window.URL.createObjectURL(blob);
// //                 const a = document.createElement('a');
// //                 a.href = url;
// //                 a.download = 'campaign_report.csv';
// //                 document.body.appendChild(a);
// //                 a.click();
// //                 a.remove();
// //               } else if (csv_res.status === 404) {
// //                 // Task is still pending, keep waiting
// //                 console.log('CSV not ready yet...');
// //               }
// //             }, 1000); // Poll every second
// //           } else {
// //             throw new Error('Failed to initiate CSV creation task');
// //           }
// //         } catch (error) {
// //           console.error('Error downloading resource:', error);
// //           this.isWaiting = false;
// //         }
// //       },
// //     },
// //   };
  

// /////////////////////////////////2
// // export default {
// //     template: `
// //       <div>
// //         Welcome to Sponsor Dashboard
// //         <button @click='downloadResource'>Download Report</button>
// //         <span v-if='isWaiting'> Waiting... </span>
// //       </div>
// //     `,
  
// //     data() {
// //       return {
// //         isWaiting: false,
// //       };
// //     },
  
// //     methods: {
// //       async downloadResource() {
// //         this.isWaiting = true;
  
// //         try {
// //           const token = localStorage.getItem('auth_token'); // or from wherever you're storing it
// //           const res = await fetch('/download-csv', {
// //             headers: {
// //               'Authentication-Token': localStorage.getItem('auth-token')
// //             }
// //           });
          
// //           // Check if the request was successful
// //           if (res.ok) {
// //             const data = await res.json();
// //             const task_id = data['task_id'];
  
// //             // Poll the status of the CSV generation task
// //             const intv = setInterval(async () => {
// //               const status_res = await fetch(`/get-csv-status/${task_id}`, {
// //                 headers: {
// //                   'Authentication-Token': localStorage.getItem('auth-token')
// //                 }
// //               });
  
// //               if (status_res.ok) {
// //                 const status_data = await status_res.json();
  
// //                 // Check if the CSV is ready for download
// //                 if (status_data.status === 'ready') {
// //                   clearInterval(intv);
// //                   this.isWaiting = false;
  
// //                   // Download the CSV file
// //                   const download_res = await fetch(status_data.download_url, {
// //                     headers: {
// //                       'Authentication-Token': localStorage.getItem('auth-token')
// //                     }
// //                   });
  
// //                   // Handle the download
// //                   if (download_res.ok) {
// //                     const blob = await download_res.blob();
// //                     const url = window.URL.createObjectURL(blob);
// //                     const a = document.createElement('a');
// //                     a.href = url;
// //                     a.download = 'campaign_report.csv';
// //                     document.body.appendChild(a);
// //                     a.click();
// //                     a.remove();
// //                   } else {
// //                     throw new Error('Failed to download the CSV file');
// //                   }
// //                 } else if (status_res.status === 404) {
// //                   console.log('CSV not ready yet...');
// //                 }
// //               } else {
// //                 throw new Error('Failed to get CSV status');
// //               }
// //             }, 1000);
// //           } else {
// //             throw new Error('Failed to initiate CSV creation task');
// //           }
// //         } catch (error) {
// //           console.error('Error downloading resource:', error);
// //           this.isWaiting = false;
// //         }
// //       }
// //     }
// //   }
  