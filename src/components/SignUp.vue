<template>
  <div class="tab-pane fade show active" id="pills-register" role="tabpanel" aria-labelledby="pills-register-tab">
    <div class="row">
      <div class="col-md-12">
          <form @submit.prevent="register">
              <div class="form-group">
                  <label for="">Name:</label>
                  <input type="text" required class="form-control" placeholder="eg Chris" v-model="model.name">
              </div>
              <div class="form-group">
                  <label for="">Email:</label>
                  <input type="email" required class="form-control" placeholder="eg chris@invoiceapp.com" v-model="model.email">
              </div>

              <div class="form-group">
                  <label for="">Company Name:</label>
                  <input type="text" required class="form-control" placeholder="eg Chris Tech" v-model="model.company_name">
              </div>
              <div class="form-group">
                  <label for="">Password:</label>
                  <input type="password" required class="form-control" placeholder="Enter Password" v-model="model.password">
              </div>
              <div class="form-group">
                  <label for="">Confirm Password:</label>
                  <input type="password" required class="form-control" placeholder="Confirm Passowrd" v-model="model.confirm_password">
              </div>
              <div class="form-group">
                  <button class="btn btn-primary" >Register</button>
                  {{ loading }}
                  {{ status }}
              </div>
          </form>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "./Header";
import axios from "axios";
export default {
  name: "SignUp",
  components: {
    Header
  },
  data() {
    return {
      model: {
        name: "",
        email: "",
        password: "",
        confirm_password: "",
        company_name: ""
      },
      loading: "",
      status: ""
    };
  },
  methods: {
    validate() {
      // checks to ensure passwords match
      if( this.model.password != this.model.confirm_password){
        return false;
      }
      return true;
    },
    register() {
      const formData = new FormData();
      let valid = this.validate();
      console.log(valid);
      if(valid){
      formData.append("name", this.model.name);
      formData.append("email", this.model.email);
      formData.append("company_name", this.model.company_name);
      formData.append("password", this.model.password);
      this.loading = "Registering you, please wait";
      // Post to server
      axios.post("http://localhost:3128/register", formData).then(res => {
          // Post a status message
          this.loading = "";
          if (res.data.status == true) {
            // now send the user to the next route
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            this.$router.push({
              name: "Dashboard",
              params: { user: res.data.user }
            });
          } else {
            this.status = res.data.message;
          }
        });
      }
      else{
        alert("Passwords do not match");
      }
    }
  }
};
</script>
