// All available work hours
const hours = [
    '9AM', '10AM', '11AM', '12PM', '1PM',
    '2PM', '3PM', '4PM', '5PM'
];

// Same as the above but in 24 hour format
const hours24Format = [
    '09:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00'
];

// Determine wether the selected hour in the past, present, or future
function isPastFutureOrPresent(hourIndex) {
    var now = dayjs(dayjs().format('YYYY-MM-DD HH:00'));

    var hour24Format = hours24Format[hourIndex];
    var currentHour = dayjs(dayjs().format('YYYY-MM-DD ' + hour24Format));
    
    // A negative difference in time from the selected hour to now is in the past
    if(currentHour.diff(now, 'hour') < 0) {
        return 'past';
    }

    // No difference in time from the selected hour to now is in the present
    if(currentHour.diff(now, 'hour') == 0) {
        return 'present';
    }

    // Otherwise, it must be in the future
    return 'future';
}

// Called when the save button on its respective hour block is pressed
// Saves the agenda for that hour in local storage
function onSaveSchedule(event) {
    var btn = $(event.target);

    // Grab the value from the respective text area of that hour block
    const agenda = $('#hour-' + btn.data('hour')).val();

    // Save it in local storage
    localStorage.setItem(btn.data('hour'), agenda);
}

// Load schedule from local storage upon loading the app
function loadSchedule() {
    // Grab the current date
    var today = dayjs(dayjs().format('YYYY-MM-DD'));

    // Grab the last day this app was used
    var lastDayUsed = localStorage.getItem('last-time-used');
    if(lastDayUsed === null) {
        const lastTimeFormatted = today.format('YYYY-MM-DD');
        localStorage.setItem('last-time-used', lastTimeFormatted);
        lastDayUsed = lastTimeFormatted;
    }

    lastDayUsed = dayjs(lastDayUsed);

    // If this app is used in a new day, clear the schedule and note the current day
    if(today.diff(lastDayUsed, 'day') > 0) {
        localStorage.clear();
        localStorage.setItem('last-time-used', today.format('YYYY-MM-DD'));
        return;
    }

    // Otherwise, load schedule onto the hour blocks
    for(var i = 0; i < hours.length; i++) {
        const agenda = localStorage.getItem(hours[i]);

        if(agenda) {
            $('#hour-' + hours[i]).val(agenda);
        }
    }
}

// Generate all the hour blocks
function loadWorkHours() {
    var scheduleContainer = $('#schedule');
    
    // Loop through all available hours
    for(var i = 0; i < hours.length; i++) {
        // Determine if the hour is in the past, present, or future
        var status = isPastFutureOrPresent(hours[i]);

        // Create the hour block
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

        // Append the hour block to the schedule
        scheduleContainer.append(hourContainer);
    }
}

// Called upon the document fully loading
$(function () {
    // Generate hour blocks
    loadWorkHours();

    // Load existing schedule
    loadSchedule();

    // Display the current day on top
    var currentDate = dayjs().format('dddd, MMMM D');
    $('#currentDay').text(currentDate);
  });