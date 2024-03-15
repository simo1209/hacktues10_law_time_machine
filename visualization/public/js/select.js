

$(document).ready(function(){
    $.ajax({
        url: '/papers',
        success: (data) => {
            createSelectize(data)
            
        },
        fail: (data) => {
            alert('Cant get newspappers!');
        }
    })

    function createSelectize(newspappers) {

        var $select = $('#select-newspaper').selectize({
            maxItems: 1,
            valueField: 'id',
            labelField: 'title',
            searchField: 'title',
            onChange: (data) => {
                let paper = newspappers.filter(x => x.id == data[0])[0];
                createGraph(paper.title);
            },
            options: newspappers,
            create: false
        });
        console.log($select)
    }
})