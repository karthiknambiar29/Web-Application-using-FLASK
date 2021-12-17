function onlyOne(checkbox) {
    var checkboxes = document.getElementsByName('check')
    checkboxes.forEach((item) => {
        if (item !== checkbox) item.checked = false
    })
}

function plotChart() {
    var scores_data = document.querySelector('#scores_data');
    scores = JSON.parse(scores_data.dataset.scores);
    datetimes = JSON.parse(scores_data.dataset.datetimes);
    categories = JSON.parse(scores_data.dataset.categories);
    if (scores.length > 7) {
        scores = scores.slice(-7);
        datetimes = datetimes.slice(-7);
        categories = categories.slice(-7);
    }
    var c = datetimes.map(function(e, i) {
        return [e, categories[i]];
    });

    var ctx = document.getElementById("myChart").getContext("2d");
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: c,
            datasets: [{
            data: scores,
            lineTension: 0,
            backgroundColor: 'transparent',
            borderColor: '#007bff',
            borderWidth: 4,
            pointBackgroundColor: '#007bff'
            }],
            datalabels: {
            align: 'start',
            anchor: 'start'
            }
        
        },
        options: {
            scales: {
                yAxes: [{
                ticks: {
                    beginAtZero: true,
                    max: 10,
                }
                }],
                xAxes: [{
                }]
            },
            legend: {
                display: false,
            }
        }    
    });
}

function scoreChart() {
    var scores_data = document.querySelector('#scores_data');
    console.log(scores_data.dataset.correct)
    correct = JSON.parse(scores_data.dataset.correct);
    console.log(typeof correct)
    wrong = JSON.parse(scores_data.dataset.wrong);
    no_ans = JSON.parse(scores_data.dataset.no_ans);
    var ctx = document.getElementById("myChart").getContext('2d');

    var myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ["Correct Answer", "Wrong Answer", "Not Answered"],
            datasets: [{
                data: [correct, wrong, no_ans], 
                    backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)'
                    ],
                    borderWidth: 1
                }]
        },
        options: {
            responsive: true, 
            maintainAspectRatio: true, 
        }
    });
}