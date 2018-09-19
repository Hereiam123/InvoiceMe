// src/components/SideNav.vue
<template>
  <div>
      <span style="font-size:30px;cursor:pointer" v-on:click="openCloseNav">&#9776;</span>
      <div id="leftsidenav" class="sidenav">
          <p><em>Company: {{ company }} </em></p>
          <h3>Welcome, {{ name }}</h3>
          <p class="clickable" v-on:click="setActive('create')">Create Invoice</p>
          <p class="clickable" v-on:click="setActive('view')">View Invoices</p>
      </div>
  </div>
</template>

<script>
export default {
  name: "SideNav",
  props: ["name", "company"],
  methods: {
   setActive(option) {
      this.$parent.isactive = option;
    },
    openCloseNav() {
       this.open = !this.open;
       if(this.open){
          document.getElementById("leftsidenav").style.width = "20%";
       }
       else{
          document.getElementById("leftsidenav").style.width = "0%";  
       }
    }
  },
  data(){
    return {
      open: true
    }
  }
};
</script>

<style scoped>
  #leftsidenav{
    overflow:hidden;
    position:fixed;
    left:0;
    height:100%;
  }
</style>
