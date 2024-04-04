
document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('#skills li').forEach(item => {
    item.addEventListener('click', event => {
      event.target.style.color = event.target.style.color === 'red' ? 'black' : 'red';
    })
  })

document.getElementById('contact-form').addEventListener('submit', function(event) {
  event.preventDefault();
  // Here you can add code to handle form submission, like sending data to a server or showing a success message
  alert('Form submitted successfully!');
});
})  