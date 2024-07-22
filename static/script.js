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
