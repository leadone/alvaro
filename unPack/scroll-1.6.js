/*!
 * Library Scroll, version 1.6
 * http://artlime.ru
 *
 * Copyright 2012, Roke Alva
 * email leadone@ya.ru
 *
 * Date: 07.06.2012
 */
(function($) {
	$.galleryAlvaro = {
		//настройки + параметры по умолчанию
		setting : {'size':{'top':'height','left':'width'},speed:300,scroll:0},
		//инициализация галереи и назначение событий 
		init : function() {
			//ссылка на объект galleryAlvaro
			var cursor = this;
			var left_arrows = $('body').find('[name="left"]');	
			$.each(left_arrows,function(index, left_arrow) {
				var arrows = cursor.getParams(left_arrow,'right');
				$.each(arrows,function(index, arrow) {
					$(arrow).bind("click", function(e){
						e.preventDefault();
						cursor[$(this).attr('name')](this);
					});
				});
			});
		},
		getParams : function(element,reverse) {
			if(!$(element).data('container')) {
				var container = this.findContainer(element,'[name="scrollBox"]');
				
				if(!container) {
					return false;
				}
				
				var len_container = container.children().length;
				
				var type_scroll = container.attr('type_scroll');				
				if(!type_scroll) type_scroll = 'left';
				
				var size_scroll = this.intval(container.attr('size_scroll'),10);		
				if(size_scroll==0) size_scroll = this.intval(container.children()[this.setting.size[type_scroll]]());
				
				var count_visible = this.intval(container.attr('count_visible'),10);
				if(!count_visible) count_visible = this.findContainerOverflow(container)[this.setting.size[type_scroll]]()/size_scroll;
				
				var scroll = container.css(type_scroll);
					scroll = this.intval(scroll.replace(/px/i,""),10)*1;
			
				var speed = this.intval(container.attr('speed'),10);
				if(!speed) speed = 300;
				
				var count_scroll = this.intval(container.attr('count_scroll'),10);
				if(!count_scroll) count_scroll = count_visible;
				
				var size = len_container*size_scroll;
				
				var arrow_other = this.findContainer(element,'[name="'+reverse+'"]');
				
				if(scroll==0) {
					$(element).addClass('notActive');
					container.css(type_scroll,0);			
				}
				if(scroll == (size-size_scroll*count_visible)*(-1)) $(arrow_other).addClass('notActive');
			
				container.css(this.setting.size[type_scroll],size);		
				var arrows = new Array(element,arrow_other);				
				
				$.each(arrows,function(key,arrow) {
					if(count_visible>=len_container) $(arrow).hide();
					$(arrow).data('container',container);
					$(arrow).data('len_container',len_container);
					$(arrow).data('size_scroll',size_scroll);
					$(arrow).data('count_scroll',count_scroll);
					$(arrow).data('count_visible',count_visible);
					$(arrow).data('speed',speed);
					$(arrow).data('type_scroll',type_scroll);
					if(key==0) $(arrow).data('arrow_other',arrow_other);
					else $(arrow).data('arrow_other',element);
				});	
				return arrows;
			}
		},
		intval : function(mixed_var, base) {
			var tmp;
			if(typeof(mixed_var) == 'string') {
				tmp = parseInt(mixed_var);
				if(isNaN(tmp)) return 0;
				else return tmp.toString(base || 10);
			} else if(typeof(mixed_var) == 'number') return Math.floor(mixed_var);
			else return 0;
		},
		findContainer : function(elements,search) {
			var container;
			$.each($(elements).parents(), function(i,element){
				if($(element).find(search).length>0) {
					container = $(element).find(search);
					return false;
				}		
			});
			return container;
		},
		findContainerOverflow : function findContainerOverflow(container) {
			var element;
			if(container.parent().css('overflow')!='hidden') {
				element = this.findContainerOverflow(container.parent());
			} else element = container.parent();
			return element;
		},
		left : function(element){
			var container = $(element).data('container');
			//остановка анимации
			$(container).stop(true,true);
			var arrow_other = $(element).data('arrow_other');
			//определение текущей позиции списка
			var scroll = $(container).css($(element).data('type_scroll'));
				scroll = parseInt(scroll.replace(/px/i,""));
			//выход из функции
			if(scroll==0) return false;
			//вычисление длины, на которую нужно прокрутить список
			scroll = $(element).data('size_scroll')*$(element).data('count_scroll')+scroll;
			//если вычисленная длина больше 0, то приравниваем ее к 0
			if(scroll>0) scroll = 0;
			//определение классов элементов прокрутки
			if($(arrow_other).hasClass('notActive')==true) $(arrow_other).removeClass('notActive');
			if($(element).hasClass('notActive')==true) $(element).removeClass('notActive');
			if(scroll==0) $(element).addClass('notActive');
			var param = new Object();
				param[$(element).data('type_scroll')] = scroll+'px';
			//анимация прокрутки списка
			$(container).animate(param,$(element).data('speed'));
		},
		right : function(element){
			console.log(element);
			var container = $(element).data('container');
			//остановка анимации
			$(container).stop(true,true);
			var arrow_other = $(element).data('arrow_other');
			//определение текущей позиции списка			
			var scroll = $(container).css($(element).data('type_scroll'));
				scroll = parseInt(scroll.replace(/px/i,""));
			//определение максимальной ширины прокрутки списка
			var scroll_max = - $(element).data('len_container')*$(element).data('size_scroll')
				scroll_max += $(element).data('count_visible')*$(element).data('size_scroll');		
			//выход из функции, если количество прокручеваемых элементов больше, чем количество элементов в списке
			if(scroll==scroll_max) return false;	
			//вычисление длины, на которую нужно прокрутить список			
			scroll = scroll - $(element).data('count_scroll')*$(element).data('size_scroll');
			//если вычисленная длина больше максимальной, то прокручеваем на максимальную
			if(scroll<scroll_max) scroll = scroll_max;		
			//определение классов элементов прокрутки
			if($(arrow_other).hasClass('notActive')==true) $(arrow_other).removeClass('notActive');
			if($(element).hasClass('notActive')==true) $(element).removeClass('notActive');
			if(scroll==scroll_max) $(element).addClass('notActive');		
			var param = new Object();
				param[$(element).data('type_scroll')] = scroll+'px';
			//анимация прокрутки списка
			$(container).animate(param,$(element).data('speed'));
		}
	};
})(jQuery);

jQuery(document).ready(function() {
	jQuery.galleryAlvaro.init();
	
	jQuery('[name="right"]').live('click',function(e){
		e.preventDefault();
		if(!jQuery(this).data('events') || !jQuery(this).data('events').click) {
			jQuery.galleryAlvaro.getParams(this,'left');
			jQuery.galleryAlvaro.right(this);		
		}
	});	
	jQuery('[name="left"]').live('click',function(e){
		e.preventDefault();
		if(!jQuery(this).data('events') || !jQuery(this).data('events').click) {
			jQuery.galleryAlvaro.getParams(this,'right');
			jQuery.galleryAlvaro.left(this);
		}
	});
});