let answers = document.getElementsByClassName("a");
let questions = document.getElementsByClassName("q");

const toggle = (element) => {
    if (element.style.display == "none" || element.style.display == "") {
        element.style.display = "block";
    } else {
        element.style.display = "none";
    }
}

for (let i = 0; i < answers.length; i++) {
    answers[i].style.display = "none";
}

for (let i = 0; i < questions.length; i++) {
    const answer = questions[i].nextElementSibling;
    questions[i].addEventListener('click', () => toggle(answer));
    };