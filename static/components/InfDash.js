// // export default{
// //     template: `<div>Welcome to Influencer Dashboard <button @click='downloadResource'> Download Resource </button></div>`,
// //     data(){
// //         return{
// //             iswaiting:false,
// //         }
// //     },
// //     methods:{
// //         async downloadResource(){
// //             this.iswaiting=true
// //             const res=await fetch('/download-csv')
// //             const data=await res.json()
// //             if (res.ok){
// //                 const taskId= data['task-id']
// //                 const intv=setInterval(async()=>{
// //                     const csv_res=await fetch('/get-csv/${taskId}')
// //                     if(csv_res.ok){
// //                         this.iswaiting=false
// //                         clearInterval(intv)
// //                         window.location.href='/get-csv/${taskId}'
// //                     }
// //                 }, 10)
// //             }
// //         },
// //     },
// // }
// export default {
//     template: `<div> Welcome Influencer Dashboard <button @click='downlodResource'>Download Resource</button><span v-if='isWaiting'> Waiting... </span></div> `,
//     data() {
//       return {
//         isWaiting: false,
//       }
//     },
//     methods: {
//       async downlodResource() {
//         this.isWaiting = true
//         const res = await fetch('/download-csv')
//         const data = await res.json()
//         if (res.ok) {
//           const taskId = data['task-id']
//           const intv = setInterval(async () => {
//             const csv_res = await fetch(`/get-csv/${taskId}`)
//             if (csv_res.ok) {
//               this.isWaiting = false
//               clearInterval(intv)
//               window.location.href = `/get-csv/${taskId}`
//             }
//           }, 5)
//         }
//       },
//     },
//   }

export default {
    template: `
    

      <div>
        Welcome Influencer Dashboard
        
      </div>
    `,
    
  };
