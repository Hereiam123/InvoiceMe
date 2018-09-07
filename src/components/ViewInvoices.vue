// src/components/ViewInvoices.vue
<template>
  <div>
    <div class="container">
      <div class="tab-pane fade show active">
        <div class="row">
          <div class="col-md-12">
            <h3>Here are a list of your Invoices</h3>
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">Invoice #</th>
                  <th scope="col">Invoice Name</th>
                  <th scope="col">Status</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                <template v-for="invoice in invoices">
                  <tr>
                    <th scope="row">{{ invoice.id }}</th>
                    <td>{{ invoice.name }}</td>
                    <td v-if="invoice.paid == 0 "> Unpaid </td>
                    <td v-else> Paid </td>
                    <td ><a href="#" class="btn btn-success">TO INVOICE</a></td></tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "ViewInvoices",
  data() {
    return {
      invoices: [],
      user: this.$route.params.user
    };
  },
  mounted() {
    this.user = JSON.parse(localStorage.getItem('user'));
    axios
      .get(`http://localhost:3128/invoice/user/${this.user.id}`)
      .then(res => {
        if (res.data.status == true) {
          console.log(res.data.invoices);
          this.invoices = res.data.invoices;
        }
      });
  }
};
</script>
