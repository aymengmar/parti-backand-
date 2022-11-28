var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        host: "smtp.ethereal.email", 
        port: 587,
      user: 'nadt22225@gmail.com',
      pass: 'chebbi1992chebbi'
    }
  });

  var mailOptions = {
    from: 'nadt22225@gmail.com',
    to: 'nadt22225@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
  };
  
  

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

     