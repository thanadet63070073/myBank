<template>
  <div class="is-fullheight">
    <div class="hero is-light is-fullheight-with-navbar">
      <div class="m-5">
        <div class="is-size-1 has-text-centered mb-5">Welcome to my bank</div>
        <div>
          <div class="columns">
            <div  class="column">
              <div class="is-size-3">Your Bank Account :
                <button class="button is-success is-medium" @click="openAddModal">
                  <div class="icon">
                    <i class="fa fa-plus"></i>
                  </div>
                  <div>
                    Create New Account
                  </div>
                </button>
              </div>
            </div>
            <div class="column"></div>
          </div>

          <!-- show bank account card -->
          <div class="is-flex-direction-column">
            <div class="card is-6 my-6 container" v-for="acc in bank_account" :key="acc.account_id">
              <div class="card-content">
                <div class="subtitle has-text-dark columns">
                  <div class="has-text-left column">
                    Account Number :
                  </div>
                  <div class="has-text-right column">
                    {{acc.account_number}}
                  </div>
                </div>

                <div class="subtitle has-text-dark columns">
                  <div class="has-text-left column">
                    Account Type :
                  </div>
                  <div class="has-text-right column">
                    {{acc.account_type}}
                  </div>
                </div>

                <div class="subtitle has-text-dark columns">
                  <div class="has-text-left column">
                    Balance :
                  </div>
                  <div class="has-text-right column">
                    {{acc.balance}} ฿
                  </div>
                </div>
              </div>
              <footer class="card-footer">
                <button class="button card-footer-item is-size-5" @click="openDepositModal(acc)">
                  <span>
                    deposit
                  </span>
                </button>
                <button class="button card-footer-item is-size-5" @click="openWithdrawModal(acc)">
                  <span>
                    withdraw
                  </span>
                </button>
                <button class="button card-footer-item is-size-5" @click="openTransferModal(acc)">
                  <span>
                    transfer
                  </span>
                </button>
                <button class="button card-footer-item is-size-5" @click="openInterestModal(acc)">
                  <span>
                    interest
                  </span>
                </button>
              </footer>
            </div>
          </div>
        </div>
      </div>

      <!-- create modal -->
      <div class="modal" v-bind:class="{'is-active': showCreateModal}">
        <div class="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">Create Bank Account</p>
            <button class="delete" aria-label="close" v-on:click="showCreateModal = false"></button>
          </header>
          <section class="modal-card-body">
            <!-- Content ... -->
            <label class="label">Enter your first deposit money (bath)</label>
            <input type="number" class="input" v-model="createAccountMoney" @input="validateCreateAccount()">
            <span class="has-text-danger">{{error.createModalError}}</span>
            <label class="label">Select your account type</label>
            <div class="select">
              <select v-model="createAccountDropdown">
                <option value="Savings Account">Savings Account</option>
                <option value="Current Account">Current Account</option>
              </select>
            </div>
            <div class="has-background-success-light has-text-success p-3 mt-3" v-if="status.createModalStatus != ''">{{status.createModalStatus}}</div>
          </section>
          <footer class="modal-card-foot is-justify-content-flex-end">
            <button class="button" v-on:click="showCreateModal = false">Cancel</button>
            <button class="button is-success" v-on:click="confirmCreate">Confirm</button>
          </footer>
        </div>
      </div>

      <!-- depositmodal -->
      <div class="modal" v-bind:class="{'is-active': showDepositModal}">
        <div class="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">Deposit</p>
            <button class="delete" aria-label="close" v-on:click="showDepositModal = false"></button>
          </header>
          <section class="modal-card-body">
            <!-- Content ... -->
            <label class="label">Enter your deposit money (bath)</label>
            <input type="number" class="input" v-model="depositMoney" @input="validateDeposit()">
            <span class="has-text-danger">{{error.depositModalError}}</span>
            <div class="has-background-success-light has-text-success p-3 mt-3" v-if="status.depositModalStatus != ''">{{status.depositModalStatus}}</div>
          </section>
          <footer class="modal-card-foot is-justify-content-flex-end">
            <button class="button" v-on:click="showDepositModal = false">Cancel</button>
            <button class="button is-success" v-on:click="confirmDeposit">Confirm</button>
          </footer>
        </div>
      </div>

      <!-- withdraw -->
      <div class="modal" v-bind:class="{'is-active': showWithdrawModal}">
        <div class="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">Withdraw</p>
            <button class="delete" aria-label="close" v-on:click="showWithdrawModal = false"></button>
          </header>
          <section class="modal-card-body">
            <!-- Content ... -->
            <label class="label">Enter your withdraw money (bath)</label>
            <input type="number" class="input" v-model="withdrawMoney" @input="validateWithdraw()">
            <span class="has-text-danger">{{error.withdrawModalError}}</span>
            <div class="has-background-success-light has-text-success p-3 mt-3" v-if="status.withdrawModalStatus != ''">{{status.withdrawModalStatus}}</div>
            <div class="has-background-danger-light has-text-danger p-3 mt-3" v-if="status.withdrawModalErrorStatus != ''">{{status.withdrawModalErrorStatus}}</div>
          </section>
          <footer class="modal-card-foot is-justify-content-flex-end">
            <button class="button" v-on:click="showWithdrawModal = false">Cancel</button>
            <button class="button is-success" v-on:click="confirmWithdraw">Confirm</button>
          </footer>
        </div>
      </div>

      <!-- transfer -->
      <div class="modal" v-bind:class="{'is-active': showTransferModal}">
        <div class="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">Transfer</p>
            <button class="delete" aria-label="close" v-on:click="showTransferModal = false"></button>
          </header>
          <div v-if="transferModalPage == 1">
            <section class="modal-card-body">
              <!-- Content ... -->
              <label class="label">Account Number :</label>
              <input type="text" maxlength="10" class="input" v-model="transferToAccountNumber" @input="validateTransferAccount()">
              <span class="has-text-danger">{{error.transferAccountError}}</span>

              <label class="label mt-3">Amount :</label>
              <input type="number" maxlength="10" class="input" v-model="transferMoney" @input="validateTransferMoney()">
              <span class="has-text-danger">{{error.transferMoneyError}}</span>

              <label class="label mt-3">Note :</label>
              <input type="text" class="input" v-model="transferNote">

              <!-- <div class="has-background-success-light has-text-success p-3 mt-3" v-if="status.withdrawModalStatus != ''">{{status.withdrawModalStatus}}</div> -->
              <div class="has-background-danger-light has-text-danger p-3 mt-3" v-if="status.transferErrorStatus != ''">{{status.transferErrorStatus}}</div>
            </section>
            <footer class="modal-card-foot is-justify-content-flex-end">
              <button class="button" v-on:click="showTransferModal = false">Cancel</button>
              <button class="button is-success" v-on:click="checkAccountNumber">Next</button>
            </footer>
          </div>
          <div v-if="transferModalPage == 2">
            <section class="modal-card-body">
              <!-- Content ... -->
              <label class="label">From :</label>
              <div class="card">
                <div class="card-content">
                  <div class="content">
                    <div class="media">
                      <div class="media-left mt-2">
                        <div class="icon is-large">
                            <i class="fas fa-user is-size-3"></i>
                        </div>
                      </div>
                      <div class="media-content">
                        <div class="is-size-5 has-text-weight-bold">{{ current_bank_account_data.fname }} {{ current_bank_account_data.lname }}</div>
                        <div class="is-size-5 has-text-weight-semi-bold">{{current_bank_account_data.account_number}}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <label class="label mt-3">To :</label>
              <div class="card">
                <div class="card-content">
                  <div class="content">
                    <div class="media">
                      <div class="media-left mt-2">
                        <div class="icon is-large">
                            <i class="fas fa-user is-size-3"></i>
                        </div>
                      </div>
                      <div class="media-content">
                        <div class="is-size-5 has-text-weight-bold">{{ transferTo_account_data.fname }}  {{ transferTo_account_data.lname }}</div>
                        <div class="is-size-5 has-text-weight-semi-bold">{{ transferTo_account_data.account_number }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="columns mt-3 has-text-weight-medium">
                <div class="has-text-left column">
                  Amount :
                </div>
                <div class="has-text-right column">
                  {{ transferMoney }} ฿
                </div>
              </div>

              <div class="columns mt-3 has-text-weight-medium">
                <div class="has-text-left column">
                  Date :
                </div>
                <div class="has-text-right column">
                  {{ date }}
                </div>
              </div>


              <label class="label mt-3">Note :</label>
              <input type="text" class="input" v-model="transferNote" disabled>
            </section>
            <footer class="modal-card-foot is-justify-content-flex-end">
              <button class="button" v-on:click="transferModalPage -= 1">Back</button>
              <button class="button is-success" v-on:click="confirmTransfer">Comfirm</button>
            </footer>
          </div>

          <div v-if="transferModalPage == 3">
            <section class="modal-card-body" v-if="transferStatus == 'success'">
              <!-- Content ... -->
              <figure class="image is-128x128 container">
                <img src="https://icons.veryicon.com/png/o/miscellaneous/8atour/success-35.png">
              </figure>
              <div class="has-text-centered">
                <div class="is-size-2 has-text-success">Success!</div>
              </div>
            </section>

            <section class="modal-card-body" v-else>
              <!-- Content ... -->
              <figure class="image is-128x128 container">
                <img src="https://icon-library.com/images/cancel-icon-png/cancel-icon-png-22.jpg">
              </figure>
              <div class="has-text-centered">
                <div class="is-size-2 has-text-danger">Error!</div>
              </div>
            </section>


            <footer class="modal-card-foot is-justify-content-flex-end">
              <button class="button is-success" v-on:click="showTransferModal = false">OK</button>
            </footer>
          </div>

        </div>
      </div>
      
      <!-- interest -->
      <div class="modal" v-bind:class="{'is-active': showInterestModal}">
        <div class="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">Interest info</p>
            <button class="delete" aria-label="close" v-on:click="showInterestModal = false"></button>
          </header>
          <section class="modal-card-body">
            <!-- Content ... -->
            <div class="columns is-size-5">
              <div class="column has-text-left">Balace: </div>
              <div class="column has-text-right">{{ current_bank_account_data.balance }} ฿</div>
            </div>
            <div class="columns is-size-5">
              <div v-if="current_bank_account_data.account_type == 'Savings Account'" class="column has-text-left">Interest (4%): </div>
              <div v-else class="column has-text-left">Interest (0%): </div>

              <div v-if="current_bank_account_data.account_type == 'Savings Account'" class="column has-text-right">{{ current_bank_account_data.balance * 0.04 }} ฿</div>
              <div v-else class="column has-text-right">0 ฿</div>
            </div>
            <div class="columns is-size-5">
              <div class="column has-text-left">Result: </div>
              <div class="column has-text-right">{{ cal_interest }} ฿</div>
            </div>
          </section>
          <footer class="modal-card-foot is-justify-content-flex-end">
            <button class="button is-success" v-on:click="showInterestModal = false">OK</button>
          </footer>
        </div>
      </div>

    </div>
  </div>
</template>

<style>
.card{
  border: 1px solid black;
}
</style>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      user_id: '',
      bank_account: null,
      current_bank_account_data: [],
      //create bank account
      showCreateModal: false,
      createAccountMoney: '',
      createAccountDropdown: '',
      //deposit
      showDepositModal: false,
      depositMoney: '',
      //withdraw
      showWithdrawModal: false,
      withdrawMoney: '',
      //transfer
      showTransferModal: false,
      transferToAccountNumber: '',
      transferMoney: '',
      transferModalPage: 1,
      transferNote: '',
      transferTo_account_data: [],
      transferStatus: 'success',
      //interest
      showInterestModal: false,
      error: {
        createModalError: '',
        depositModalError: '',
        withdrawModalError: '',
        transferAccountError: '',
        transferMoneyError: '',
      },
      status: {
        createModalStatus: '',
        depositModalStatus: '',
        withdrawModalStatus: '',
        withdrawModalErrorStatus: '',
        transferErrorStatus: 'sss',
      }
    }
  },
  computed:{
    cal_interest(){
      if(this.current_bank_account_data.account_type == "Savings Account"){
        var result = this.current_bank_account_data.balance * 1.04;
        return result.toFixed(2);
      }
      else{
        return this.current_bank_account_data.balance;
      }
    },
    date(){
      var date = new Date()
      var day = date.getDate()
      var month = date.getMonth()+1
      if(day < 10){
        day = "0"+day
      }
      if(month < 10){
        month = "0"+month
      }
      var currentDate = day + "/" + month + "/" + date.getFullYear();
      return currentDate;
    },
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
    //create bank account
    openAddModal(){
      this.showCreateModal = true;
      this.createAccountMoney = '';
      this.error.createModalError = '';
      this.status.createModalStatus = '';
      this.createAccountDropdown = "Savings Account";
    },
    confirmCreate(){
      if(this.error.createModalError == ''){
        axios
        .post(`http://localhost:3000/createBankAccount`, {
            user_id: this.user_id,
            balance: this.createAccountMoney,
            type: this.createAccountDropdown,
        })
        .then((response) => {
          console.log(response.data)
          if(response.data.status == "success"){
            this.getBankAccount()
            this.status.createModalStatus = "Success";
            this.createAccountMoney = '';
          }
        })
        .catch((error) => {
            console.log(error);
        });  
      }
    },
    validateCreateAccount(){
      if(this.createAccountMoney < 500){
        this.error.createModalError = 'First deposit minimum at 500 bath';
      }
      else{
        this.error.createModalError = '';
      }
    },
    //deposit
    openDepositModal(account){
      this.showDepositModal = true;
      this.depositMoney = '';
      this.current_bank_account_data = account;
      this.status.depositModalStatus = '';
    },
    confirmDeposit(){
      if(this.error.depositModalError == ''){
        axios
        .put(`http://localhost:3000/deposit`, {
            account_id: this.current_bank_account_data.account_id,
            money: this.depositMoney,
        })
        .then((response) => {
          console.log(response.data)
          if(response.data.status == "success"){
            this.getBankAccount()
            this.status.depositModalStatus = "Success";
            this.depositMoney = '';
          }
        })
        .catch((error) => {
            console.log(error);
        });  
      }
    },
    validateDeposit(){
      if(this.depositMoney <= 0){
        this.error.depositModalError = "The amount entered should greater than 0";
      }
      else{
        this.error.depositModalError = "";
      }
    },
    //withdraw
    openWithdrawModal(account){
      this.showWithdrawModal = true;
      this.withdrawMoney = '';
      this.current_bank_account_data = account;
      this.status.withdrawModalStatus = '';
      this.status.withdrawModalErrorStatus = '';
    },
    confirmWithdraw(){
      if(this.error.withdrawModalError == ''){
        axios
        .put(`http://localhost:3000/withdraw`, {
            account_id: this.current_bank_account_data.account_id,
            money: this.withdrawMoney,
        })
        .then((response) => {
          console.log(response.data)
          if(response.data.status == "success"){
            this.getBankAccount()
            this.status.withdrawModalStatus = "Success";
            this.status.withdrawModalErrorStatus = "";
            this.withdrawMoney = '';
          }
          else if(response.data.status == 'not enough money'){
            this.status.withdrawModalErrorStatus = "You have not enough money";
            this.status.withdrawModalStatus = "";
          }
        })
        .catch((error) => {
            console.log(error);
        });
      }
    },
    validateWithdraw(){
      if(this.withdrawMoney <= 0){
        this.error.withdrawModalError = "The amount entered should greater than 0";
      }
      else{
        this.error.withdrawModalError = "";
      }
    },
    //transfer
    openTransferModal(account){
      this.showTransferModal = true;
      this.transferModalPage = 1;
      this.transferToAccountNumber = '';
      this.transferMoney = '';
      this.transferNote = '';
      this.error.transferAccountError = '';
      this.error.transferMoneyError = '';
      this.status.transferErrorStatus = '';
      this.current_bank_account_data = account;
    },
    validateTransferAccount(){
      if(this.transferToAccountNumber.length < 10 || isNaN(this.transferToAccountNumber)){
        this.error.transferAccountError = 'The account number consists of 10 digits';
      }
      else if(this.transferToAccountNumber == this.current_bank_account_data.account_number){
        this.error.transferAccountError = "The account number is the same as your"
      }
      else{
        this.error.transferAccountError = "";
      }
    },
    validateTransferMoney(){
      if(this.transferMoney <= 0){
        this.error.transferMoneyError = 'The amount entered should greater than 0';
      }
      else{
        this.error.transferMoneyError= "";
      }
    },
    checkAccountNumber(){
      if(this.transferToAccountNumber == ''){
        this.status.transferErrorStatus = 'Please insert account number'
      }
      else if(this.transferMoney == ''){
        this.status.transferErrorStatus = 'Please insert amount'
      }
      else if(this.current_bank_account_data.balance < parseFloat(this.transferMoney)){
        this.status.transferErrorStatus = 'You have not enough money'
      }
      else{
        this.status.transferErrorStatus = '';
      }

      if(this.error.transferAccountError != '' || this.error.transferMoneyError != '' || this.status.transferErrorStatus != ''){
        return false;
      }
      axios
        .post(`http://localhost:3000/checkAccount`, {
            account_number: this.transferToAccountNumber
        })
        .then((response) => {
          console.log(response.data)
          if(response.data.status == "success"){
            this.transferTo_account_data = response.data.account_data;
            this.transferModalPage += 1;
          }
          else{
            this.status.transferErrorStatus = "Inccorect Account Number";
          }
        })
        .catch((error) => {
            console.log(error);
        });
      
      return false;
    },
    confirmTransfer(){
      axios
        .post(`http://localhost:3000/transfer`, {
            sender_id: this.current_bank_account_data.account_id,
            receiver_id: this.transferTo_account_data.account_id,
            money: this.transferMoney,
            note: this.transferNote
        })
        .then((response) => {
          console.log(response.data)
          if(response.data.status == "success"){
            this.getBankAccount();
            this.transferStatus = "success";
            this.transferModalPage += 1;
          }
          else{
            this.transferStatus = "error";
          }
        })
        .catch((error) => {
            console.log(error);
        });
    },
    //interest
    openInterestModal(account){
      this.showInterestModal = true;
      this.current_bank_account_data = account;
    }
  },
}
</script>

