// src/components/SignIn.vue
<template>
  <div class="tab-pane fade show active" id="pills-login" role="tabpanel" aria-labelledby="pills-login-tab">
    <div class="row">
      <div class="col-md-12">
        <form @submit.prevent="login">
            <div class="form-group">
                <label for="">Email:</label>
                <input type="email" required class="form-control" placeholder="eg chris@invoiceapp.com" v-model="model.email">
            </div>

            <div class="form-group">
                <label for="">Password:</label>
                <input type="password" required class="form-control" placeholder="Enter Password" v-model="model.password">
            </div>

            <div class="form-group">
                <button class="btn btn-primary" >Login</button>
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
  name: "SignIn",
  components: {
    Header
  },
  data() {
    return {
      model: {
        name: "",
        email: "",
        password: "",
        c_password: "",
        company_name: ""
      },
      loading: "",
      status: ""
    };
  },
  methods: {
    validate() {
      // checks to ensure passwords match
      if( this.model.password != this.model.c_password){
        return false;
      }
      return true;
    },
    login() {
     const formData = new FormData();
     formData.append("email", this.model.email);
     formData.append("password", this.model.password);
     this.loading = "Signing in";
     // Post to server
     axios.post("http://localhost:3128/login", formData).then(res => {
       // Post a status message
       console.log(res);
       this.loading = "";
       if (res.data.status == true) {
         // store the data in localStorage
         localStorage.setItem("token", res.data.token);
         localStorage.setItem("user", JSON.stringify(res.data.user));
         // now send the user to the next route
         this.$router.push({
           name: "Dashboard"
         });
       } else {
         this.status = res.data.message;
       }
     });
    }
  }
};
</script>
