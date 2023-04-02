<template>
    <section class="hero is-info is-fullheight">
        <div class="hero-body">
            <div class="container">
                <div class="columns is-centered">
                    <div class="column is-5">
                        <div acion="" class="box">
                            <div class="field has-text-centered">
                                <label for="" class=" is-size-2">Sign Up</label>
                            </div>
                            <div class="field">
                                <label for="" class="label is-size-5">First Name</label>
                                <div class="control has-icons-left">
                                    <input type="text" placeholder="first name" class="input is-medium" v-model="firstName" required>
                                    <span class="icon is-small is-left">
                                        <i class="fa fa-user"></i>
                                    </span>
                                </div>
                            </div>
                            <div class="field">
                                <label for="" class="label is-size-5">Last Name</label>
                                <div class="control has-icons-left">
                                    <input type="text" placeholder="last name" class="input is-medium" v-model="lastName" required>
                                    <span class="icon is-small is-left">
                                        <i class="fa fa-user"></i>
                                    </span>
                                </div>
                            </div>
                            <div class="field">
                                <label for="" class="label is-size-5">Username</label>
                                <div class="control has-icons-left">
                                    <input type="text" placeholder="username" class="input is-medium" v-model="username" required>
                                    <span class="icon is-small is-left">
                                        <i class="fa fa-user"></i>
                                    </span>
                                </div>
                            </div>
                            <div class="field">
                                <label for="" class="label is-size-5">Password</label>
                                <div class="control has-icons-left">
                                    <input type="password" placeholder="6 character minimum" class="input is-medium" v-model="password" required="required">
                                    <span class="icon is-small is-left">
                                        <i class="fa fa-lock"></i>
                                    </span>
                                </div>
                            </div>
                            <div class="field">
                                <label for="" class="label is-size-5">Confirm Password</label>
                                <div class="control has-icons-left">
                                    <input type="password" placeholder="6 character minimum" class="input is-medium" v-model="confirmPassword" required="required">
                                    <span class="icon is-small is-left">
                                        <i class="fa fa-lock"></i>
                                    </span>
                                </div>
                            </div>
                            <div class="field has-text-centered">
                                <button class="button is-dark is-medium my-5 is-fullwidth" @click="signUpButton">
                                    Sign Up
                                </button>
                            </div>
                            <div class="field has-text-centered">
                                <div class="is-dark is-medium my-5">
                                    Have an Account?
                                    <a class="has-text-info" @click="signIn">Sign in</a>
                                </div>
                            </div>
                            <div class="has-background-danger-light has-text-danger p-3" v-if="error != ''">{{error}}</div>
                            <div class="has-background-success-light has-text-success p-3" v-if="status != ''">{{status}}</div>
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
            firstName: '',
            lastName: '',
            username: '',
            password: '',
            confirmPassword: '',
            error: '',
            status: '',
        }
    },
    methods: {
        signIn(){
            this.$router.push({name: `signIn`})
        },
        signUpButton(){
            if(this.firstName == "" || this.lastName == "" || this.username == "" || this.password == "" || this.confirmPassword == ""){
                this.error = "Please insert all field"
                this.status = ""
            }
            else if(this.password.length < 6){
                this.error = "Password must have a minimum 6 characters"
                this.status = ""
            }
            else if(this.password != this.confirmPassword){
                this.error = "Password do not match"
                this.status = ""
            }
            else{
                console.log("axios")
                axios.post(`http://localhost:3000/register`, {
                    fname: this.firstName,
                    lname: this.lastName,
                    username: this.username,
                    password: this.password
                })
                .then((response) => {
                    if(response.data.status == "success"){
                        this.status = "Success"
                        this.error = ""
                        this.firstName = ""
                        this.lastName = ""
                        this.username = ""
                        this.password = ""
                        this.confirmPassword = ""
                    }
                    else{
                        this.error = response.data.status
                        this.status = ""
                    }
                })
                .catch((error) => {
                    this.error = error.response.data.message;
                });
            }
        },
    }
}
</script>
   
   