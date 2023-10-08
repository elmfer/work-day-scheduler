const hours = [
    '9AM', '10AM', '11AM', '12PM', '1PM',
    '2PM', '3PM', '4PM', '5PM'
];

const hours24Format = [
    '09:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00'
];

function isPastFutureOrPresent(hourIndex) {
    var now = dayjs(dayjs().format('YYYY-MM-DD HH:00'));
    //var now = dayjs('2023-10-07 11:00');
    //now = dayjs(now.format('YYYY-MM-DD HH:00'));

    var hour24Format = hours24Format[hourIndex];
    var currentHour = dayjs(dayjs().format('YYYY-MM-DD ' + hour24Format));
    
    if(currentHour.diff(now, 'hour') < 0) {
        return 'past';
    }

    if(currentHour.diff(now, 'hour') == 0) {
        return 'present';
    }

    return 'future';
}

function onSaveSchedule(event) {
    var btn = $(event.target);

    const agenda = $('#hour-' + btn.data('hour')).val();

    localStorage.setItem(btn.data('hour'), agenda);
}

function loadSchedule() {
    var today = dayjs(dayjs().format('YYYY-MM-DD'));

    var lastDayUsed = localStorage.getItem('last-time-used');

    if(lastDayUsed === null) {
        localStorage.setItem('last-time-used', today.format('YYYY-MM-DD'));
    }

    lastDayUsed = dayjs(lastDayUsed);

    if(today.diff(lastDayUsed, 'day') > 0) {
        localStorage.clear();
        localStorage.setItem('last-time-used', today.format('YYYY-MM-DD'));
        return;
    }

    for(var i = 0; i < hours.length; i++) {
        const agenda = localStorage.getItem(hours[i]);

        if(agenda) {
            $('#hour-' + hours[i]).val(agenda);
        }
    }
}

function loadWorkHours() {
    var scheduleContainer = $('#schedule');
    
    for(var i = 0; i < hours.length; i++) {
        var status = isPastFutureOrPresent(hours[i]);

        var hourContainer = $('<div>');
        hourContainer.addClass('row time-block ' + isPastFutureOrPresent(i));

        var title = $('<div>');
        title.addClass('col-2 col-md-1 hour text-center py-3')
        title.text(hours[i]);
        hourContainer.append(title);

        var textArea = $('<textarea>');
        textArea.addClass('col-8 col-md-10 description');
        textArea.prop('rows', '3');
        textArea.attr('id', 'hour-' + hours[i]);
        hourContainer.append(textArea);

        var saveBtn = $('<button>');
        saveBtn.addClass('btn saveBtn col-2 col-md-1');
        saveBtn.prop('aria-label', "save");
        saveBtn.append($('<i>').addClass('fas fa-save'));
        saveBtn.data('hour', hours[i]);
        saveBtn.on('click', onSaveSchedule);
        hourContainer.append(saveBtn);

        scheduleContainer.append(hourContainer);
    }
}

// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
$(function () {
    // TODO: Add a listener for click events on the save button. This code should
    // use the id in the containing time-block as a key to save the user input in
    // local storage. HINT: What does `this` reference in the click listener
    // function? How can DOM traversal be used to get the "hour-x" id of the
    // time-block containing the button that was clicked? How might the id be
    // useful when saving the description in local storage?
    //
    // TODO: Add code to apply the past, present, or future class to each time
    // block by comparing the id to the current hour. HINTS: How can the id
    // attribute of each time-block be used to conditionally add or remove the
    // past, present, and future classes? How can Day.js be used to get the
    // current hour in 24-hour time?
    //
    // TODO: Add code to get any user input that was saved in localStorage and set
    // the values of the corresponding textarea elements. HINT: How can the id
    // attribute of each time-block be used to do this?
    loadWorkHours();
    loadSchedule();

    // TODO: Add code to display the current date in the header of the page.
    var currentDate = dayjs().format('dddd, MMMM D');
    $('#currentDay').text(currentDate);
  });