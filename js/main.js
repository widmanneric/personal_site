var resizeTimeout;
var isReducedSize = false;
var lockControls = false;

$(document).ready(()=>{
	$('.scrollArrow').hide();
	checkScreenSize();
	applyControls();
});

var showTimeout;
function checkArrow(ele){
		clearTimeout(showTimeout);
		let maxScroll = ele[0].scrollTopMax;
		let currScroll = ele[0].scrollTop;
		// console.log(maxScroll-currScroll);
		if(Math.abs(maxScroll-currScroll)<20 || maxScroll <= 20)
			$('.scrollArrow').fadeOut();
		else
			showTimeout = setTimeout(()=>$('.scrollArrow').fadeIn(),500);
		
			
		
}



function checkScreenSize(){
	let w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	if(w <= 450)
		isReducedSize = true;

}


function applyControls(){
	// let optionsLocked = false;

	$('.waveTarget').on('mouseenter',async function(){
	
		if($(this).hasClass('lock') || isReducedSize)
			return;
		let spans = $(this).find('span');
		let colorI = 0;
		for(let span of spans){
			await animateSpan($(span),$(this));
		}
		
	});

	$('.waveTarget').on('click touch',function(){
		$(this).mouseleave();
	});	

	$('.option').on('click touch',function(){

		if($(this).hasClass('lock') || $(this).hasClass('blocklock') || lockControls)
			return;

		let ele = $(this);
		let isFirstScreen = !$('.mainMenu').attr('style');
		if(isFirstScreen){
			phaseOutMainMenu()
			.then(()=>{
				$(`.${ele.attr('target')}`).removeClass('mini');
				$('.scrollArrow').removeClass('mini');
				checkArrow($(`.${ele.attr('target')}`));
			});
		}
		else{
			transitionPage($(`.${ele.attr('target')}`));
		}
	});

	$('.option').on('click touch',function(){
		if($(this).hasClass('blocklock') || lockControls)
			return;
		$('.blocklock').addClass('unanimateTarget');
		$(this).addClass('blocklock');

		let isFirstScreen = !$('.mainMenu').attr('style');


		if(isFirstScreen){
			setTimeout(function(block){
				//$(window).resize();
				animateOption(block);
			},2800,$(this).find('.block'));
		}
		else{
			animateOption($(this).find('.block'));
			// lockControls = true;
		}
		
		// .then()

		// }
	});

	


	//let scrollHeights = calculateScrollHeights();
	$('.sidebar').on('scroll',function(e){
		let ele = $(this);
		checkArrow(ele);
	});


	$(window).on('resize',(ev)=>{
		clearTimeout(resizeTimeout);
		checkScreenSize();
		resizeTimeout = setTimeout(()=>{
			console.log('resizeend');
			let ele = $('.sidebar:not(.mini)');

			if(ele[0].scrollTopMax<=20)
				$('.scrollArrow').fadeOut();
			else
				$('.scrollArrow').fadeIn();
			
		},500);
	
	})


	
}






//animations___________________________________




function phaseOutMainMenu(){
	$('.control').off('mouseenter click touch');
	// lockControls = true;
	return new Promise((resolve,reject)=>{


		let menu = $('.mainMenu');
		let xMovement = "146%";
		let yMovement = "135%";
		let scale = '.5'
		if(isReducedSize){
			xMovement= '0%';
			yMovement="75%";
			scale = '.7';
		} 
		
		const duration = 800;
	

		menu.velocity({
			scale : scale
		},
		{
			duration : duration,
			easing : 'swing',
		})
		.velocity({
			translateX : xMovement,
			translateY : yMovement
		},{
			easing : 'swing',
			duration : duration,
			complete : ()=>{
				applyControls();
				lockControls = false;
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
	const duration = 200;
	let easing = 'swing';
	let targetWidth = '4';
	if(isReducedSize){
		targetWidth = '3';
		easing = 'linear';
	}
	return new Promise((resolve,reject)=>{
	
		$('.unanimateTarget .block').velocity({
			scaleX : '1',
		},{
			easing : easing,
			duration : duration,
			complete : ()=>{
				lockControls = false;
				$('.unanimateTarget').removeClass('blocklock');
				$('.unanimateTarget').removeClass('unanimateTarget');
			}
		});
		ele.velocity({
			scaleX : targetWidth,
		},{
			easing : easing,
			duration : duration,
			complete : resolve
		});


	})

}


function transitionPage(ele){
	ele.scrollTop(0);
	let duration = 1000;
	// lockControls = true;
	if(isReducedSize){
		$('.sidebar:not(.mini)').addClass('mini');
		ele.removeClass('mini');
		return;
	}

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
		checkArrow(ele);
		// lockControls = false;


		let oldele = $('.sidebar:not(.mini)');

		oldele.addClass('mini');
		ele.removeClass('mini');
		setTimeout(()=>{
			oldele.css('left','');
		},1200)

	})
}




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





