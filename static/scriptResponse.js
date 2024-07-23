// Carregar ResponseMethod do JSON
const formData = {
    userName: document.getElementById('name').value,
    emailAddres: document.getElementById('email').value,
    referenceBoroughId: document.getElementById('borough').value,
    maximumDistanceFromReference: document.getElementById('distance').value,
    incomePerMonth: document.getElementById('income').value,
    categoryPlace: document.getElementById('dimCategoryRoom').value,
    priorities: Array.from(document.querySelectorAll('input[name="dimPriority"]:checked')).map(checkbox => parseInt(checkbox.value))
};

const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
}

function sendData() {
    $.ajax({
        url: '/submit', 
        type: 'POST', 
        data: JSON.stringify(formData),
        success: function(response)
    });
}


