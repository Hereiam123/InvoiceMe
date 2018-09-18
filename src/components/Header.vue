// src/components/Header.vue
<template>
    <nav class="navbar navbar-light bg-light">
        <span class="navbar-brand mb-0 h1">{{title}}</span>
    </nav>
</template>

<script>
import SideNav from './SideNav'
export default {
  name: "Header",
  props : ["user"],
  components: {
    SideNav
  },
  data() {
    return {
      title: "Invoicing App",
    };
  }
};
</script>
