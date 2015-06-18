function Calendar() {
  this.calIsOpen = false;
  this.presetIsOpen = false;
  this.start_date = null;
  this.end_date = null;
  this.current_date = null;

  var self = this;

  $('.dr-presets').click(function() {
    self.presetToggle();
  });

  $('.dr-date').click(function() {
    self.calendarOpen(this);
  });

  $('.dr-date').keydown(function(event){
    if (event.keyCode == 13) {
      event.preventDefault();
      self.calendarOpen(this);
    }
  });
}


Calendar.prototype.presetToggle = function() {
  $('.dr-preset-list').slideToggle(200);
  $('.dr-input').toggleClass('active');
  $('.dr-presets').toggleClass('active');

  if (this.presetIsOpen == false) {
    this.presetIsOpen = true;
  } else if (this.presetIsOpen == true) {
    this.presetIsOpen = false;
  }

  if (this.calIsOpen == true)
    this.calendarClose();
}


Calendar.prototype.calendarOpen = function(element) {
  var self = this;
  var cal_width = $('.dr-dates').innerWidth() - 8;
  this.start_date = new Date($('.dr-date-start').html());
  this.end_date = new Date($('.dr-date-end').html());
  this.current_date = new Date($(element).html());

  if (this.presetIsOpen == true)
    this.presetToggle();

  if (this.calIsOpen == true)
    this.calendarClose();

  this.calendarCreate();

  $('.dr-day').on({
    mouseenter: function() {
      var this_date = moment($(this).data('date'));
      var start_date = moment(self.start_date);
      var end_date = moment(self.end_date);
      var current_date = moment(self.current_date);

      if (start_date.isSame(current_date)) {
        $(this).addClass('hover hover-before');
        $('.dr-start').css({'border': 'none', 'padding-left': '0.3125rem'});
      }

      if (end_date.isSame(current_date)) {
        $(this).addClass('hover hover-after');
        $('.dr-end').css({'border': 'none', 'padding-right': '0.3125rem'});
      }

      $(this).next().addClass('dr-maybe');

      // if (this_date.isBefore(current_date)) {
      //   $(this).addClass('hover hover-before');
      // } else if (this_date.isAfter(current_date)) {
      //   $(this).addClass('hover hover-after');
      // } else {
      //   console.log('equal');
      // }
    },
    mouseleave: function() {
      $(this).removeClass('hover hover-before hover-after');
      $('.dr-start, .dr-end').css({'border': '', 'padding': ''});
      $('.dr-day').removeClass('dr-maybe');
    }
  });

  $('.dr-calendar')
    .css('width', cal_width)
    .slideDown(200);
  $('.dr-input').addClass('active');
  $(element).addClass('active');

  this.calIsOpen = true;
}


Calendar.prototype.calendarClose = function() {
  if (!this.calIsOpen || this.presetIsOpen)
    $('.dr-calendar').slideUp(200);

  $('.dr-input').removeClass('active');
  $('.dr-date').removeClass('active');
  $('.dr-day').remove();

  this.calIsOpen = false;
}


Calendar.prototype.calendarArray = function(start, end, current) {
  var start = start || new Date();
  var end = end || moment(start).add(1, 'week');
  var current = current || start || end;

  var first_day = moment(start).startOf('month');
  var last_day = moment(end).endOf('month');

  var current_month = {
    start: {
      day: +first_day.format('d'), 
      str: +first_day.format('D')
    }, 
    end: {
      day: +last_day.format('d'), 
      str: +last_day.format('D')
    }
  }


  // Beginning faded dates
  var d = undefined;

  var start_hidden = _.map(_.range(current_month.start.day), function() {
    if (d == undefined) {
      d = moment(first_day);
    } d = d.subtract(1, 'day');

    return {
      str: +d.format('D'),
      start: d.isSame(start),
      end: d.isSame(end),
      selected: d.isBetween(start, end),
      date: d.toISOString(),
      fade: true
    }
  }).reverse();


  // Leftover faded dates
  var leftover = (6 * 7) - (current_month.end.str + start_hidden.length);
  var d = undefined;

  var end_hidden = _.map(_.range(leftover), function() {
    if (d == undefined) {
      d = moment(last_day);
    } d = d.add(1, 'day');

    return {
      str: +d.format('D'),
      start: d.isSame(start),
      end: d.isSame(end),
      selected: d.isBetween(start, end),
      date: d.toISOString(),
      fade: true
    }
  });


  // Actual visible dates
  var d = undefined;

  var visible = _.map(_.range(current_month.end.str), function() {
    if (d == undefined) {
      d = moment(first_day);
    } else {
      d = d.add(1, 'day');
    }

    return {
      str: +d.format('D'),
      start: d.isSame(start),
      end: d.isSame(end),
      current: d.isSame(current),
      selected: d.isBetween(start, end),
      date: d.toISOString()
    }
  });


  return start_hidden.concat(visible, end_hidden);
}


Calendar.prototype.calendarCreate = function() {
  var array = this.calendarArray(this.start_date, this.end_date, this.current_date);
  var current_week;

  _.each(array, function(d, i) {
    var classString = "dr-day";

    if (d.fade)
      classString += " dr-fade";

    if (d.start)
      classString += " dr-start";

    if (d.end)
      classString += " dr-end";

    if (d.current)
      classString += " dr-current";
    
    if (d.selected)
      classString += " dr-selected";

    $('.dr-day-list').append('<li class="'+ classString +'" data-date="'+ d.date +'">'+ d.str +'</li>');
  });
}


var cal = new Calendar();