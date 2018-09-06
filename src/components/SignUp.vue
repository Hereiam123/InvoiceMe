<template>
  <div class="tab-pane fade show active" id="pills-login" role="tabpanel" aria-labelledby="pills-login-tab">
    <div class="row">
      <div class="col-md-12">
        <form @submit.prevent="login">
            <div class="form-group">
                <label for="">Email:</label>
                <input type="email" required class="form-control" placeholder="eg chris@invoiceapp.com" v-model="model.email">
            </div>

            <div class="form-group">
                <label for="">Password:</label>
                <input type="password" required class="form-control" placeholder="Enter Password" v-model="model.password">
            </div>

            <div class="form-group">
                <button class="btn btn-primary" >Login</button>
                {{ loading }}
                {{ status }}
            </div>
        </form>
      </div>
    </div>
  </div>
</template>
