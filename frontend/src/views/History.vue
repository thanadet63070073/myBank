<template>
  <div class="is-fullheight">
    <div class="hero is-light is-fullheight-with-navbar">
      <div class="m-5">
        <div class="is-size-1 has-text-centered mb-5">Welcome to my bank</div>
        <div class="columns">
          <div class="is-size-3">Your Transaction :</div>
          <div class="select ml-5 mt-2">
            <select v-model="selectAccount" @change="dropdownChange($event)">
              <option value=0>--Select Account--</option>
              <option v-for="acc in bank_account" :key="acc.account_id" :value="acc.account_id">{{acc.account_number}}</option>
            </select>
          </div>
        </div>
        <div class="is-flex-direction-column">

          <div class="card is-6 my-6 container" v-for="data in transaction_data" :key="data.transaction_id">
            <div class="card-content">
              <div class="subtitle has-text-dark columns">
                <div class="has-text-left column">
                  Transaction Type:
                </div>
                <div class="has-text-right column">
                  {{data.transaction_type}}
                </div>
              </div>

              <div class="subtitle has-text-dark columns" v-if="data.transaction_type == 'deposit'">
                <div class="has-text-left column">
                  Amount :
                </div>
                <div class="has-text-right column has-text-success">
                  + {{data.money}}
                </div>
              </div>

              <div class="subtitle has-text-dark columns" v-if="data.transaction_type == 'withdraw'">
                <div class="has-text-left column">
                  Amount :
                </div>
                <div class="has-text-right column has-text-danger">
                  - {{data.money}}
                </div>
              </div>

              <div class="subtitle has-text-dark columns" v-if="data.transaction_type == 'transfer' && data.account_id == selectAccount">
                <div class="has-text-left column">
                  Transfer To :
                </div>
                <div class="has-text-right column">
                  <div>{{ data.other_fname }} {{ data.other_lname }}</div>
                  <div>{{ data.other_account_number }}</div>
                </div>
              </div>

              <div class="subtitle has-text-dark columns" v-if="data.transaction_type == 'transfer' && data.otherAccount_id == selectAccount">
                <div class="has-text-left column">
                  Transfer From :
                </div>
                <div class="has-text-right column">
                  <div>{{ data.fname }} {{ data.lname }}</div>
                  <div>{{ data.account_number }}</div>
                </div>
              </div>

              <div class="subtitle has-text-dark columns" v-if="data.transaction_type == 'transfer' && data.account_id == selectAccount">
                <div class="has-text-left column">
                  Amount :
                </div>
                <div class="has-text-right column has-text-danger">
                  - {{data.money}}
                </div>
              </div>

              <div class="subtitle has-text-dark columns" v-if="data.transaction_type == 'transfer' && data.otherAccount_id == selectAccount">
                <div class="has-text-left column">
                  Amount :
                </div>
                <div class="has-text-right column has-text-success">
                  + {{data.money}}
                </div>
              </div>

              <div class="subtitle has-text-dark columns">
                <div class="has-text-left column">
                  Date :
                </div>
                <div class="has-text-right column">
                  {{data.formatDate}}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
  
  <script>
  import axios from 'axios'
  
  export default {
    data() {
      return {
        user_id: '',
        bank_account: [],
        selectAccount: 0,
        transaction_data: [],
      }
    },
    mounted(){
      if(!localStorage.getItem('token')){
        this.$router.push({name: `signIn`})
      }
      else{
        this.getUserID()
      }
    },
    methods: {
      getUserID(){
        var token = localStorage.getItem('token');
        axios
        .post(`http://localhost:3000/authen`, {
            token: token
        })
        .then((response) => {
            console.log(response.data)
            if(response.data.status == "ok"){
                this.user_id = response.data.decoded.user_id
                this.getBankAccount()
            }
            else{
                localStorage.removeItem('token');
            }
        })
        .catch((error) => {
            this.error = error.response.data.message;
        });  
      },
      getBankAccount(){
        axios
        .post(`http://localhost:3000/bankAccount`, {
            user_id: this.user_id
        })
        .then((response) => {
            if(response.data.status == "success"){
              this.bank_account = response.data.bank_account;
            }
        })
        .catch((error) => {
            this.error = error.response.data.message;
        });  
      },
      dropdownChange(event){
        this.selectAccount = event.target.value;
        this.getTransaction();
      },
      getTransaction(){
        if(this.selectAccount == 0){
          return false;
        }

        axios
        .post(`http://localhost:3000/transaction`, {
            account_id: this.selectAccount
        })
        .then((response) => {
          console.log(response.data)
            if(response.data.status == "success"){
              this.transaction_data = response.data.transaction_data;
            }
        })
        .catch((error) => {
            this.error = error.response.data.message;
        });  
      }
    },
  }
  </script>
  
  