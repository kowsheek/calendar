var ss=new Calendar({element:$(".daterange--single"),current_date:"June 15, 2015",optional:!0,callback:function(){console.log(this.current_date)}}),dd=new Calendar({element:$(".daterange--double"),earliest_date:"January 1, 2000",latest_date:new Date,start_date:"May 1, 2015",end_date:"May 31, 2015",callback:function(){var e=moment(this.start_date).format("ll"),a=moment(this.end_date).format("ll");console.debug("Start Date: "+e+"\nEnd Date: "+a)}});