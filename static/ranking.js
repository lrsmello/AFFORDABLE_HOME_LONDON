document.addEventListener("DOMContentLoaded", function () {
    fetch('responsejson')
        .then(response => response.json())
        .then(data => {
            const dataDisplay = document.getElementById("dataDisplay");
            return(dataDisplay)
        }
    )
})