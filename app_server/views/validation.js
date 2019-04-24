$(function() {
  
    $("#submitform").validate({
      rules: {
        email: {
          required: true,
          email: true
        },
        password: {
          required: true
        }
      },
      messages: {
        email: {
          required: 'Please enter an email address.',
          email: 'Please enter a <em>valid</em> email address.'
        }
      }
    });
  
  });