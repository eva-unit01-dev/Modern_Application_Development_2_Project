import router from "../router.js";

export default {
  template: `
    <div class="d-flex justify-content-center align-items-center vh-100">
      
      <div class="card shadow p-4">
        <h3 class="card-title text-center mb-4">Sign Up</h3>
        <div class="form-group mb-3">
          <input v-model="email" type="email" class="form-control" placeholder="Email" required />
        </div>
        <div class="form-group mb-4">
          <input v-model="password" type="password" class="form-control" placeholder="Password" required />
        </div>
        <div class="form-group mb-3">
          <input v-model="username" type="text" class="form-control" placeholder="User Name" required />
        </div>
        <div class="form-group mb-4">
          <select v-model="role" class="form-control">
            <option disabled value="">Select Role</option>
            <option value="inf">Influencer</option>
            <option value="spon">Sponsor</option>
          </select>
        </div>

        <!-- Influencer Specific Fields -->
        <div v-if="role === 'inf'">
          <div class="form-group mb-3">
            <input v-model="full_name" type="text" class="form-control" placeholder="Full Name" required />
          </div>
          <div class="form-group mb-3">
            <select v-model="category" class="form-control" required>
              <option disabled value="">Select Category</option>
              <option value="game">game</option>
              <option value="tech">tech</option>
              <option value="education">education</option>
              <option value="pet">pet</option>
              <option value="beauty">beauty</option>
              <option value="lifestyle">lifestyle</option>
              <option value="finance">finance</option>
              <option value="travel">travel</option>
              <option value="food">food</option>
              <option value="performing arts">performing arts</option>
              <option value="writing and literature">writing and literature</option>
              <option value="others">others</option>
            </select>
          </div>
          <div class="form-group mb-3">
            <input v-model="niche" type="text" class="form-control" placeholder="Niche (Optional)" />
          </div>
          <div class="form-group mb-3">
            <input v-model="no_of_followers" type="number" class="form-control" placeholder="Number of Followers" required />
          </div>
        </div>

        <!-- Sponsor Specific Fields -->
        <div v-if="role === 'spon'">
          <div class="form-group mb-3">
            <select v-model="spon_type" class="form-control" required>
              <option disabled value="">Select Sponsor Type</option>
              <option value="company">Company</option>
              <option value="individual">Individual</option>
            </select>
          </div>
          <div class="form-group mb-3">
            <input v-model="full_name" type="text" class="form-control" placeholder="Full Name" required />
          </div>
          <div class="form-group mb-3">
            <select v-model="industry" class="form-control" required>
              <option disabled value="">Select Industry</option>
              <option value="game">game</option>
              <option value="tech">tech</option>
              <option value="education">education</option>
              <option value="pet">pet</option>
              <option value="beauty">beauty</option>
              <option value="lifestyle">lifestyle</option>
              <option value="finance">finance</option>
              <option value="travel">travel</option>
              <option value="food">food</option>
              <option value="performing arts">performing arts</option>
              <option value="literature and writing">literature and writing</option>
              <option value="others">others</option>
            </select>
          </div>
          <div class="form-group mb-3">
            <input v-model="evaluation" type="number" class="form-control" placeholder="Evaluation" required />
          </div>
        </div>

        <button class="btn btn-primary w-100" @click="submitInfo">Submit</button>
      </div>
    </div>
  `,
  data() {
    return {

      username: "",
      email: "",
      password: "",
      role: "",
      full_name: "",
      category: "",
      niche: "",
      no_of_followers: "",
      spon_type: "",
      industry: "",
      evaluation: "",
    };
  },
  methods: {
    async submitInfo() {
      const origin = window.location.origin;
      const url = `${origin}/register`;

      let body = {
        username: this.username,
        email: this.email,
        password: this.password,
        role: this.role,
      };

      if (this.role === "inf") {
        body = {
          ...body,
          full_name: this.full_name,
          category: this.category,
          niche: this.niche,
          no_of_followers: this.no_of_followers,
        };
      } else if (this.role === "spon") {
        body = {
          ...body,
          spon_type: this.spon_type,
          full_name: this.full_name,
          industry: this.industry,
          evaluation: this.evaluation,
        };
      }

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        credentials: "same-origin",
      });

      if (res.ok) {
        const data = await res.json();
        console.log(data);
        // Handle successful sign up, e.g., redirect or store token
        router.push("/user/login");
      } else {
        const errorData = await res.json();
        console.error("Sign up failed:", errorData);
        // Handle sign up error
      }
    },
  },
};


