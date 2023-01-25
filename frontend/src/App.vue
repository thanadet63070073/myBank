<template>
  <div id="app">
    <!-- nav bar -->
    <!-- <nav class="navbar" role="navigation" aria-label="main navigation">
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

      <div id="navbarBasicExample" class="navbar-menu">

        <div class="navbar-end">
          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link">
              <span class="pl-3">{{username}}</span>
            </a>
            <div class="navbar-dropdown">
              <a class="navbar-item">Profile</a>
              <router-link to="/" class="navbar-item">Log out</router-link>
            </div>
          </div>
        </div>
      </div>
    </nav> -->

    <router-view :key="$route.fullPath" />
  </div>
</template>

<script>

export default {
  data() {
    return {}
  },
}
</script>

