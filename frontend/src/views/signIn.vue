<template>
   <section class="hero is-info is-fullheight">
        <div class="hero-body">
            <div class="container">
                <div class="columns is-centered">
                    <div class="column is-5">
                    <div class="box">
                        <div class="field has-text-centered">
                        <label for="" class=" is-size-2">Sign In</label>
                        </div>
                        <div class="field">
                        <label for="" class="label is-size-5">Username</label>
                        <div class="control has-icons-left">
                            <input type="email" placeholder="username" class="input is-medium" v-model="username" required>
                            <span class="icon is-small is-left">
                            <i class="fa fa-user"></i>
                            </span>
                        </div>
                        </div>
                        <div class="field">
                        <label for="" class="label is-size-5">Password</label>
                        <div class="control has-icons-left">
                            <input type="password" placeholder="*******" class="input is-medium" v-model="password" required>
                            <span class="icon is-small is-left">
                            <i class="fa fa-lock"></i>
                            </span>
                        </div>
                        </div>
                        <div class="field has-text-centered">
                            <button type="submit" class="button is-dark is-medium my-5 is-fullwidth" @click="signInButton">
                                Sign In
                            </button>
                        </div>
                        <div class="field has-text-centered">
                            <div class="is-dark is-medium my-5">
                                No Account?
                                <a class="has-text-info" @click="signUp">Sign Up</a>
                            </div>
                        </div>
                            <div class="has-background-danger-light has-text-danger p-3" v-if="error != ''">{{error}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>

import axios from 'axios'
  
export default {
data() {
    return {
        username: '',
        password: '',
        error: '',
    }
},
mounted() {
    this.checkToken();
},
methods: {
    signUp(){
        this.$router.push({name: `signUp`})
    },
    signInButton(){
        if(this.username == "" || this.password == ""){
        this.error = "Please insert all field"
        }
        else{
            axios
            .post(`http://localhost:3000/login`, {
            username: this.username,
            password: this.password
            })
            .then((response) => {
            if(response.data.status == "notFound"){
                this.error = "username or password is incorrect"
            }
            else{
                console.log(response.data);
                localStorage.setItem('token', response.data.token)
                this.$router.push({name: 'home'})
            }
            })
            .catch((error) => {
                this.error = error.response.data.message;
            });
        }
    },
    checkToken(){
        var token = localStorage.getItem('token');
        if(token == null){
            this.$router.push({name: 'signIn'});
        }
        else{
          axios
            .post(`http://localhost:3000/authen`, {
                token: token
            })
            .then((response) => {
                console.log(response.data)
            if(response.data.status == "ok"){
                this.$router.push({name: 'home'})
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
}
</script>
  
  