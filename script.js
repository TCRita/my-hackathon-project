    const emojiButtons = document.querySelectorAll(".emoji-button");

    emojiButtons.forEach(button => {
        button.addEventListener("click", () => {
            button.classList.toggle("selected");
        });
    });