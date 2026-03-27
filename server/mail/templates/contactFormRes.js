exports.contactUsEmail = (
  email,
  firstname,
  lastname,
  message,
  phoneNo,
  countrycode
) => {
  return `<!DOCTYPE html>
  <html>
  
  <head>
      <meta charset="UTF-8">
      <title>Contact Form Confirmation</title>
  </head>
  
  <body style="background-color:#ffffff; font-family:Arial, sans-serif; margin:0; padding:0;">
      
      <div style="max-width:600px; margin:0 auto; padding:20px; text-align:center;">
          
          <!-- ✅ LOGO UPDATED -->
          <a href="https://studynotion-edtech-project.vercel.app">
              <img 
                  src="https://res.cloudinary.com/dgejy1bjn/image/upload/v1774627925/logo_afnrqf.png"
                  alt="StudyNotion Logo"
                  width="160"
                  style="margin-bottom:20px; display:block; margin-left:auto; margin-right:auto;"
              />
          </a>

          <!-- Heading -->
          <h2 style="color:#000000; margin-bottom:10px;">
              Contact Form Confirmation
          </h2>

          <!-- Message -->
          <p style="font-size:16px; color:#333;">
              Dear <strong>${firstname} ${lastname}</strong>,
          </p>

          <p style="font-size:15px; color:#333;">
              Thank you for contacting us. We have received your message and will respond to you as soon as possible.
          </p>

          <!-- User Data -->
          <div style="text-align:left; margin-top:20px; font-size:15px; color:#333;">
              <p><strong>Name:</strong> ${firstname} ${lastname}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone Number:</strong> ${countrycode} ${phoneNo}</p>
              <p><strong>Message:</strong> ${message}</p>
          </div>

          <!-- Footer -->
          <p style="margin-top:20px; font-size:14px; color:#555;">
              We appreciate your interest and will get back to you shortly.
          </p>

          <p style="margin-top:20px; font-size:13px; color:#888;">
              If you need immediate help, contact us at 
              <a href="mailto:info@studynotion.com" style="color:#FFD60A; text-decoration:none;">
                  info@studynotion.com
              </a>
          </p>

      </div>

  </body>
  
  </html>`
}