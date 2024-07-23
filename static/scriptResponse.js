$(document).ready(function() {
    $('#form').on('submit',function(e){
        $.ajax({
            data: {
                userName: $('#name').val(),
                emailAddres: $('#email').val(),
                referenceBoroughId: $('#borough').val(),
                maximumDistanceFromReference: $('#distance').val(),
                incomePerMonth: $('#income').val(),
                categoryPlace: $('#dimCategoryRoom').val(),
                priorities: Array.from(document.querySelectorAll('input[name="dimPriority"]:checked')).map(checkbox => parseInt(checkbox.val()))
            },
            url: '/submit', 
            type: 'POST'
        })
        .done(function(data){
            $('#output').text(data.output).show();
          });
          e.preventDefault();
        });
    }
);


