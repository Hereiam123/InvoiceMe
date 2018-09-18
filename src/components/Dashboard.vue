<template>
  <div class="container-fluid" style="padding: 0px;">
    <Header v-bind:user="user"/>
    <template v-if="user != null">
        <SideNav v-bind:name="user.name" v-bind:company="user.company_name"/>
    </template>
    <template v-if="this.isactive == 'create'">
      <CreateInvoice />
    </template>
    <template v-else>
      <ViewInvoices />
    </template>
  </div>
</template>

<script>
import Header from "./Header";
import CreateInvoice from "./CreateInvoice";
import ViewInvoices from "./ViewInvoices";
import SideNav from "./SideNav";
export default {
  name: "Dashboard",
  components: {
    Header,
    CreateInvoice,
    ViewInvoices,
    SideNav
  },
  data() {
    return {
      isactive: 'create',
      title: "Invoicing App",
      user : (this.$route.params.user) ? this.$route.params.user : null
    };
  },
  mounted() {
    this.user = JSON.parse(localStorage.getItem("user"));
  }
};
</script>
