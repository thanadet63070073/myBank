<template>
  <div id="app">
    <nav v-if="active" class="navbar is-dark" role="navigation" aria-label="main navigation">
        <div id="navbarBasicExample" class="navbar-menu">
            <div class="navbar-start">
                <div class="navbar-item is-size-3">
                    My bank
                </div>
            </div>
            <div class="navbar-end">
                <div class="navbar-item"></div>
            </div>
            <div class="navbar-start">
                <router-link to="/home" class="navbar-item px-6 nav-effect">
                        <div class="icon is-medium">
                            <i class="fas fa-md fa-piggy-bank has-text-light" ></i>
                        </div>
                        <div>
                            My Bank Account
                        </div>
                </router-link>
                <router-link to="/history" class="navbar-item px-6 nav-effect">
                    <div class="icon is-medium">
                        <i class="fas fa-md fa-history has-text-light" ></i>
                    </div>
                    <div>
                        History
                    </div>
                </router-link>
            </div>

            <div class="navbar-end">
                <div class="navbar-item">
                    {{ username }}
                </div>
                <div class="navbar-item">
                    <div class="buttons" @click="logoutButton">
                        <a class="button is-danger">
                            <strong>Logout</strong>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </nav>
    <div>
      <router-view />
    </div>
  </div>
</template>

<style>
    .nav-effect:hover{
        border-bottom:3px solid white;
        margin-bottom: 1px;
    }
</style>

<script>
import axios from 'axios';

export default {
  data() {
    return {
        username: '',
        active: false,
    }
  },
  beforeUpdate(){
    if(localStorage.getItem('token') != null){
      this.active = true
    }
    else{
      this.active = false;
    }
  },
  mounted(){
    this.getUsername();
  },
  methods:{
    logoutButton(){
        localStorage.removeItem('token');
        
        this.$router.push({name: `signIn`});
    },
    getUsername(){
        var token = localStorage.getItem('token');
        axios
        .post(`http://localhost:3000/authen`, {
            token: token
        })
        .then((response) => {
            console.log(response.data)
            if(response.data.status == "ok"){
                this.username = response.data.decoded.username
            }
            else{
                localStorage.removeItem('token');
                
            }
        })
        .catch((error) => {
            this.error = error.response.data.message;
        });  
    }
  }
}

</script>

