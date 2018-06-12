

$(document).ready(()=>{
	$('.scrollArrow').hide();
	applyControls();
	console.log('in');
});




function applyControls(){


	$('.waveTarget').on('mouseenter',async function(){
	
		if($(this).hasClass('lock'))
			return;
		let spans = $(this).find('span');
		let colorI = 0;
		for(let span of spans){
			await animateSpan($(span),$(this));
		}
		
	});

	$('.option').on('click touch',function(){
		if($(this).hasClass('lock') || $(this).hasClass('blocklock'))
			return;
		let ele = $(this);
		let isFirstScreen = !$('.mainMenu').attr('style');
		if(isFirstScreen){
			phaseOutMainMenu()
			.then(()=>{
				$(`.${ele.attr('target')}`).removeClass('mini');
				$('.scrollArrow').removeClass('mini');
			});
		}
		else{

			transitionPage($(`.${ele.attr('target')}`));
		}
	});

	$('.option').on('click touch',function(){
		if($(this).hasClass('blocklock'))
			return;
		$('.blocklock').addClass('unanimateTarget');
		$(this).addClass('blocklock');

		let isFirstScreen = !$('.mainMenu').attr('style');


		if(isFirstScreen){
			// $('.sidebar').scrollTop(40000);
			// $('.sidebar').scrollTop(0);
			setTimeout(function(block){
				animateOption(block);
			},2500,$(this).find('.block'));
		}
		else
			animateOption($(this).find('.block'));

		// .then()

		// }
	});

	


	//let scrollHeights = calculateScrollHeights();
	$('.sidebar').on('scroll',function(e){
		let ele = $(this);
		let maxScroll = ele[0].scrollTopMax;
		let currScroll = ele[0].scrollTop;
		//console.log("triggered");
		//console.log(Math.abs(maxScroll-currScroll));
		if(Math.abs(maxScroll-currScroll)<10 || maxScroll <= 10){
			//console.log('in2');
			$('.scrollArrow').fadeOut();
		}
		else
			$('.scrollArrow').fadeIn();
	});
	$(window).on('resize',()=>{
		$('.sidebar').each(function(){
			let ele = $(this);
			if(ele[0].scrollTopMax<=10)
				$('.scrollArrow').fadeOut();
			else
				$('.scrollArrow').fadeIn();
		})
	})


	
}






//animations___________________________________




function phaseOutMainMenu(){
	$('.control').off('mouseenter click touch');
	return new Promise((resolve,reject)=>{


		let menu = $('.mainMenu');
		
		const duration = 800;
	

		menu.velocity({
			scale : '.5'
		},
		{
			duration : duration,
			easing : 'swing',
		})
		.velocity({
			translateX : '146%',
			translateY : "135%"
		},{
			easing : 'swing',
			duration : duration,
			complete : ()=>{
				applyControls();
				resolve();
			}
		});

		

	})
}

function animateSpan(aspan,target){


	target.off('mouseleave');
	target.one('mouseleave',function(){
		target.addClass('lock');
		target.find('span').velocity('stop');
		unanimate(target);
	});



	function unanimate(){
		let spans = target.find('span');
		spans.velocity({
				translateY : '0px',
				color : '#000000'
			},{
				duration : 200,
				easing : 'linear',
			});
		
		let unanimateTimeout= setTimeout(verifyFinish,220);

		function verifyFinish(){
			let finished = 0;
			let totalSpans = spans.length;
			spans.each(function(){
				if($(this).attr('style').includes('translateY(0px)'))
					finished++
				else{
					$(this).velocity({
								translateY : '0px',
								color : '#000000'
							},{
								duration : 200,
								easing : 'linear',
							});
				}
			});
			//console.log(`${finished}/${totalSpans}`);
			if(finished==totalSpans){
				target.removeClass('lock');
				clearTimeout(unanimateTimeout);
			}
			else
				unanimateTimeout = setTimeout(verifyFinish,220);
		}
		
		
	}
	return new Promise((resolve,reject)=>{
		const waveDistance = 10;
		const duration = 200;
		const delay = 100;

	
		function start(){
			if(target.hasClass('lock')){
				resolve();
				return;
			}
			aspan.velocity({
				translateY : `-${waveDistance}px`,
			},{
				duration : duration,
				easing : "swing",
				loop : true,
			});
			setTimeout(()=>{
				resolve();
			},delay);
		}

		start();

	});
}

function animateOption(ele){
	const duration = 500;
	return new Promise((resolve,reject)=>{
		$('.unanimateTarget .block').velocity({
			width : '20px'
		},{
			easing : 'swing',
			duration : duration,
			complete : ()=>{
				$('.unanimateTarget').removeClass('blocklock');
				$('.unanimateTarget').removeClass('unanimateTarget');

			}
		});
		ele.velocity({
			width : '60px'
		},{
			easing : 'swing',
			duration : duration,
			complete : ()=>{
				resolve();
			}
		});
	});
}


function transitionPage(ele){
	ele.scrollTop(0);
	$('.scrollArrow').fadeOut();
	new Promise((res,rej)=>{
		$('.sidebar:not(.mini)').velocity({
			left : '-50%'
		},{	
			easing : 'swing',
			duration : 1000,
			complete : res
		})	
	})
	.then(()=>{
	
		if(ele[0].scrollTopMax<=10)
			$('.scrollArrow').fadeOut();
		else
			$('.scrollArrow').fadeIn();

		let oldele = $('.sidebar:not(.mini)');
		oldele.addClass('mini');
		ele.removeClass('mini');
		setTimeout(()=>{
			oldele.css('left','');
		},1200)

	})
}

//__________________________helpers
// function calculateScrollHeights(){
// 	let scrollHeights = {}
// 	$('.sidebar').each(function(){
// 		let ele = $(this);
// 		let section = $(this).attr('section');
// 		ele.scrollTop(40000);
// 		scrollHeights[section] = ele.scrollTop();
// 	})
// 	return scrollHeights;
// }


(function(elmProto){
    if ('scrollTopMax' in elmProto) {
        return;
    }
    Object.defineProperties(elmProto, {
        'scrollTopMax': {
            get: function scrollTopMax() {
              return this.scrollHeight - this.clientHeight;
            }
        },
        'scrollLeftMax': {
            get: function scrollLeftMax() {
              return this.scrollWidth - this.clientWidth;
            }
        }
    });
}
)(Element.prototype);




