// Validação do formulário
(function () {
    'use strict';
    window.addEventListener('load', function () {
        var forms = document.getElementsByClassName('needs-validation');
        Array.prototype.filter.call(forms, function (form) {
            form.addEventListener('submit', function (event) {
                const checkedPriorities = document.querySelectorAll('input[name="dimPriority"]:checked');
                if (checkedPriorities.length < 2) {
                    event.preventDefault();
                    event.stopPropagation();
                    alert('Please select at least two priorities.');
                    return; // Adicionei return para garantir que a execução pare aqui se a condição não for atendida
                }

                // if (form.checkValidity() === false) {
                //     event.preventDefault();
                //     event.stopPropagation();
                // } else {
                event.preventDefault(); // Impedir o envio padrão para processar os dados localmente

                const formData = {
                    userName: document.getElementById('name').value,
                    emailAddres: document.getElementById('email').value,
                    referenceBoroughId: parseInt(document.getElementById('borough').value),
                    maximumDistanceFromReference: parseInt(document.getElementById('distance').value),
                    incomePerMonth: parseFloat(document.getElementById('income').value),
                    categoryPlace: parseInt(document.getElementById('dimCategoryRoom').value),
                    priorities: Array.from(document.querySelectorAll('input[name="dimPriority"]:checked')).map(checkbox => parseInt(checkbox.value))
                };

                // // Criar um arquivo JSON e forçar o download
                // const blob = new Blob([JSON.stringify(formData, null, 2)], { type: 'application/json' });
                // const url = URL.createObjectURL(blob);
                // const a = document.createElement('a');
                // a.href = url;
                // a.download = 'form-data.json';
                // document.body.appendChild(a);
                // a.click();
                // document.body.removeChild(a);
                // URL.revokeObjectURL(url); // Liberar o URL após o download

                // Enviar o JSON via POST
                fetch("http://localhost:3000/api/model/run", {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': "POST"
                    },
                    body: JSON.stringify(formData)
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Success:', data);
                        // Exibir uma mensagem de sucesso ou redirecionar, se necessário
                        alert('Formulário enviado com sucesso!');
                    })
                    .catch((error) => {
                        alert(`Error: ${error}`);
                        console.log(error);
                    });

                // }
                form.classList.add('was-validated');
            }, false);
        });
    }, false);
})();

// Carregar boroughs do JSON e preencher a dropdown list
fetch('/data/boroughs')
    .then(response => response.json())
    .then(data => {
        const boroughSelect = document.getElementById('borough');
        data.forEach(borough => {
            const option = document.createElement('option');
            option.value = borough.ID;
            option.textContent = borough.name;
            boroughSelect.appendChild(option);
        });
    })
    .catch(error => console.error('Error loading boroughs:', error));

// Carregar categories do JSON e preencher a dropdown list
fetch('/data/dimCategoryRoom')
    .then(response => response.json())
    .then(data => {
        const dimCategoryRoomSelect = document.getElementById('dimCategoryRoom');
        data.forEach(dimCategoryRoom => {
            const option = document.createElement('option');
            option.value = dimCategoryRoom.ID;
            option.textContent = dimCategoryRoom.DS_CATEGORY;
            dimCategoryRoomSelect.appendChild(option);
        });
    })
    .catch(error => console.error('Error loading categories:', error));

// Carregar Priorities do JSON
fetch('/data/dimPriority')
    .then(response => response.json())
    .then(data => {
        const dimPriorityContainer = document.getElementById('dimPriority');
        data.forEach(dimPriority => {
            const div = document.createElement('div');
            div.classList.add('form-check');

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.classList.add('form-check-input');
            checkbox.id = dimPriority.ID;
            checkbox.name = 'dimPriority';
            checkbox.value = dimPriority.ID;
            checkbox.checked = true; // Marcar todas as caixas por padrão

            const label = document.createElement('label');
            label.classList.add('form-check-label');
            label.htmlFor = dimPriority.ID;
            label.textContent = dimPriority.DS_PRIORITY;

            div.appendChild(checkbox);
            div.appendChild(label);
            dimPriorityContainer.appendChild(div);
        });
    })
    .catch(error => console.error('Error loading priorities:', error));
