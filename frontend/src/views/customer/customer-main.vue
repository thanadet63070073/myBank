<template>
  <div>
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <router-link to="/" class="navbar-item is-size-4">
          My restaurant
        </router-link>

        <a
          role="button"
          class="navbar-burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

    </nav>

    <div style="background:#FFF2E1; padding-top:10%; position:absolute; width:100%; min-height:877px">
      <div class="container is-fullwidth">
        <section class="hero box" style="padding:8%; background:#FFDFD3">
          <div class="hero-body">
            <p class="title has-text-centered">
              Welcome to customer
            </p>
          </div>
          <div class="columns">
            <div class="column"></div>
            <div class="column">
              <button class="button is-large is-success is-fullwidth" @click="employeeButton()">Employee</button>
            </div>
            <div class="column"></div>
            <div class="column">
              <button class="button is-large is-info is-fullwidth" @click="customerButton()">Customer</button>
            </div>
            <div class="column"></div>
          </div>
        </section>  
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {}
  },
  methods: {
    employeeButton(){
      this.$router.push('employee');
    },
    customerButton(){
      this.$router.push('customer')
    }
  }
}
</script>