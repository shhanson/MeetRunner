(function () {
  angular.module('meetrunner')
    .controller('PaypalController', ($scope) => {
      $scope.opts = {
        env: 'sandbox',
        client: {
          sandbox: 'ARjR2CTewWopHOnpFSBDfNN-CxqM0Ll87J1D9_byDAobnYgylhoh33PC9RuF0DQm-95AjOySBwzKWxaz',
        },
        payment() {
          const env = this.props.env;
          const client = this.props.client;
          return paypal.rest.payment.create(env, client, {
            transactions: [
              {
                amount: { total: '1', currency: 'USD' },
                payee: { email: 'sarahhanson@ymail.com' },
              },
            ],
          });
        },
        commit: true, // Optional: show a 'Pay Now' button in the checkout flow
        onAuthorize(data, actions) {
          // Optional: display a confirmation page here
          return actions.payment.execute().then(() => {
            // Show a success page to the buyer
            window.alert('Registration success!');
          });
        },
      };
    });
}());
